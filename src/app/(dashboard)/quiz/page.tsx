'use client'

import { useState, useCallback, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, ArrowRight, ArrowLeft, Heart, Users, Zap, RotateCcw } from 'lucide-react'
import { personas, quizQuestions, calculateQuizResults, getPersonaById } from '@/data/mock-data'
import { cn } from '@/lib/utils'
import Link from 'next/link'

type QuizState = 'landing' | 'questions' | 'result'

// ============================================
// Landing Component
// ============================================

function QuizLanding({ onStart }: { onStart: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-10"
        >
            {/* Hero Section */}
            <div className="text-center">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#FE3C72] to-[#FF6B6B] shadow-lg shadow-[#FE3C72]/20">
                    <Sparkles className="h-10 w-10 text-white" />
                </div>

                <h1 className="mb-4 text-4xl font-bold text-white">
                    What's Your{' '}
                    <span className="bg-gradient-to-r from-[#FE3C72] to-[#FF6B6B] bg-clip-text text-transparent">
                        Dating Style
                    </span>
                    ?
                </h1>

                <p className="mx-auto mb-8 max-w-xl text-lg text-gray-400">
                    Answer 10 quick questions and discover your dating archetype.
                    Get insights into your patterns, strengths, and what you should know about yourself.
                </p>

                <button
                    onClick={onStart}
                    className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#FE3C72] to-[#FF6B6B] px-8 py-4 text-lg font-bold text-white shadow-lg shadow-[#FE3C72]/20 transition-all duration-150 ease-out hover:shadow-xl hover:shadow-[#FE3C72]/30"
                >
                    Take the Quiz
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </button>

                <p className="mt-4 text-sm text-gray-600">
                    Takes about 2 minutes • 100% free
                </p>
            </div>

            {/* How It Works */}
            <div className="grid gap-6 md:grid-cols-3">
                <div className="rounded-2xl bg-[#1a1a1a] p-6 text-center transition-[background-color,transform] duration-150 ease-out hover:-translate-y-1 hover:bg-[#222]">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FE3C72]/10">
                        <Heart className="h-7 w-7 text-[#FE3C72]" />
                    </div>
                    <h3 className="mb-2 font-bold text-white">Answer Honestly</h3>
                    <p className="text-sm text-gray-500">
                        10 questions about your dating behaviors and preferences
                    </p>
                </div>

                <div className="rounded-2xl bg-[#1a1a1a] p-6 text-center transition-[background-color,transform] duration-150 ease-out hover:-translate-y-1 hover:bg-[#222]">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10">
                        <Zap className="h-7 w-7 text-amber-400" />
                    </div>
                    <h3 className="mb-2 font-bold text-white">Get Matched</h3>
                    <p className="text-sm text-gray-500">
                        Our algorithm maps you to one of 6 dating personas
                    </p>
                </div>

                <div className="rounded-2xl bg-[#1a1a1a] p-6 text-center transition-[background-color,transform] duration-150 ease-out hover:-translate-y-1 hover:bg-[#222]">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10">
                        <Users className="h-7 w-7 text-cyan-400" />
                    </div>
                    <h3 className="mb-2 font-bold text-white">Understand Yourself</h3>
                    <p className="text-sm text-gray-500">
                        Get insights into your patterns and share results
                    </p>
                </div>
            </div>

            {/* Persona Preview */}
            <div>
                <h2 className="mb-5 text-xl font-bold text-white">Discover Which Type You Are</h2>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {personas.map((persona) => (
                        <div
                            key={persona.id}
                            className="group flex items-center gap-4 rounded-2xl bg-[#1a1a1a] p-4 transition-[background-color,transform] duration-150 ease-out hover:-translate-y-1 hover:bg-[#222]"
                        >
                            <div className={cn(
                                'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl',
                                `bg-gradient-to-br ${persona.gradient}`
                            )}>
                                {persona.emoji}
                            </div>
                            <div>
                                <h3 className="font-bold text-white">{persona.name}</h3>
                                <p className="text-xs text-gray-500 line-clamp-1">{persona.tagline}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    )
}

// ============================================
// Questions Component
// ============================================

function QuizQuestions({
    onComplete,
    onBack
}: {
    onComplete: (results: { primary: string; secondary: string | null; scores: Record<string, number> }) => void
    onBack: () => void
}) {
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
            const results = calculateQuizResults(newAnswers)
            onComplete(results)
        } else {
            setIsTransitioning(true)
            setTimeout(() => {
                setCurrentQuestionIndex(currentQuestionIndex + 1)
                setSelectedOption(null)
                setIsTransitioning(false)
            }, 150)
        }
    }, [selectedOption, answers, currentQuestion, isLastQuestion, currentQuestionIndex, onComplete])

    const handleBack = useCallback(() => {
        if (currentQuestionIndex > 0) {
            setIsTransitioning(true)
            setTimeout(() => {
                setCurrentQuestionIndex(currentQuestionIndex - 1)
                setSelectedOption(answers[quizQuestions[currentQuestionIndex - 1].id] || null)
                setIsTransitioning(false)
            }, 150)
        } else {
            onBack()
        }
    }, [currentQuestionIndex, answers, onBack])

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mx-auto max-w-2xl"
        >
            {/* Progress */}
            <div className="mb-8">
                <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-gray-500">Question {currentQuestionIndex + 1} of {quizQuestions.length}</span>
                    <span className="font-medium text-[#FE3C72]">{Math.round(progress)}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[#222]">
                    <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-[#FE3C72] to-[#FF6B6B]"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.3 }}
                    />
                </div>
            </div>

            {/* Question */}
            <div className={cn(
                'transition-all duration-150',
                isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
            )}>
                <div className="mb-8 text-center">
                    <h2 className="mb-2 text-2xl font-bold text-white">
                        {currentQuestion.text}
                    </h2>
                    {currentQuestion.subtext && (
                        <p className="text-gray-500">{currentQuestion.subtext}</p>
                    )}
                </div>

                {/* Options */}
                <div className="space-y-3 mb-8">
                    {currentQuestion.options.map((option) => {
                        const isSelected = selectedOption === option.id || answers[currentQuestion.id] === option.id
                        return (
                            <button
                                key={option.id}
                                onClick={() => handleSelectOption(option.id)}
                                className={cn(
                                    'w-full rounded-2xl p-5 text-left transition-all duration-150 ease-out',
                                    isSelected
                                        ? 'bg-[#FE3C72]/10 ring-2 ring-[#FE3C72]'
                                        : 'bg-[#1a1a1a] hover:bg-[#222]'
                                )}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={cn(
                                        'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all',
                                        isSelected
                                            ? 'border-[#FE3C72] bg-[#FE3C72]'
                                            : 'border-gray-600'
                                    )}>
                                        {isSelected && (
                                            <div className="h-2 w-2 rounded-full bg-white" />
                                        )}
                                    </div>
                                    <span className={cn(
                                        'text-lg',
                                        isSelected ? 'text-white' : 'text-gray-300'
                                    )}>{option.text}</span>
                                </div>
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
                <button
                    onClick={handleBack}
                    className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-gray-400 transition-colors duration-150 hover:text-white"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                </button>

                <button
                    onClick={handleNext}
                    disabled={!canGoNext}
                    className={cn(
                        'flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition-all duration-150 ease-out',
                        canGoNext
                            ? 'bg-gradient-to-r from-[#FE3C72] to-[#FF6B6B] text-white hover:shadow-lg hover:shadow-[#FE3C72]/25'
                            : 'bg-[#222] text-gray-600 cursor-not-allowed'
                    )}
                >
                    {isLastQuestion ? 'See My Results' : 'Next'}
                    <ArrowRight className="h-4 w-4" />
                </button>
            </div>
        </motion.div>
    )
}

// ============================================
// Results Component
// ============================================

function QuizResults({
    primaryId,
    secondaryId,
    onRetake
}: {
    primaryId: string
    secondaryId: string | null
    onRetake: () => void
}) {
    const primaryPersona = getPersonaById(primaryId)
    const secondaryPersona = secondaryId ? getPersonaById(secondaryId) : null

    if (!primaryPersona) {
        return (
            <div className="text-center py-20">
                <p className="text-gray-400">Something went wrong. Please try again.</p>
                <button
                    onClick={onRetake}
                    className="mt-4 rounded-full bg-[#FE3C72] px-6 py-2 font-medium text-white"
                >
                    Retake Quiz
                </button>
            </div>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-2xl space-y-8"
        >
            {/* Result Header */}
            <div className="text-center">
                <p className="mb-4 text-gray-500">You are...</p>
                <div className={cn(
                    'mx-auto mb-6 flex h-28 w-28 items-center justify-center rounded-3xl text-6xl shadow-2xl',
                    `bg-gradient-to-br ${primaryPersona.gradient}`
                )}>
                    {primaryPersona.emoji}
                </div>
                <h1 className="mb-2 text-4xl font-bold text-white">
                    {primaryPersona.name}
                </h1>
                <p className="text-xl text-gray-400">
                    {primaryPersona.tagline}
                </p>
            </div>

            {/* Description */}
            <div className="rounded-3xl bg-[#1a1a1a] p-6">
                <p className="text-lg leading-relaxed text-gray-300">
                    {primaryPersona.description}
                </p>
            </div>

            {/* Secondary Persona */}
            {secondaryPersona && (
                <div className="rounded-2xl bg-[#1a1a1a] p-5">
                    <p className="mb-3 text-sm text-gray-500">You also have traits of...</p>
                    <div className="flex items-center gap-4">
                        <div className={cn(
                            'flex h-14 w-14 items-center justify-center rounded-xl text-2xl',
                            `bg-gradient-to-br ${secondaryPersona.gradient}`
                        )}>
                            {secondaryPersona.emoji}
                        </div>
                        <div>
                            <h3 className="font-bold text-white">{secondaryPersona.name}</h3>
                            <p className="text-sm text-gray-500">{secondaryPersona.tagline}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Key Traits */}
            <div>
                <h2 className="mb-4 text-xl font-bold text-white">Your Key Traits</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl bg-[#1a1a1a] p-5">
                        <h3 className="mb-3 text-sm font-medium text-gray-500">Motivations</h3>
                        <ul className="space-y-2">
                            {primaryPersona.motivations.slice(0, 3).map((m, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#FE3C72]" />
                                    {m}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="rounded-2xl bg-[#1a1a1a] p-5">
                        <h3 className="mb-3 text-sm font-medium text-gray-500">Watch Out For</h3>
                        <ul className="space-y-2">
                            {primaryPersona.painPoints.slice(0, 3).map((p, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                                    {p}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Communication Style */}
            <div className="rounded-2xl bg-[#1a1a1a] p-5">
                <h3 className="mb-2 font-bold text-white">Your Communication Style</h3>
                <p className="text-gray-400">{primaryPersona.communicationStyle}</p>
            </div>

            {/* Shareable Card */}
            <div className={cn(
                'relative overflow-hidden rounded-3xl p-8',
                `bg-gradient-to-br ${primaryPersona.gradient}`
            )}>
                <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
                <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />

                <div className="relative text-center">
                    <p className="mb-2 text-sm text-white/70">My dating style is</p>
                    <div className="mb-3 text-5xl">{primaryPersona.emoji}</div>
                    <h3 className="mb-1 text-2xl font-bold text-white">
                        {primaryPersona.name}
                    </h3>
                    <p className="mb-4 text-sm text-white/80">
                        {primaryPersona.tagline}
                    </p>
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs text-white">
                        <Sparkles className="h-3 w-3" />
                        MatchPulse
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <button
                    onClick={onRetake}
                    className="flex items-center gap-2 rounded-full bg-[#222] px-6 py-3 font-medium text-gray-300 transition-colors duration-150 hover:bg-[#2a2a2a]"
                >
                    <RotateCcw className="h-4 w-4" />
                    Retake Quiz
                </button>
                <Link
                    href={`/personas/${primaryId}`}
                    className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#FE3C72] to-[#FF6B6B] px-6 py-3 font-bold text-white transition-all duration-150 hover:shadow-lg hover:shadow-[#FE3C72]/25"
                >
                    View Full Persona
                    <ArrowRight className="h-4 w-4" />
                </Link>
            </div>
        </motion.div>
    )
}

// ============================================
// Main Quiz Page
// ============================================

export default function QuizPage() {
    const [quizState, setQuizState] = useState<QuizState>('landing')
    const [results, setResults] = useState<{ primary: string; secondary: string | null } | null>(null)

    const handleStart = () => setQuizState('questions')

    const handleComplete = (quizResults: { primary: string; secondary: string | null; scores: Record<string, number> }) => {
        setResults({ primary: quizResults.primary, secondary: quizResults.secondary })
        setQuizState('result')
    }

    const handleRetake = () => {
        setResults(null)
        setQuizState('landing')
    }

    const handleBackToLanding = () => {
        setQuizState('landing')
    }

    return (
        <div className="pb-12">
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white">Dating Persona Quiz</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Discover your dating archetype
                </p>
            </div>

            <AnimatePresence mode="wait">
                {quizState === 'landing' && (
                    <QuizLanding key="landing" onStart={handleStart} />
                )}
                {quizState === 'questions' && (
                    <QuizQuestions
                        key="questions"
                        onComplete={handleComplete}
                        onBack={handleBackToLanding}
                    />
                )}
                {quizState === 'result' && results && (
                    <QuizResults
                        key="result"
                        primaryId={results.primary}
                        secondaryId={results.secondary}
                        onRetake={handleRetake}
                    />
                )}
            </AnimatePresence>
        </div>
    )
}
