/**
 * Reddit RSS Ingestion Client
 * 
 * Fetches dating-related posts from Reddit using public RSS feeds.
 * No authentication required - great for development or when awaiting API approval.
 */

import prisma from '@/lib/db'

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
const MAX_POSTS_PER_SUBREDDIT = 25 // RSS feeds typically return ~25 items

interface RSSItem {
    title: string
    link: string
    content: string
    id: string
    published: string
    author?: string
}

export class RedditRSSClient {
    private userAgent: string

    constructor() {
        this.userAgent = process.env.REDDIT_USER_AGENT || 'MatchPulse/0.1'
    }

    /**
     * Run the full Reddit RSS ingestion job
     */
    async runIngestion(): Promise<{ processed: number; ingested: number }> {
        console.log('🤖 Starting Reddit RSS ingestion...')

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
                console.log(`  📝 Fetching RSS from r/${subreddit}`)

                try {
                    const { processed, ingested } = await this.fetchSubredditRSS(subreddit)
                    totalProcessed += processed
                    totalIngested += ingested
                } catch (error) {
                    console.error(`  ❌ Error fetching r/${subreddit}:`, error)
                }

                // Small delay between requests to be polite
                await new Promise(resolve => setTimeout(resolve, 1000))
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

            console.log(`✅ Reddit RSS ingestion complete: ${totalIngested}/${totalProcessed} items ingested`)
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
     * Fetch posts from a subreddit's RSS feed
     */
    private async fetchSubredditRSS(
        subreddit: string
    ): Promise<{ processed: number; ingested: number }> {
        const url = `https://www.reddit.com/r/${subreddit}/new.rss`

        const response = await fetch(url, {
            headers: {
                'User-Agent': this.userAgent
            }
        })

        if (!response.ok) {
            throw new Error(`RSS fetch failed: ${response.status}`)
        }

        const xml = await response.text()
        const items = this.parseRSS(xml, subreddit)

        let processed = 0
        let ingested = 0

        for (const item of items.slice(0, MAX_POSTS_PER_SUBREDDIT)) {
            processed++

            const wasIngested = await this.ingestItem(item, subreddit)
            if (wasIngested) ingested++
        }

        return { processed, ingested }
    }

    /**
     * Parse RSS XML into structured items
     */
    private parseRSS(xml: string, subreddit: string): RSSItem[] {
        const items: RSSItem[] = []

        // Simple regex-based XML parsing for RSS entries
        const entryRegex = /<entry>([\s\S]*?)<\/entry>/g
        let match

        while ((match = entryRegex.exec(xml)) !== null) {
            const entry = match[1]

            const title = this.extractTag(entry, 'title')
            const link = this.extractAttribute(entry, 'link', 'href')
            const content = this.extractTag(entry, 'content') || this.extractTag(entry, 'summary')
            const id = this.extractTag(entry, 'id')
            const published = this.extractTag(entry, 'published') || this.extractTag(entry, 'updated')
            const author = this.extractTag(entry, 'name') || undefined // Author name is in <author><name>

            if (title && id) {
                items.push({
                    title: this.decodeHTML(title),
                    link: link || `https://www.reddit.com/r/${subreddit}`,
                    content: content ? this.decodeHTML(this.stripHTML(content)) : '',
                    id,
                    published: published || new Date().toISOString(),
                    author
                })
            }
        }

        return items
    }

    /**
     * Extract content from an XML tag
     */
    private extractTag(xml: string, tagName: string): string | null {
        const regex = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'i')
        const match = regex.exec(xml)
        return match ? match[1].trim() : null
    }

    /**
     * Extract an attribute value from a self-closing tag
     */
    private extractAttribute(xml: string, tagName: string, attrName: string): string | null {
        const regex = new RegExp(`<${tagName}[^>]*${attrName}="([^"]*)"`, 'i')
        const match = regex.exec(xml)
        return match ? match[1] : null
    }

    /**
     * Decode HTML entities
     */
    private decodeHTML(text: string): string {
        return text
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&amp;/g, '&')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .replace(/&nbsp;/g, ' ')
    }

    /**
     * Strip HTML tags from content
     */
    private stripHTML(html: string): string {
        return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
    }

    /**
     * Ingest a single RSS item into the database
     */
    private async ingestItem(item: RSSItem, subreddit: string): Promise<boolean> {
        // Extract post ID from the Reddit ID format (t3_xxxxx)
        const idMatch = item.id.match(/t3_([a-z0-9]+)/i)
        const postId = idMatch ? idMatch[1] : item.id
        const sourceId = `reddit_post_${postId}`

        // Check if already exists
        const existing = await prisma.contentItem.findUnique({
            where: { sourceId }
        })

        if (existing) return false

        // Build body text from title + content
        const bodyText = `${item.title} ${item.content}`.trim()

        // Skip very short content
        if (bodyText.length < 15) return false

        // Parse published date
        let publishedAt: Date
        try {
            publishedAt = new Date(item.published)
            if (isNaN(publishedAt.getTime())) {
                publishedAt = new Date()
            }
        } catch {
            publishedAt = new Date()
        }

        // Create content item
        await prisma.contentItem.create({
            data: {
                sourcePlatform: 'reddit',
                sourceType: 'reddit_post',
                sourceId,
                title: item.title,
                bodyText,
                publishedAt,
                language: 'en', // Assume English for now
                metadata: {
                    subreddit,
                    author: item.author || 'unknown',
                    permalink: item.link,
                    source: 'rss'
                }
            }
        })

        return true
    }
}

/**
 * Run Reddit RSS ingestion as a standalone job
 */
export async function runRedditIngestion() {
    const client = new RedditRSSClient()
    return client.runIngestion()
}
