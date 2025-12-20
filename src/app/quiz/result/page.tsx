'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getPersonaById } from '@/data/mock-data'
import { cn } from '@/lib/utils'
import { RotateCcw, ArrowRight } from 'lucide-react'
import { StaggerContainer, StaggerItem } from '@/components/ui/MotionPrimitives'

function QuizResultContent() {
    const searchParams = useSearchParams()
    const primaryId = searchParams.get('primary') || 'overthinker'
    const secondaryId = searchParams.get('secondary')

    const primaryPersona = getPersonaById(primaryId)
    const secondaryPersona = secondaryId ? getPersonaById(secondaryId) : null

    if (!primaryPersona) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-surface-400">Something went wrong. Please try again.</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-surface-950 via-surface-900 to-surface-950">
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
                    <span className="text-sm text-surface-400">Your Results</span>
                </div>
            </header>

            {/* Main Content */}
            <main className="px-6 py-12">
                <StaggerContainer className="mx-auto max-w-2xl">
                    {/* Result Header */}
                    <StaggerItem className="mb-8 text-center">
                        <p className="mb-4 text-surface-400">You are...</p>
                        <div className={cn(
                            'mx-auto mb-6 flex h-28 w-28 items-center justify-center rounded-3xl text-6xl shadow-2xl',
                            `bg-gradient-to-br ${primaryPersona.gradient}`
                        )}>
                            {primaryPersona.emoji}
                        </div>
                        <h1 className="mb-2 text-4xl font-bold text-white">
                            {primaryPersona.name}
                        </h1>
                        <p className="text-xl text-surface-300">
                            {primaryPersona.tagline}
                        </p>
                    </StaggerItem>

                    {/* Result Card */}
                    <StaggerItem className="mb-8 rounded-2xl border border-surface-800 bg-surface-900/50 p-6">
                        <p className="text-lg leading-relaxed text-surface-200">
                            {primaryPersona.description}
                        </p>
                    </StaggerItem>

                    {/* Secondary Persona */}
                    {secondaryPersona && (
                        <StaggerItem className="mb-8 rounded-xl border border-surface-800 bg-surface-900/30 p-5">
                            <p className="mb-3 text-sm text-surface-500">You also have traits of...</p>
                            <div className="flex items-center gap-4">
                                <div className={cn(
                                    'flex h-14 w-14 items-center justify-center rounded-xl text-2xl',
                                    `bg-gradient-to-br ${secondaryPersona.gradient}`
                                )}>
                                    {secondaryPersona.emoji}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white">{secondaryPersona.name}</h3>
                                    <p className="text-sm text-surface-400">{secondaryPersona.tagline}</p>
                                </div>
                            </div>
                        </StaggerItem>
                    )}

                    {/* Key Traits */}
                    <StaggerItem className="mb-8">
                        <h2 className="mb-4 font-semibold text-white">Your Key Traits</h2>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="rounded-xl border border-surface-800 bg-surface-900/50 p-4">
                                <h3 className="mb-2 text-sm font-medium text-surface-400">Motivations</h3>
                                <ul className="space-y-1">
                                    {primaryPersona.motivations.slice(0, 2).map((m, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-surface-200">
                                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-pulse-400" />
                                            {m}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="rounded-xl border border-surface-800 bg-surface-900/50 p-4">
                                <h3 className="mb-2 text-sm font-medium text-surface-400">Watch Out For</h3>
                                <ul className="space-y-1">
                                    {primaryPersona.painPoints.slice(0, 2).map((p, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-surface-200">
                                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                                            {p}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </StaggerItem>

                    {/* Communication Style */}
                    <StaggerItem className="mb-8 rounded-xl border border-surface-800 bg-surface-900/50 p-5">
                        <h3 className="mb-2 font-semibold text-white">Your Communication Style</h3>
                        <p className="text-surface-300">{primaryPersona.communicationStyle}</p>
                    </StaggerItem>

                    {/* Shareable Card Preview */}
                    <StaggerItem className="mb-8">
                        <h2 className="mb-4 font-semibold text-white">Share Your Results</h2>
                        <div className={cn(
                            'relative overflow-hidden rounded-2xl p-6',
                            `bg-gradient-to-br ${primaryPersona.gradient}`
                        )}>
                            {/* Decorative elements */}
                            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
                            <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />

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
                                    <Image
                                        src="/assets/MatchPulse Logo.svg"
                                        alt="MatchPulse"
                                        width={12}
                                        height={12}
                                        className="h-3 w-3"
                                    />
                                    MatchPulse
                                </div>
                            </div>
                        </div>
                    </StaggerItem>

                    {/* Retake */}
                    <StaggerItem className="mt-8 text-center">
                        <Link
                            href="/quiz/questions"
                            className="inline-flex items-center gap-2 text-surface-400 hover:text-surface-300"
                        >
                            <RotateCcw className="h-4 w-4" />
                            Retake the Quiz
                        </Link>
                    </StaggerItem>

                    {/* Dashboard Link */}
                    <StaggerItem className="mt-8 rounded-xl border border-surface-800 bg-surface-900/30 p-5 text-center">
                        <p className="mb-3 text-surface-400">
                            Want to see the full analysis and trends?
                        </p>
                        <Link
                            href={`/personas/${primaryId}`}
                            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-pulse-500 to-accent-500 px-5 py-2 font-medium text-white transition-opacity hover:opacity-90"
                        >
                            Explore Dashboard
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </StaggerItem>
                </StaggerContainer>
            </main>
        </div>
    )
}

export default function QuizResultPage() {
    return (
        <Suspense fallback={
            <div className="flex min-h-screen items-center justify-center bg-surface-950">
                <div className="text-center">
                    <div className="mb-4 text-4xl">✨</div>
                    <p className="text-surface-400">Calculating your results...</p>
                </div>
            </div>
        }>
            <QuizResultContent />
        </Suspense>
    )
}
