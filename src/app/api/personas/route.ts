import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET() {
    try {
        // Fetch all personas with their linked clusters and opportunities
        const personas = await prisma.persona.findMany({
            orderBy: { name: 'asc' },
            include: {
                clusterLinks: {
                    include: {
                        cluster: {
                            select: {
                                id: true,
                                label: true,
                                growthScore: true,
                                contentCountLast7d: true
                            }
                        }
                    },
                    orderBy: { associationScore: 'desc' },
                    take: 5 // Top 5 behaviors per persona
                },
                _count: {
                    select: {
                        clusterLinks: true,
                        opportunityCards: true
                    }
                }
            }
        })

        // Transform to API response format
        const response = personas.map(persona => ({
            id: persona.id,
            name: persona.name,
            tagline: persona.tagline,
            description: persona.description,
            emoji: persona.emoji,
            color: persona.color,

            // Stats
            linkedClusterCount: persona._count.clusterLinks,
            linkedOpportunityCount: persona._count.opportunityCards,

            // Top behaviors
            topBehaviors: persona.clusterLinks.map(link => ({
                id: link.cluster.id,
                title: link.cluster.label,
                growthScore: Math.round(link.cluster.growthScore * 100),
                mentionCountLast7d: link.cluster.contentCountLast7d,
                confidence: link.associationScore
            })),

            // Attributes
            motivations: persona.motivations,
            fears: persona.fears,
            datingGoals: persona.datingGoals,
            typicalBehaviors: persona.typicalBehaviors,
            painPoints: persona.painPoints
        }))

        return NextResponse.json({
            success: true,
            data: response
        })
    } catch (error) {
        console.error('Error fetching personas:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch personas' },
            { status: 500 }
        )
    }
}
