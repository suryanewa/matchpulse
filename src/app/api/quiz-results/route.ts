import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

// POST /api/quiz-results - Submit quiz answers and get persona result
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { answers, metadata } = body

        if (!answers || typeof answers !== 'object') {
            return NextResponse.json(
                { success: false, error: 'Answers are required' },
                { status: 400 }
            )
        }

        // Fetch all quiz options for the answered questions
        const questionIds = Object.keys(answers)
        const questions = await prisma.quizQuestion.findMany({
            where: { id: { in: questionIds } },
            include: { options: true }
        })

        // Calculate scores for each persona
        const personaScores: Record<string, number> = {}

        for (const question of questions) {
            const selectedOptionId = answers[question.id]
            const selectedOption = question.options.find(o => o.id === selectedOptionId)

            if (selectedOption && selectedOption.scores) {
                const scores = selectedOption.scores as Record<string, number>
                for (const [personaName, score] of Object.entries(scores)) {
                    personaScores[personaName] = (personaScores[personaName] || 0) + score
                }
            }
        }

        // Find the persona with highest score
        const sortedPersonas = Object.entries(personaScores)
            .sort(([, a], [, b]) => b - a)

        if (sortedPersonas.length === 0) {
            return NextResponse.json(
                { success: false, error: 'Could not determine persona from answers' },
                { status: 400 }
            )
        }

        const primaryPersonaName = sortedPersonas[0][0]
        const secondaryPersonaName = sortedPersonas[1]?.[0]

        // Fetch persona details
        const [primaryPersona, secondaryPersona] = await Promise.all([
            prisma.persona.findFirst({ where: { name: primaryPersonaName } }),
            secondaryPersonaName
                ? prisma.persona.findFirst({ where: { name: secondaryPersonaName } })
                : null
        ])

        if (!primaryPersona) {
            return NextResponse.json(
                { success: false, error: 'Primary persona not found' },
                { status: 500 }
            )
        }

        // Save quiz result
        const quizResult = await prisma.quizResult.create({
            data: {
                primaryPersonaId: primaryPersona.id,
                secondaryPersonaId: secondaryPersona?.id,
                scores: personaScores,
                answers,
                metadata: metadata || {}
            }
        })

        return NextResponse.json({
            success: true,
            data: {
                resultId: quizResult.id,
                primaryPersona: {
                    id: primaryPersona.id,
                    name: primaryPersona.name,
                    tagline: primaryPersona.tagline,
                    description: primaryPersona.description,
                    emoji: primaryPersona.emoji,
                    color: primaryPersona.color,
                    score: personaScores[primaryPersonaName],
                    motivations: primaryPersona.motivations,
                    fears: primaryPersona.fears,
                    datingGoals: primaryPersona.datingGoals,
                    typicalBehaviors: primaryPersona.typicalBehaviors,
                    painPoints: primaryPersona.painPoints
                },
                secondaryPersona: secondaryPersona ? {
                    id: secondaryPersona.id,
                    name: secondaryPersona.name,
                    tagline: secondaryPersona.tagline,
                    emoji: secondaryPersona.emoji,
                    color: secondaryPersona.color,
                    score: personaScores[secondaryPersonaName]
                } : null,
                allScores: personaScores
            }
        })
    } catch (error) {
        console.error('Error submitting quiz result:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to submit quiz result' },
            { status: 500 }
        )
    }
}

// GET /api/quiz-results - Get quiz questions (for the quiz frontend)
export async function GET() {
    try {
        const questions = await prisma.quizQuestion.findMany({
            orderBy: { order: 'asc' },
            include: {
                options: {
                    select: {
                        id: true,
                        text: true
                        // Don't expose scores to frontend
                    }
                }
            }
        })

        return NextResponse.json({
            success: true,
            data: questions.map(q => ({
                id: q.id,
                order: q.order,
                text: q.text,
                subtext: q.subtext,
                options: q.options
            }))
        })
    } catch (error) {
        console.error('Error fetching quiz questions:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch quiz questions' },
            { status: 500 }
        )
    }
}
