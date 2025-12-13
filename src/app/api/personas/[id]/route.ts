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

        const persona = await prisma.persona.findUnique({
            where: { id },
            include: {
                clusterLinks: {
                    include: {
                        cluster: {
                            select: {
                                id: true,
                                label: true,
                                summary: true,
                                topPhrases: true,
                                growthScore: true,
                                contentCountTotal: true,
                                contentCountLast7d: true,
                                sourceBreakdown: true
                            }
                        }
                    },
                    orderBy: { associationScore: 'desc' }
                },
                opportunityCards: {
                    include: {
                        opportunity: {
                            select: {
                                id: true,
                                title: true,
                                problemStatement: true,
                                status: true,
                                severity: true,
                                confidence: true,
                                createdAt: true
                            }
                        }
                    }
                }
            }
        })

        if (!persona) {
            return NextResponse.json(
                { success: false, error: 'Persona not found' },
                { status: 404 }
            )
        }

        // Transform to detailed API response
        const response = {
            id: persona.id,
            name: persona.name,
            tagline: persona.tagline,
            description: persona.description,
            emoji: persona.emoji,
            color: persona.color,

            // Full attribute lists
            keywords: persona.keywords,
            motivations: persona.motivations,
            fears: persona.fears,
            datingGoals: persona.datingGoals,
            typicalBehaviors: persona.typicalBehaviors,
            communicationStyle: persona.communicationStyle,
            painPoints: persona.painPoints,

            // All linked behaviors
            linkedBehaviors: persona.clusterLinks.map(link => ({
                id: link.cluster.id,
                title: link.cluster.label,
                summary: link.cluster.summary,
                topPhrases: link.cluster.topPhrases,
                growthScore: Math.round(link.cluster.growthScore * 100),
                mentionCount: link.cluster.contentCountTotal,
                mentionCountLast7d: link.cluster.contentCountLast7d,
                platformBreakdown: link.cluster.sourceBreakdown,
                confidence: link.associationScore
            })),

            // Linked opportunities
            opportunities: persona.opportunityCards.map(oc => ({
                id: oc.opportunity.id,
                title: oc.opportunity.title,
                problemStatement: oc.opportunity.problemStatement,
                status: oc.opportunity.status,
                severity: oc.opportunity.severity,
                confidence: oc.opportunity.confidence,
                createdAt: oc.opportunity.createdAt
            })),

            // Stats
            stats: {
                linkedBehaviorCount: persona.clusterLinks.length,
                linkedOpportunityCount: persona.opportunityCards.length
            },

            createdAt: persona.createdAt,
            updatedAt: persona.updatedAt
        }

        return NextResponse.json({
            success: true,
            data: response
        })
    } catch (error) {
        console.error('Error fetching persona:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch persona' },
            { status: 500 }
        )
    }
}
