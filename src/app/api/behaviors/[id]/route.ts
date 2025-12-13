import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

interface RouteParams {
    params: Promise<{ id: string }>
}

export async function GET(
    request: NextRequest,
    context: RouteParams
) {
    try {
        const { id } = await context.params

        const cluster = await prisma.behaviorCluster.findUnique({
            where: { id },
            include: {
                personaLinks: {
                    include: {
                        persona: {
                            select: {
                                id: true,
                                name: true,
                                tagline: true,
                                emoji: true,
                                color: true
                            }
                        }
                    },
                    orderBy: { associationScore: 'desc' }
                },
                memberships: {
                    include: {
                        content: {
                            select: {
                                id: true,
                                title: true,
                                bodyText: true,
                                sourcePlatform: true,
                                sourceType: true,
                                metadata: true,
                                publishedAt: true
                            }
                        }
                    },
                    orderBy: { similarityScore: 'desc' },
                    take: 10 // Top 10 representative posts
                },
                opportunityCards: {
                    include: {
                        opportunity: {
                            select: {
                                id: true,
                                title: true,
                                status: true,
                                severity: true
                            }
                        }
                    }
                }
            }
        })

        if (!cluster) {
            return NextResponse.json(
                { success: false, error: 'Behavior not found' },
                { status: 404 }
            )
        }

        // Transform to detailed API response
        const behavior = {
            id: cluster.id,
            title: cluster.label,
            description: cluster.summary,
            createdAt: cluster.createdAt,
            updatedAt: cluster.updatedAt,

            // Metrics
            mentionCount: cluster.contentCountTotal,
            mentionCountLast7d: cluster.contentCountLast7d,
            growthRate: Math.round(cluster.growthScore * 100),

            // Platform breakdown
            platformBreakdown: cluster.sourceBreakdown,

            // Top phrases
            topPhrases: cluster.topPhrases,

            // All linked personas
            linkedPersonas: cluster.personaLinks.map(link => ({
                personaId: link.persona.id,
                personaName: link.persona.name,
                tagline: link.persona.tagline,
                emoji: link.persona.emoji,
                color: link.persona.color,
                confidence: link.associationScore
            })),

            // Representative content samples
            representativePosts: cluster.memberships.map(m => ({
                id: m.content.id,
                text: m.content.bodyText.substring(0, 280), // Truncate for preview
                title: m.content.title,
                source: m.content.sourcePlatform,
                sourceType: m.content.sourceType,
                publishedAt: m.content.publishedAt,
                similarity: m.similarityScore,
                metadata: m.content.metadata
            })),

            // Related opportunities
            opportunities: cluster.opportunityCards.map(oc => ({
                id: oc.opportunity.id,
                title: oc.opportunity.title,
                status: oc.opportunity.status,
                severity: oc.opportunity.severity
            }))
        }

        return NextResponse.json({
            success: true,
            data: behavior
        })
    } catch (error) {
        console.error('Error fetching behavior:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch behavior' },
            { status: 500 }
        )
    }
}
