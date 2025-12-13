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

        const opportunity = await prisma.opportunityCard.findUnique({
            where: { id },
            include: {
                clusters: {
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
                    }
                },
                personas: {
                    include: {
                        persona: {
                            select: {
                                id: true,
                                name: true,
                                tagline: true,
                                emoji: true,
                                color: true,
                                painPoints: true
                            }
                        }
                    }
                }
            }
        })

        if (!opportunity) {
            return NextResponse.json(
                { success: false, error: 'Opportunity not found' },
                { status: 404 }
            )
        }

        // Transform to detailed response
        const response = {
            id: opportunity.id,
            title: opportunity.title,
            problemStatement: opportunity.problemStatement,
            signalsSummary: opportunity.signalsSummary,
            whyNow: opportunity.whyNow,
            status: opportunity.status,
            severity: opportunity.severity,
            confidence: opportunity.confidence,
            notes: opportunity.notes,
            createdAt: opportunity.createdAt,
            updatedAt: opportunity.updatedAt,

            // Full cluster details
            clusters: opportunity.clusters.map(c => ({
                id: c.cluster.id,
                title: c.cluster.label,
                summary: c.cluster.summary,
                topPhrases: c.cluster.topPhrases,
                growthScore: Math.round(c.cluster.growthScore * 100),
                mentionCount: c.cluster.contentCountTotal,
                mentionCountLast7d: c.cluster.contentCountLast7d,
                platformBreakdown: c.cluster.sourceBreakdown
            })),

            // Full persona details
            personas: opportunity.personas.map(p => ({
                id: p.persona.id,
                name: p.persona.name,
                tagline: p.persona.tagline,
                emoji: p.persona.emoji,
                color: p.persona.color,
                painPoints: p.persona.painPoints
            }))
        }

        return NextResponse.json({
            success: true,
            data: response
        })
    } catch (error) {
        console.error('Error fetching opportunity:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch opportunity' },
            { status: 500 }
        )
    }
}

export async function PATCH(
    request: NextRequest,
    context: RouteParams
) {
    try {
        const { id } = await context.params
        const body = await request.json()

        // Validate allowed fields
        const allowedFields = ['status', 'notes', 'severity']
        const updateData: Record<string, unknown> = {}

        for (const field of allowedFields) {
            if (body[field] !== undefined) {
                updateData[field] = body[field]
            }
        }

        // Validate status if provided
        if (updateData.status) {
            const validStatuses = ['new', 'reviewed', 'in_discovery', 'discarded']
            if (!validStatuses.includes(updateData.status as string)) {
                return NextResponse.json(
                    { success: false, error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
                    { status: 400 }
                )
            }
        }

        // Validate severity if provided
        if (updateData.severity) {
            const validSeverities = ['low', 'medium', 'high', 'critical']
            if (!validSeverities.includes(updateData.severity as string)) {
                return NextResponse.json(
                    { success: false, error: `Invalid severity. Must be one of: ${validSeverities.join(', ')}` },
                    { status: 400 }
                )
            }
        }

        const updated = await prisma.opportunityCard.update({
            where: { id },
            data: updateData
        })

        return NextResponse.json({
            success: true,
            data: {
                id: updated.id,
                status: updated.status,
                severity: updated.severity,
                notes: updated.notes,
                updatedAt: updated.updatedAt
            }
        })
    } catch (error) {
        console.error('Error updating opportunity:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to update opportunity' },
            { status: 500 }
        )
    }
}
