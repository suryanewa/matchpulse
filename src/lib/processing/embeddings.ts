/**
 * Embedding Generation Service
 * 
 * Generates vector embeddings for ContentItems using OpenAI's API.
 */

import prisma from '@/lib/db'
import OpenAI from 'openai'

// Configuration
const EMBEDDING_MODEL = 'text-embedding-3-small'
const MAX_TOKENS = 512
const BATCH_SIZE = 100

export class EmbeddingService {
    private openai: OpenAI

    constructor() {
        const apiKey = process.env.OPENAI_API_KEY
        if (!apiKey) {
            throw new Error('OPENAI_API_KEY environment variable is required')
        }
        this.openai = new OpenAI({ apiKey })
    }

    /**
     * Generate embeddings for all ContentItems that don't have one
     */
    async generateEmbeddings(): Promise<{ processed: number; embedded: number }> {
        console.log('🧠 Starting embedding generation...')

        // Find items without embeddings (only recent ones for efficiency)
        const lookbackDays = parseInt(process.env.CONTENT_LOOKBACK_DAYS || '30')
        const cutoffDate = new Date()
        cutoffDate.setDate(cutoffDate.getDate() - lookbackDays)

        // Fetch all items and filter in application code
        const allItems = await prisma.contentItem.findMany({
            where: {
                language: 'en',
                publishedAt: { gte: cutoffDate }
            },
            select: {
                id: true,
                bodyText: true,
                embeddingVector: true
            },
            take: 10000 // Limit for safety
        })

        // Filter for items without embeddings
        const items = allItems.filter((item: typeof allItems[0]) => item.embeddingVector === null)

        console.log(`  Found ${items.length} items to embed`)

        let processed = 0
        let embedded = 0

        // Process in batches
        for (let i = 0; i < items.length; i += BATCH_SIZE) {
            const batch = items.slice(i, i + BATCH_SIZE)

            try {
                const results = await this.embedBatch(batch)

                // Update database with embeddings
                for (const { id, embedding } of results) {
                    if (embedding) {
                        await prisma.contentItem.update({
                            where: { id },
                            data: { embeddingVector: embedding }
                        })
                        embedded++
                    }
                }

                processed += batch.length
                console.log(`  Processed ${processed}/${items.length} items`)

            } catch (error) {
                console.error(`  ❌ Error embedding batch at ${i}:`, error)
            }
        }

        console.log(`✅ Embedding complete: ${embedded}/${processed} items embedded`)
        return { processed, embedded }
    }

    /**
     * Embed a batch of texts
     */
    private async embedBatch(
        items: { id: string; bodyText: string }[]
    ): Promise<{ id: string; embedding: number[] | null }[]> {
        // Preprocess texts
        const texts = items.map(item => this.preprocessText(item.bodyText))

        try {
            const response = await this.openai.embeddings.create({
                model: EMBEDDING_MODEL,
                input: texts
            })

            return items.map((item, index) => ({
                id: item.id,
                embedding: response.data[index]?.embedding || null
            }))
        } catch (error) {
            console.error('OpenAI embedding error:', error)
            return items.map(item => ({ id: item.id, embedding: null }))
        }
    }

    /**
     * Preprocess text for embedding
     */
    private preprocessText(text: string): string {
        // Remove URLs
        let processed = text.replace(/https?:\/\/\S+/g, '')

        // Remove excessive whitespace
        processed = processed.replace(/\s+/g, ' ').trim()

        // Truncate to max tokens (rough estimate: 4 chars per token)
        const maxChars = MAX_TOKENS * 4
        if (processed.length > maxChars) {
            processed = processed.substring(0, maxChars)
        }

        return processed
    }

    /**
     * Generate embedding for a single text
     */
    async embedSingle(text: string): Promise<number[]> {
        const processed = this.preprocessText(text)

        const response = await this.openai.embeddings.create({
            model: EMBEDDING_MODEL,
            input: processed
        })

        return response.data[0]?.embedding || []
    }
}

/**
 * Run embedding generation as a standalone job
 */
export async function runEmbeddingGeneration() {
    const service = new EmbeddingService()
    return service.generateEmbeddings()
}
