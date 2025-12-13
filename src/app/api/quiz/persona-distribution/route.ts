import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

// GET /api/quiz/persona-distribution - Get aggregated counts per persona
export async function GET() {
    try {
        // Get count of quiz results grouped by primary persona
        const results = await prisma.quizResult.groupBy({
            by: ['primaryPersonaId'],
            _count: {
                id: true
            }
        })

        // Fetch persona details for each
        const personaIds = results.map(r => r.primaryPersonaId)
        const personas = await prisma.persona.findMany({
            where: { id: { in: personaIds } },
            select: {
                id: true,
                name: true,
                emoji: true,
                color: true
            }
        })

        // Combine data
        const distribution = results.map(result => {
            const persona = personas.find(p => p.id === result.primaryPersonaId)
            return {
                personaId: result.primaryPersonaId,
                personaName: persona?.name || 'Unknown',
                emoji: persona?.emoji || '❓',
                color: persona?.color || '#888',
                count: result._count.id
            }
        }).sort((a, b) => b.count - a.count)

        // Calculate total and percentages
        const total = distribution.reduce((sum, d) => sum + d.count, 0)

        return NextResponse.json({
            success: true,
            data: {
                distribution: distribution.map(d => ({
                    ...d,
                    percentage: total > 0 ? Math.round((d.count / total) * 100) : 0
                })),
                total
            }
        })
    } catch (error) {
        console.error('Error fetching persona distribution:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch persona distribution' },
            { status: 500 }
        )
    }
}
