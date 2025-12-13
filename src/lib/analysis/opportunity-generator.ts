/**
 * Opportunity Generation Service
 * 
 * Creates PM-ready OpportunityCards from cluster/persona pairings
 * based on activity thresholds and growth patterns.
 */

import prisma from '@/lib/db'

// Configuration
const MIN_CONTENT_COUNT = 20
const MIN_GROWTH_SCORE = parseFloat(process.env.MIN_GROWTH_SCORE || '0.5')

export class OpportunityGeneratorService {
    /**
     * Generate opportunity cards from qualifying clusters
     */
    async generateOpportunities(): Promise<{ created: number; updated: number }> {
        console.log('💡 Starting opportunity generation...')

        // Get qualifying clusters with persona links
        const clusters = await prisma.behaviorCluster.findMany({
            where: {
                contentCountLast7d: { gte: MIN_CONTENT_COUNT },
                growthScore: { gte: MIN_GROWTH_SCORE }
            },
            include: {
                personaLinks: {
                    include: {
                        persona: {
                            select: {
                                id: true,
                                name: true,
                                painPoints: true
                            }
                        }
                    },
                    where: { associationScore: { gte: 0.5 } }
                }
            }
        })

        console.log(`  Found ${clusters.length} qualifying clusters`)

        let created = 0
        let updated = 0

        for (const cluster of clusters) {
            // Skip clusters without persona associations
            if (cluster.personaLinks.length === 0) continue

            try {
                const { wasCreated } = await this.createOrUpdateOpportunity(cluster)
                if (wasCreated) created++
                else updated++
            } catch (error) {
                console.error(`  ❌ Error generating opportunity for cluster ${cluster.id}:`, error)
            }
        }

        console.log(`✅ Opportunity generation complete: ${created} created, ${updated} updated`)
        return { created, updated }
    }

    /**
     * Create or update an opportunity card for a cluster
     */
    private async createOrUpdateOpportunity(
        cluster: {
            id: string
            label: string
            summary: string
            topPhrases: string[]
            contentCountTotal: number
            contentCountLast7d: number
            growthScore: number
            sourceBreakdown: unknown
            personaLinks: Array<{
                persona: {
                    id: string
                    name: string
                    painPoints: string[]
                }
                associationScore: number
            }>
        }
    ): Promise<{ wasCreated: boolean }> {
        // Check for existing opportunity with this cluster
        const existing = await prisma.opportunityCard.findFirst({
            where: {
                clusters: { some: { clusterId: cluster.id } }
            },
            include: {
                clusters: true,
                personas: true
            }
        })

        // Get primary persona
        const primaryPersona = cluster.personaLinks[0]?.persona

        // Generate opportunity text
        const title = this.generateTitle(cluster.label, primaryPersona?.name)
        const problemStatement = this.generateProblemStatement(
            cluster.summary,
            primaryPersona?.painPoints || []
        )
        const signalsSummary = this.generateSignalsSummary(
            cluster.contentCountTotal,
            cluster.contentCountLast7d,
            cluster.topPhrases,
            cluster.sourceBreakdown
        )
        const whyNow = this.generateWhyNow(cluster.growthScore)
        const severity = this.calculateSeverity(cluster.growthScore, cluster.contentCountLast7d)
        const confidence = Math.min(1, cluster.personaLinks[0]?.associationScore || 0.5)

        if (existing) {
            // Update existing opportunity (preserve manual status)
            await prisma.opportunityCard.update({
                where: { id: existing.id },
                data: {
                    title,
                    problemStatement,
                    signalsSummary,
                    whyNow,
                    severity,
                    confidence
                    // Don't update status or notes - those are user-controlled
                }
            })

            return { wasCreated: false }
        }

        // Create new opportunity
        const opportunity = await prisma.opportunityCard.create({
            data: {
                title,
                problemStatement,
                signalsSummary,
                whyNow,
                status: 'new',
                severity,
                confidence
            }
        })

        // Link to cluster
        await prisma.opportunityCardCluster.create({
            data: {
                opportunityId: opportunity.id,
                clusterId: cluster.id
            }
        })

        // Link to personas
        for (const link of cluster.personaLinks) {
            await prisma.opportunityCardPersona.create({
                data: {
                    opportunityId: opportunity.id,
                    personaId: link.persona.id
                }
            })
        }

        return { wasCreated: true }
    }

    /**
     * Generate opportunity title
     */
    private generateTitle(clusterLabel: string, personaName?: string): string {
        if (personaName) {
            return `${clusterLabel} - Opportunity for ${personaName}`
        }
        return `${clusterLabel} - Emerging Behavior`
    }

    /**
     * Generate problem statement
     */
    private generateProblemStatement(summary: string, painPoints: string[]): string {
        const relevantPain = painPoints.slice(0, 2).join('; ')

        if (relevantPain) {
            return `${summary}\n\nRelated pain points: ${relevantPain}`
        }

        return summary
    }

    /**
     * Generate signals summary
     */
    private generateSignalsSummary(
        total: number,
        last7d: number,
        phrases: string[],
        sourceBreakdown: unknown
    ): string {
        const parts: string[] = []

        parts.push(`${total.toLocaleString()} total mentions (${last7d.toLocaleString()} in last 7 days)`)

        if (phrases.length > 0) {
            parts.push(`Key phrases: "${phrases.slice(0, 3).join('", "')}"`)
        }

        if (sourceBreakdown && typeof sourceBreakdown === 'object') {
            const breakdown = Object.entries(sourceBreakdown as Record<string, number>)
                .map(([platform, ratio]) => `${platform}: ${Math.round(ratio * 100)}%`)
                .join(', ')
            parts.push(`Sources: ${breakdown}`)
        }

        return parts.join('\n')
    }

    /**
     * Generate "why now" explanation
     */
    private generateWhyNow(growthScore: number): string {
        const growthPercent = Math.round((growthScore - 1) * 100)

        if (growthPercent > 100) {
            return `🔥 Explosive growth: ${growthPercent}% above baseline activity in the past week. This trend is rapidly gaining traction and represents immediate opportunity.`
        } else if (growthPercent > 50) {
            return `📈 Strong momentum: ${growthPercent}% above baseline. This behavior is accelerating and warrants attention.`
        } else if (growthPercent > 0) {
            return `📊 Growing trend: ${growthPercent}% above baseline. Early signs of increasing relevance.`
        } else {
            return `📋 Consistent signal: This behavior maintains steady engagement and represents an ongoing user need.`
        }
    }

    /**
     * Calculate severity based on metrics
     */
    private calculateSeverity(growthScore: number, contentCount: number): string {
        const score = growthScore * (Math.log10(contentCount + 1) / 3)

        if (score > 1.5) return 'critical'
        if (score > 1.0) return 'high'
        if (score > 0.5) return 'medium'
        return 'low'
    }
}

/**
 * Run opportunity generation as a standalone job
 */
export async function runOpportunityGeneration() {
    const service = new OpportunityGeneratorService()
    return service.generateOpportunities()
}
