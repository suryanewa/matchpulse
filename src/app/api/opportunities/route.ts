import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams

        // Parse query parameters
        const personaId = searchParams.get('persona_id')
        const status = searchParams.get('status')
        const severity = searchParams.get('severity')
        const limit = parseInt(searchParams.get('limit') || '50')
        const offset = parseInt(searchParams.get('offset') || '0')

        // Build where clause
        const where: Record<string, unknown> = {}

        if (status) {
            where.status = status
        }

        if (severity) {
            where.severity = severity
        }

        if (personaId) {
            where.personas = {
                some: { personaId }
            }
        }

        // Fetch opportunities
        const opportunities = await prisma.opportunityCard.findMany({
            where,
            orderBy: [
                { severity: 'desc' },
                { createdAt: 'desc' }
            ],
            take: limit,
            skip: offset,
            include: {
                clusters: {
                    include: {
                        cluster: {
                            select: {
                                id: true,
                                label: true,
                                growthScore: true
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
                                emoji: true,
                                color: true
                            }
                        }
                    }
                }
            }
        })

        // Get total count
        const totalCount = await prisma.opportunityCard.count({ where })

        // Transform to API response
        const response = opportunities.map(opp => ({
            id: opp.id,
            title: opp.title,
            problemStatement: opp.problemStatement,
            signalsSummary: opp.signalsSummary,
            whyNow: opp.whyNow,
            status: opp.status,
            severity: opp.severity,
            confidence: opp.confidence,
            notes: opp.notes,
            createdAt: opp.createdAt,
            updatedAt: opp.updatedAt,

            // Linked clusters
            clusters: opp.clusters.map(c => ({
                id: c.cluster.id,
                title: c.cluster.label,
                growthScore: Math.round(c.cluster.growthScore * 100)
            })),

            // Linked personas
            personas: opp.personas.map(p => ({
                id: p.persona.id,
                name: p.persona.name,
                emoji: p.persona.emoji,
                color: p.persona.color
            }))
        }))

        return NextResponse.json({
            success: true,
            data: response,
            pagination: {
                total: totalCount,
                limit,
                offset,
                hasMore: offset + response.length < totalCount
            }
        })
    } catch (error) {
        console.error('Error fetching opportunities:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch opportunities' },
            { status: 500 }
        )
    }
}
