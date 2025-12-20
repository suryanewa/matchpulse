'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { quizQuestions, calculateQuizResults } from '@/data/mock-data'
import { cn } from '@/lib/utils'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function QuizQuestionsPage() {
    const router = useRouter()
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [answers, setAnswers] = useState<Record<string, string>>({})
    const [selectedOption, setSelectedOption] = useState<string | null>(null)
    const [isTransitioning, setIsTransitioning] = useState(false)

    const currentQuestion = quizQuestions[currentQuestionIndex]
    const progress = ((currentQuestionIndex + 1) / quizQuestions.length) * 100
    const isLastQuestion = currentQuestionIndex === quizQuestions.length - 1
    const canGoNext = selectedOption !== null || answers[currentQuestion.id]

    const handleSelectOption = useCallback((optionId: string) => {
        setSelectedOption(optionId)
    }, [])

    const handleNext = useCallback(() => {
        if (!selectedOption && !answers[currentQuestion.id]) return

        const newAnswers = {
            ...answers,
            [currentQuestion.id]: selectedOption || answers[currentQuestion.id],
        }
        setAnswers(newAnswers)

        if (isLastQuestion) {
            // Calculate results and navigate
            const results = calculateQuizResults(newAnswers)
            const params = new URLSearchParams({
                primary: results.primary,
                secondary: results.secondary || '',
                scores: JSON.stringify(results.scores),
            })
            router.push(`/quiz/result?${params.toString()}`)
        } else {
            setIsTransitioning(true)
            setTimeout(() => {
                setCurrentQuestionIndex(currentQuestionIndex + 1)
                setSelectedOption(null)
                setIsTransitioning(false)
            }, 200)
        }
    }, [selectedOption, answers, currentQuestion, isLastQuestion, currentQuestionIndex, router])

    const handleBack = useCallback(() => {
        if (currentQuestionIndex > 0) {
            setIsTransitioning(true)
            setTimeout(() => {
                setCurrentQuestionIndex(currentQuestionIndex - 1)
                setSelectedOption(answers[quizQuestions[currentQuestionIndex - 1].id] || null)
                setIsTransitioning(false)
            }, 200)
        }
    }, [currentQuestionIndex, answers])

    return (
        <div className="flex min-h-screen flex-col bg-gradient-to-b from-surface-950 via-surface-900 to-surface-950">
            {/* Back to Dashboard */}
            <div className="border-b border-surface-800 px-6 py-3">
                <div className="mx-auto max-w-2xl">
                    <Link
                        href="/behaviors"
                        className="text-sm text-surface-500 hover:text-surface-300"
                    >
                        ← Back to Dashboard
                    </Link>
                </div>
            </div>

            {/* Header */}
            <header className="border-b border-surface-800 px-6 py-4">
                <div className="mx-auto flex max-w-2xl items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Image
                            src="/assets/MatchPulse Logo.svg"
                            alt="MatchPulse Logo"
                            width={20}
                            height={20}
                            className="h-5 w-5"
                        />
                        <span className="font-semibold text-white">MatchPulse</span>
                    </div>
                    <span className="text-sm text-surface-400">
                        Question {currentQuestionIndex + 1} of {quizQuestions.length}
                    </span>
                </div>
            </header>

            {/* Progress Bar */}
            <div className="px-6 py-4">
                <div className="mx-auto max-w-2xl">
                    <div className="h-2 overflow-hidden rounded-full bg-surface-800">
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-pulse-500 to-accent-500 transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Question Area */}
            <main className="flex flex-1 flex-col items-center justify-center px-6 py-8">
                <div className={cn(
                    'w-full max-w-2xl transition-all duration-200',
                    isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
                )}>
                    {/* Question */}
                    <div className="mb-8 text-center">
                        <h2 className="mb-2 text-2xl font-bold text-white md:text-3xl">
                            {currentQuestion.text}
                        </h2>
                        {currentQuestion.subtext && (
                            <p className="text-surface-400">{currentQuestion.subtext}</p>
                        )}
                    </div>

                    {/* Options */}
                    <div className="space-y-3">
                        {currentQuestion.options.map((option) => {
                            const isSelected = selectedOption === option.id || answers[currentQuestion.id] === option.id
                            return (
                                <button
                                    key={option.id}
                                    onClick={() => handleSelectOption(option.id)}
                                    className={cn(
                                        'w-full rounded-xl border p-5 text-left transition-all',
                                        isSelected
                                            ? 'border-pulse-500 bg-pulse-500/10 text-white'
                                            : 'border-surface-700 bg-surface-900/50 text-surface-300 hover:border-surface-600 hover:bg-surface-900'
                                    )}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={cn(
                                            'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all',
                                            isSelected
                                                ? 'border-pulse-500 bg-pulse-500'
                                                : 'border-surface-600'
                                        )}>
                                            {isSelected && (
                                                <div className="h-2 w-2 rounded-full bg-white" />
                                            )}
                                        </div>
                                        <span className="text-lg">{option.text}</span>
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                </div>
            </main>

            {/* Navigation */}
            <footer className="border-t border-surface-800 px-6 py-4">
                <div className="mx-auto flex max-w-2xl items-center justify-between">
                    <button
                        onClick={handleBack}
                        disabled={currentQuestionIndex === 0}
                        className={cn(
                            'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                            currentQuestionIndex === 0
                                ? 'text-surface-600 cursor-not-allowed'
                                : 'text-surface-400 hover:text-white'
                        )}
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </button>

                    <button
                        onClick={handleNext}
                        disabled={!canGoNext}
                        className={cn(
                            'flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition-all',
                            canGoNext
                                ? 'bg-gradient-to-r from-pulse-500 to-accent-500 text-white hover:shadow-lg hover:shadow-pulse-500/25'
                                : 'bg-surface-800 text-surface-500 cursor-not-allowed'
                        )}
                    >
                        {isLastQuestion ? 'See My Results' : 'Next'}
                        <ArrowRight className="h-4 w-4" />
                    </button>
                </div>
            </footer>
        </div>
    )
}
