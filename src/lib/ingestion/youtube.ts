/**
 * YouTube Data API v3 Ingestion Client
 * 
 * Fetches dating-related video metadata (titles, descriptions) from YouTube
 * including Shorts using the YouTube Data API.
 */

import prisma from '@/lib/db'

// Search queries for dating-related content
const SEARCH_QUERIES = [
    'modern dating',
    'situationship',
    'first date ideas',
    'icks green flags',
    'ghosting dating',
    'relationship advice',
    'dating tips',
    'talking stage',
    'dating app',
    'red flags dating'
]

// Maximum videos to fetch per query
const MAX_RESULTS_PER_QUERY = 50

// Maximum total videos per day
const MAX_VIDEOS_PER_DAY = 2000

interface YouTubeSearchItem {
    id: { videoId: string }
    snippet: {
        title: string
        description: string
        channelTitle: string
        channelId: string
        publishedAt: string
        thumbnails: {
            default?: { url: string }
        }
    }
}

interface YouTubeVideoDetails {
    id: string
    statistics?: {
        viewCount?: string
        likeCount?: string
        commentCount?: string
    }
    contentDetails?: {
        duration?: string
    }
}

interface YouTubeSearchResponse {
    items: YouTubeSearchItem[]
    nextPageToken?: string
}

interface YouTubeVideosResponse {
    items: YouTubeVideoDetails[]
}

export class YouTubeIngestionClient {
    private apiKey: string
    private baseUrl = 'https://www.googleapis.com/youtube/v3'

    constructor() {
        const apiKey = process.env.YOUTUBE_API_KEY
        if (!apiKey) {
            throw new Error('YOUTUBE_API_KEY environment variable is required')
        }
        this.apiKey = apiKey
    }

    /**
     * Run the full YouTube ingestion job
     */
    async runIngestion(): Promise<{ processed: number; ingested: number }> {
        console.log('🎬 Starting YouTube ingestion...')

        // Create ingestion run record
        const run = await prisma.ingestionRun.create({
            data: {
                source: 'youtube',
                status: 'running'
            }
        })

        try {
            // Calculate date for last 7 days
            const publishedAfter = new Date()
            publishedAfter.setDate(publishedAfter.getDate() - 7)

            let totalProcessed = 0
            let totalIngested = 0
            const seenVideoIds = new Set<string>()

            // Iterate through search queries
            for (const query of SEARCH_QUERIES) {
                if (totalProcessed >= MAX_VIDEOS_PER_DAY) {
                    console.log(`  ⚠️ Reached daily limit of ${MAX_VIDEOS_PER_DAY} videos`)
                    break
                }

                console.log(`  🔍 Searching for: "${query}"`)

                const videos = await this.searchVideos(query, publishedAfter)

                for (const video of videos) {
                    if (seenVideoIds.has(video.id.videoId)) continue
                    seenVideoIds.add(video.id.videoId)

                    if (totalProcessed >= MAX_VIDEOS_PER_DAY) break
                    totalProcessed++

                    try {
                        const ingested = await this.ingestVideo(video)
                        if (ingested) totalIngested++
                    } catch (error) {
                        console.error(`  ❌ Error ingesting video ${video.id.videoId}:`, error)
                    }
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

            console.log(`✅ YouTube ingestion complete: ${totalIngested}/${totalProcessed} videos ingested`)
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
     * Search for videos matching a query
     */
    private async searchVideos(query: string, publishedAfter: Date): Promise<YouTubeSearchItem[]> {
        const params = new URLSearchParams({
            part: 'snippet',
            q: query,
            type: 'video',
            order: 'date',
            maxResults: String(MAX_RESULTS_PER_QUERY),
            publishedAfter: publishedAfter.toISOString(),
            relevanceLanguage: 'en',
            key: this.apiKey
        })

        const response = await fetch(`${this.baseUrl}/search?${params}`)

        if (!response.ok) {
            const error = await response.text()
            throw new Error(`YouTube API error: ${response.status} - ${error}`)
        }

        const data: YouTubeSearchResponse = await response.json()
        return data.items || []
    }

    /**
     * Get video statistics (views, likes, comments)
     */
    private async getVideoDetails(videoIds: string[]): Promise<Map<string, YouTubeVideoDetails>> {
        if (videoIds.length === 0) return new Map()

        const params = new URLSearchParams({
            part: 'statistics,contentDetails',
            id: videoIds.join(','),
            key: this.apiKey
        })

        const response = await fetch(`${this.baseUrl}/videos?${params}`)

        if (!response.ok) {
            console.error('Failed to fetch video details')
            return new Map()
        }

        const data: YouTubeVideosResponse = await response.json()
        const map = new Map<string, YouTubeVideoDetails>()

        for (const video of data.items || []) {
            map.set(video.id, video)
        }

        return map
    }

    /**
     * Ingest a single video into the database
     */
    private async ingestVideo(video: YouTubeSearchItem): Promise<boolean> {
        const sourceId = video.id.videoId

        // Check if already exists
        const existing = await prisma.contentItem.findUnique({
            where: { sourceId }
        })

        if (existing) {
            return false // Skip duplicates
        }

        // Get video details for statistics
        const detailsMap = await this.getVideoDetails([sourceId])
        const details = detailsMap.get(sourceId)

        // Build body text from title + description
        const bodyText = `${video.snippet.title} ${video.snippet.description}`.trim()

        // Skip very short content
        if (bodyText.length < 15) {
            return false
        }

        // Create content item
        await prisma.contentItem.create({
            data: {
                sourcePlatform: 'youtube',
                sourceType: 'video',
                sourceId,
                title: video.snippet.title,
                bodyText,
                publishedAt: new Date(video.snippet.publishedAt),
                language: 'en', // We're filtering by English
                metadata: {
                    channelTitle: video.snippet.channelTitle,
                    channelId: video.snippet.channelId,
                    thumbnail: video.snippet.thumbnails?.default?.url,
                    url: `https://www.youtube.com/watch?v=${sourceId}`,
                    viewCount: details?.statistics?.viewCount ? parseInt(details.statistics.viewCount) : null,
                    likeCount: details?.statistics?.likeCount ? parseInt(details.statistics.likeCount) : null,
                    commentCount: details?.statistics?.commentCount ? parseInt(details.statistics.commentCount) : null,
                    duration: details?.contentDetails?.duration
                }
            }
        })

        return true
    }
}

/**
 * Run YouTube ingestion as a standalone job
 */
export async function runYouTubeIngestion() {
    const client = new YouTubeIngestionClient()
    return client.runIngestion()
}
