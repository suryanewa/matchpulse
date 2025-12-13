/**
 * Reddit API Ingestion Client
 * 
 * Fetches dating-related posts and comments from Reddit
 * using Reddit's public JSON API.
 */

import prisma from '@/lib/db'
import { Prisma } from '@prisma/client'

// Subreddits to monitor
const SUBREDDITS = [
    'dating',
    'dating_advice',
    'relationships',
    'relationship_advice',
    'Tinder',
    'hingeapp',
    'Bumble'
]

// Maximum posts per subreddit
const MAX_POSTS_PER_SUBREDDIT = 100

// Maximum total posts per day
const MAX_POSTS_PER_DAY = 3000

// Whether to fetch comments for high-score posts
const FETCH_COMMENTS = true
const COMMENT_SCORE_THRESHOLD = 50
const MAX_COMMENTS_PER_POST = 5

interface RedditPost {
    data: {
        id: string
        title: string
        selftext: string
        subreddit: string
        score: number
        num_comments: number
        created_utc: number
        permalink: string
        author: string
        url: string
        is_self: boolean
        over_18: boolean
    }
}

interface RedditComment {
    data: {
        id: string
        body: string
        score: number
        created_utc: number
        author: string
        link_id: string
        parent_id: string
    }
}

interface RedditListingResponse {
    data: {
        children: RedditPost[]
        after: string | null
    }
}

interface RedditCommentsResponse {
    data: {
        children: RedditComment[]
    }
}

export class RedditIngestionClient {
    private userAgent: string
    private baseUrl = 'https://oauth.reddit.com'
    private accessToken: string | null = null
    private tokenExpiry: number = 0

    constructor() {
        this.userAgent = process.env.REDDIT_USER_AGENT || 'MatchPulse/0.1'
    }

    /**
     * Get OAuth access token for Reddit API
     */
    private async getAccessToken(): Promise<string> {
        // Return cached token if still valid
        if (this.accessToken && Date.now() < this.tokenExpiry) {
            return this.accessToken
        }

        const clientId = process.env.REDDIT_CLIENT_ID
        const clientSecret = process.env.REDDIT_CLIENT_SECRET

        if (!clientId || !clientSecret) {
            throw new Error('REDDIT_CLIENT_ID and REDDIT_CLIENT_SECRET are required')
        }

        const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')

        const response = await fetch('https://www.reddit.com/api/v1/access_token', {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': this.userAgent
            },
            body: 'grant_type=client_credentials'
        })

        if (!response.ok) {
            const error = await response.text()
            throw new Error(`Reddit auth error: ${response.status} - ${error}`)
        }

        const data = await response.json()
        this.accessToken = data.access_token
        this.tokenExpiry = Date.now() + (data.expires_in - 60) * 1000 // Subtract 60s for safety

        return this.accessToken!
    }

    /**
     * Make authenticated request to Reddit API
     */
    private async fetchReddit(endpoint: string): Promise<unknown> {
        const token = await this.getAccessToken()

        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'User-Agent': this.userAgent
            }
        })

        if (!response.ok) {
            const error = await response.text()
            throw new Error(`Reddit API error: ${response.status} - ${error}`)
        }

        // Handle rate limiting
        const remaining = response.headers.get('x-ratelimit-remaining')
        if (remaining && parseInt(remaining) < 10) {
            const reset = response.headers.get('x-ratelimit-reset')
            if (reset) {
                console.log(`  ⏳ Rate limit approaching, waiting ${reset}s`)
                await new Promise(resolve => setTimeout(resolve, parseInt(reset) * 1000))
            }
        }

        return response.json()
    }

    /**
     * Run the full Reddit ingestion job
     */
    async runIngestion(): Promise<{ processed: number; ingested: number }> {
        console.log('🤖 Starting Reddit ingestion...')

        // Create ingestion run record
        const run = await prisma.ingestionRun.create({
            data: {
                source: 'reddit',
                status: 'running'
            }
        })

        try {
            let totalProcessed = 0
            let totalIngested = 0

            // Iterate through subreddits
            for (const subreddit of SUBREDDITS) {
                if (totalProcessed >= MAX_POSTS_PER_DAY) {
                    console.log(`  ⚠️ Reached daily limit of ${MAX_POSTS_PER_DAY} posts`)
                    break
                }

                console.log(`  📝 Fetching from r/${subreddit}`)

                try {
                    // Fetch new posts
                    const { processed, ingested } = await this.fetchSubredditPosts(
                        subreddit,
                        MAX_POSTS_PER_DAY - totalProcessed
                    )

                    totalProcessed += processed
                    totalIngested += ingested
                } catch (error) {
                    console.error(`  ❌ Error fetching r/${subreddit}:`, error)
                }
            }

            // Update run record
            await prisma.ingestionRun.update({
                where: { id: run.id },
                data: {
                    status: 'completed',
                    completedAt: new Date(),
                    itemsProcessed: totalProcessed,
                    itemsIngested: totalIngested
                }
            })

            console.log(`✅ Reddit ingestion complete: ${totalIngested}/${totalProcessed} items ingested`)
            return { processed: totalProcessed, ingested: totalIngested }

        } catch (error) {
            // Update run record with error
            await prisma.ingestionRun.update({
                where: { id: run.id },
                data: {
                    status: 'failed',
                    completedAt: new Date(),
                    error: error instanceof Error ? error.message : 'Unknown error'
                }
            })
            throw error
        }
    }

    /**
     * Fetch posts from a subreddit
     */
    private async fetchSubredditPosts(
        subreddit: string,
        maxPosts: number
    ): Promise<{ processed: number; ingested: number }> {
        const limit = Math.min(maxPosts, MAX_POSTS_PER_SUBREDDIT)

        // Fetch new posts (last 24 hours of "hot" and "new")
        const [hotPosts, newPosts] = await Promise.all([
            this.fetchReddit(`/r/${subreddit}/hot?limit=${Math.floor(limit / 2)}`),
            this.fetchReddit(`/r/${subreddit}/new?limit=${Math.floor(limit / 2)}`)
        ])

        const allPosts = [
            ...((hotPosts as RedditListingResponse).data?.children || []),
            ...((newPosts as RedditListingResponse).data?.children || [])
        ]

        // Deduplicate by ID
        const uniquePosts = new Map<string, RedditPost>()
        for (const post of allPosts) {
            uniquePosts.set(post.data.id, post)
        }

        let processed = 0
        let ingested = 0

        for (const post of Array.from(uniquePosts.values())) {
            processed++

            try {
                const wasIngested = await this.ingestPost(post)
                if (wasIngested) {
                    ingested++

                    // Fetch comments for high-score posts
                    if (FETCH_COMMENTS && post.data.score >= COMMENT_SCORE_THRESHOLD) {
                        const commentResult = await this.fetchAndIngestComments(
                            subreddit,
                            post.data.id
                        )
                        processed += commentResult.processed
                        ingested += commentResult.ingested
                    }
                }
            } catch (error) {
                console.error(`  ❌ Error ingesting post ${post.data.id}:`, error)
            }
        }

        return { processed, ingested }
    }

    /**
     * Fetch and ingest top comments for a post
     */
    private async fetchAndIngestComments(
        subreddit: string,
        postId: string
    ): Promise<{ processed: number; ingested: number }> {
        try {
            const response = await this.fetchReddit(
                `/r/${subreddit}/comments/${postId}?limit=${MAX_COMMENTS_PER_POST}&sort=top`
            )

            // Reddit returns an array: [post, comments]
            const commentsData = (response as RedditCommentsResponse[])[1]
            const comments = commentsData?.data?.children || []

            let processed = 0
            let ingested = 0

            for (const comment of comments) {
                if (comment.data?.body && comment.data.body !== '[deleted]') {
                    processed++
                    const wasIngested = await this.ingestComment(comment, subreddit)
                    if (wasIngested) ingested++
                }
            }

            return { processed, ingested }
        } catch (error) {
            console.error(`  ❌ Error fetching comments for ${postId}:`, error)
            return { processed: 0, ingested: 0 }
        }
    }

    /**
     * Ingest a single post into the database
     */
    private async ingestPost(post: RedditPost): Promise<boolean> {
        const { data } = post

        // Skip NSFW content
        if (data.over_18) return false

        // Skip deleted/removed posts
        if (data.selftext === '[deleted]' || data.selftext === '[removed]') return false

        const sourceId = `reddit_post_${data.id}`

        // Check if already exists
        const existing = await prisma.contentItem.findUnique({
            where: { sourceId }
        })

        if (existing) return false

        // Build body text from title + selftext
        const bodyText = `${data.title} ${data.selftext || ''}`.trim()

        // Skip very short content
        if (bodyText.length < 15) return false

        // Create content item
        await prisma.contentItem.create({
            data: {
                sourcePlatform: 'reddit',
                sourceType: 'reddit_post',
                sourceId,
                title: data.title,
                bodyText,
                publishedAt: new Date(data.created_utc * 1000),
                language: 'en', // Assume English for now
                metadata: {
                    subreddit: data.subreddit,
                    score: data.score,
                    numComments: data.num_comments,
                    author: data.author,
                    permalink: `https://reddit.com${data.permalink}`,
                    url: data.url,
                    isSelf: data.is_self
                }
            }
        })

        return true
    }

    /**
     * Ingest a single comment into the database
     */
    private async ingestComment(comment: RedditComment, subreddit: string): Promise<boolean> {
        const { data } = comment

        const sourceId = `reddit_comment_${data.id}`

        // Check if already exists
        const existing = await prisma.contentItem.findUnique({
            where: { sourceId }
        })

        if (existing) return false

        const bodyText = data.body.trim()

        // Skip very short content
        if (bodyText.length < 15) return false

        // Create content item
        await prisma.contentItem.create({
            data: {
                sourcePlatform: 'reddit',
                sourceType: 'reddit_comment',
                sourceId,
                title: null,
                bodyText,
                publishedAt: new Date(data.created_utc * 1000),
                language: 'en',
                metadata: {
                    subreddit,
                    score: data.score,
                    author: data.author,
                    linkId: data.link_id,
                    parentId: data.parent_id
                }
            }
        })

        return true
    }
}

/**
 * Run Reddit ingestion as a standalone job
 */
export async function runRedditIngestion() {
    const client = new RedditIngestionClient()
    return client.runIngestion()
}
