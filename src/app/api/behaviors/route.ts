import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams

        // Parse query parameters
        const timeWindow = searchParams.get('time_window') || '30d'
        const sortBy = searchParams.get('sort_by') || 'growth_score'
        const minGrowth = parseFloat(searchParams.get('min_growth') || '0')
        const personaId = searchParams.get('persona_id')
        const sourcePlatform = searchParams.get('source_platform')
        const limit = parseInt(searchParams.get('limit') || '50')
        const offset = parseInt(searchParams.get('offset') || '0')

        // Build where clause
        const where: Record<string, unknown> = {
            growthScore: { gte: minGrowth }
        }

        // Filter by persona if specified
        if (personaId) {
            where.personaLinks = {
                some: { personaId }
            }
        }

        // Determine sort order
        type SortOrder = 'desc' | 'asc'
        let orderBy: Record<string, SortOrder> = {}
        switch (sortBy) {
            case 'fastest_rising':
            case 'growth_score':
                orderBy = { growthScore: 'desc' }
                break
            case 'most_mentioned':
                orderBy = { contentCountTotal: 'desc' }
                break
            case 'newest':
                orderBy = { createdAt: 'desc' }
                break
            default:
                orderBy = { growthScore: 'desc' }
        }

        // Fetch clusters with related data
        const clusters = await prisma.behaviorCluster.findMany({
            where,
            orderBy,
            take: limit,
            skip: offset,
            include: {
                personaLinks: {
                    include: {
                        persona: {
                            select: {
                                id: true,
                                name: true,
                                emoji: true,
                                color: true
                            }
                        }
                    },
                    orderBy: { associationScore: 'desc' },
                    take: 3
                },
                _count: {
                    select: { memberships: true }
                }
            }
        })

        // Get total count for pagination
        const totalCount = await prisma.behaviorCluster.count({ where })

        // Transform to API response format
        const behaviors = clusters.map(cluster => ({
            id: cluster.id,
            title: cluster.label,
            description: cluster.summary,
            createdAt: cluster.createdAt,
            updatedAt: cluster.updatedAt,

            // Metrics
            mentionCount: cluster.contentCountTotal,
            mentionCountLast7d: cluster.contentCountLast7d,
            growthRate: Math.round(cluster.growthScore * 100), // Convert to percentage

            // Platform breakdown
            platformBreakdown: cluster.sourceBreakdown,

            // Top phrases
            topPhrases: cluster.topPhrases,

            // Linked personas (top 3)
            linkedPersonas: cluster.personaLinks.map(link => ({
                personaId: link.persona.id,
                personaName: link.persona.name,
                emoji: link.persona.emoji,
                color: link.persona.color,
                confidence: link.associationScore
            })),

            // Content count from memberships
            contentCount: cluster._count.memberships
        }))

        return NextResponse.json({
            success: true,
            data: behaviors,
            pagination: {
                total: totalCount,
                limit,
                offset,
                hasMore: offset + behaviors.length < totalCount
            }
        })
    } catch (error) {
        console.error('Error fetching behaviors:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch behaviors' },
            { status: 500 }
        )
    }
}
