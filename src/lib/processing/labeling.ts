/**
 * Cluster Labeling Service
 * 
 * Generates human-readable labels and summaries for BehaviorClusters
 * using n-gram extraction and optionally LLM summarization.
 */

import prisma from '@/lib/db'
import OpenAI from 'openai'

// Configuration
const TOP_PHRASES_COUNT = 10
const USE_LLM_LABELING = true // Set to false for faster, simpler labeling

interface ClusterContent {
    id: string
    label: string
    summary: string
    contentTexts: string[]
}

export class LabelingService {
    private openai: OpenAI | null = null

    constructor() {
        const apiKey = process.env.OPENAI_API_KEY
        if (apiKey && USE_LLM_LABELING) {
            this.openai = new OpenAI({ apiKey })
        }
    }

    /**
     * Generate labels and summaries for all unlabeled clusters
     */
    async labelClusters(): Promise<{ labeled: number }> {
        console.log('🏷️ Starting cluster labeling...')

        // Find clusters needing labels
        const clusters = await prisma.behaviorCluster.findMany({
            where: {
                OR: [
                    { label: 'Unlabeled Cluster' },
                    { topPhrases: { isEmpty: true } }
                ]
            },
            include: {
                memberships: {
                    include: {
                        content: {
                            select: {
                                bodyText: true,
                                title: true
                            }
                        }
                    },
                    take: 50 // Sample of content for labeling
                }
            }
        })

        console.log(`  Found ${clusters.length} clusters to label`)

        let labeled = 0

        for (const cluster of clusters) {
            try {
                // Collect content texts
                const texts = cluster.memberships.map(m =>
                    `${m.content.title || ''} ${m.content.bodyText}`.trim()
                )

                if (texts.length === 0) continue

                // Extract top phrases
                const topPhrases = this.extractTopPhrases(texts)

                // Generate label and summary
                let label: string
                let summary: string

                if (this.openai && USE_LLM_LABELING) {
                    const llmResult = await this.generateLLMLabel(texts.slice(0, 20), topPhrases)
                    label = llmResult.label
                    summary = llmResult.summary
                } else {
                    // Simple heuristic labeling
                    label = this.generateSimpleLabel(topPhrases)
                    summary = `A cluster of ${cluster.contentCountTotal} posts discussing ${topPhrases.slice(0, 3).join(', ')}.`
                }

                // Calculate growth score
                const growthScore = this.calculateGrowthScore(
                    cluster.contentCountLast7d,
                    cluster.contentCountTotal
                )

                // Update cluster
                await prisma.behaviorCluster.update({
                    where: { id: cluster.id },
                    data: {
                        label,
                        summary,
                        topPhrases,
                        growthScore
                    }
                })

                labeled++
                console.log(`  ✓ Labeled: "${label}"`)

            } catch (error) {
                console.error(`  ❌ Error labeling cluster ${cluster.id}:`, error)
            }
        }

        console.log(`✅ Labeling complete: ${labeled} clusters labeled`)
        return { labeled }
    }

    /**
     * Extract top n-grams from content texts
     */
    private extractTopPhrases(texts: string[]): string[] {
        const phraseCounts = new Map<string, number>()

        // Dating-related stop phrases to boost relevance
        const relevantTerms = [
            'dating', 'relationship', 'partner', 'match', 'swipe',
            'ghosting', 'situationship', 'talking stage', 'ick',
            'first date', 'red flag', 'green flag', 'texting',
            'commitment', 'exclusive', 'casual', 'serious'
        ]

        for (const text of texts) {
            // Extract 2-grams and 3-grams
            const words = text.toLowerCase()
                .replace(/[^\w\s]/g, '')
                .split(/\s+/)
                .filter(w => w.length > 2)

            // Bigrams
            for (let i = 0; i < words.length - 1; i++) {
                const bigram = `${words[i]} ${words[i + 1]}`
                phraseCounts.set(bigram, (phraseCounts.get(bigram) || 0) + 1)
            }

            // Trigrams
            for (let i = 0; i < words.length - 2; i++) {
                const trigram = `${words[i]} ${words[i + 1]} ${words[i + 2]}`
                phraseCounts.set(trigram, (phraseCounts.get(trigram) || 0) + 1)
            }
        }

        // Sort by frequency and relevance
        const sorted = Array.from(phraseCounts.entries())
            .filter(([phrase]) => {
                // Filter out common stop phrases
                const stopPhrases = ['i am', 'i was', 'i have', 'it is', 'the the', 'and the', 'to be']
                return !stopPhrases.some(sp => phrase.includes(sp))
            })
            .map(([phrase, count]) => {
                // Boost score for dating-relevant terms
                const boost = relevantTerms.some(t => phrase.includes(t)) ? 2 : 1
                return { phrase, score: count * boost }
            })
            .sort((a, b) => b.score - a.score)
            .slice(0, TOP_PHRASES_COUNT)
            .map(p => p.phrase)

        return sorted
    }

    /**
     * Generate simple label from top phrases
     */
    private generateSimpleLabel(phrases: string[]): string {
        if (phrases.length === 0) return 'Unlabeled Trend'

        // Capitalize first letter of each word
        const label = phrases[0]
            .split(' ')
            .map(w => w.charAt(0).toUpperCase() + w.slice(1))
            .join(' ')

        return label
    }

    /**
     * Generate label and summary using LLM
     */
    private async generateLLMLabel(
        sampleTexts: string[],
        topPhrases: string[]
    ): Promise<{ label: string; summary: string }> {
        if (!this.openai) {
            return {
                label: this.generateSimpleLabel(topPhrases),
                summary: ''
            }
        }

        const prompt = `You are analyzing a cluster of social media posts about dating.

Top phrases in this cluster: ${topPhrases.join(', ')}

Sample posts:
${sampleTexts.slice(0, 5).map((t, i) => `${i + 1}. "${t.substring(0, 200)}..."`).join('\n')}

Based on this, provide:
1. A short, catchy label (3-6 words) that captures the main theme/behavior
2. A 1-2 sentence summary describing this dating trend or behavior

Respond in JSON format: {"label": "...", "summary": "..."}`

        try {
            const response = await this.openai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [{ role: 'user', content: prompt }],
                response_format: { type: 'json_object' },
                max_tokens: 200
            })

            const content = response.choices[0]?.message?.content
            if (content) {
                const result = JSON.parse(content)
                return {
                    label: result.label || this.generateSimpleLabel(topPhrases),
                    summary: result.summary || ''
                }
            }
        } catch (error) {
            console.error('LLM labeling error:', error)
        }

        return {
            label: this.generateSimpleLabel(topPhrases),
            summary: ''
        }
    }

    /**
     * Calculate growth score based on recency of content
     */
    private calculateGrowthScore(last7d: number, total: number): number {
        if (total === 0) return 0

        // Simple growth score: ratio of last 7 days to total
        // Normalized to 0-2 range (1 = normal, >1 = growing, <1 = declining)
        const expectedRatio = 7 / 30 // Expected if evenly distributed
        const actualRatio = last7d / total

        return Math.round((actualRatio / expectedRatio) * 100) / 100
    }
}

/**
 * Run labeling as a standalone job
 */
export async function runLabeling() {
    const service = new LabelingService()
    return service.labelClusters()
}
