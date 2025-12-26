'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Sparkles, Calendar, Gift, ArrowRight, MapPin, Clock, Wallet } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useCupid } from '@/context/CupidContext'
import {
    CupidPreferences,
    VibeTag,
    BudgetTier,
    TimeWindow,
    CuisineType,
    DateSuggestion,
    DateLog,
    MatchedWoman
} from '@/types/cupid'
import {
    VIBE_DEFINITIONS,
    BUDGET_DEFINITIONS,
    TIME_WINDOW_DEFINITIONS,
    NYC_NEIGHBORHOODS,
    MATCHED_WOMEN
} from '@/data/cupid-data'
import { cn } from '@/lib/utils'
import { DateCard } from '@/components/cupid/DateCard'

// ============================================
// Step Components
// ============================================

function WelcomeStep({ onNext }: { onNext: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center text-center px-4"
        >
            {/* Hero */}
            <motion.div
                animate={{
                    scale: [1, 1.05, 1],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mb-8"
            >
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FE3C72] to-[#FF6B6B] shadow-2xl shadow-[#FE3C72]/30">
                    <Heart className="h-10 w-10 text-white" fill="white" />
                </div>
            </motion.div>

            <h1 className="mb-3 text-3xl font-bold text-white">
                Welcome to Cupid
            </h1>
            <p className="mb-8 max-w-sm text-base text-gray-400">
                Your personal date planner for unforgettable moments together.
            </p>

            {/* Features */}
            <div className="mb-10 grid w-full max-w-md grid-cols-3 gap-3">
                {[
                    { icon: Sparkles, label: 'Personalized', emoji: '✨' },
                    { icon: Calendar, label: 'Log Dates', emoji: '📅' },
                    { icon: Gift, label: 'Wrapped', emoji: '🎁' },
                ].map((feature, i) => (
                    <motion.div
                        key={feature.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + i * 0.1 }}
                        className="flex flex-col items-center gap-2 rounded-2xl bg-[#1a1a1a] py-4 px-3"
                    >
                        <span className="text-2xl">{feature.emoji}</span>
                        <span className="text-xs font-medium text-gray-400">{feature.label}</span>
                    </motion.div>
                ))}
            </div>

            <button
                onClick={onNext}
                className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#FE3C72] to-[#FF6B6B] px-8 py-3.5 text-base font-bold text-white shadow-lg shadow-[#FE3C72]/25 transition-all hover:opacity-90"
            >
                Get Started
                <ArrowRight className="h-5 w-5" />
            </button>
        </motion.div>
    )
}

function NeighborhoodStep({
    selected,
    onChange,
    onNext,
    onBack,
    currentStep
}: {
    selected: string[]
    onChange: (neighborhoods: string[]) => void
    onNext: () => void
    currentStep: number
    onBack: () => void
}) {
    const toggle = (n: string) => {
        onChange(selected.includes(n) ? selected.filter(x => x !== n) : [...selected, n])
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="w-full max-w-2xl"
        >
            <div className="mb-8 text-center">
                <MapPin className="mx-auto mb-4 h-10 w-10 text-[#FE3C72]" />
                <h2 className="mb-2 text-2xl font-bold text-white">Where do you like to explore?</h2>
                <p className="text-surface-400">Select your favorite neighborhoods (pick at least 2)</p>
            </div>

            <div className="mb-8 flex flex-wrap justify-center gap-2">
                {NYC_NEIGHBORHOODS.map((n) => (
                    <button
                        key={n}
                        onClick={() => toggle(n)}
                        className={cn(
                            'rounded-full px-4 py-2 text-sm font-medium transition-all',
                            selected.includes(n)
                                ? 'bg-[#FE3C72] text-white shadow-lg shadow-[#FE3C72]/25'
                                : 'bg-[#1a1a1a] text-gray-300 hover:bg-[#2a2a2a]'
                        )}
                    >
                        {n}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-3 items-center">
                <button onClick={onBack} className="justify-self-start flex items-center gap-2 rounded-full bg-[#2a2a2a] px-6 py-2.5 font-semibold text-gray-300 transition-all hover:bg-[#333] hover:text-white">
                    Back
                </button>
                <div className="flex justify-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                        <div
                            key={s}
                            className={cn(
                                'h-1.5 w-8 rounded-full transition-all',
                                s <= currentStep ? 'bg-[#FE3C72]' : 'bg-[#2a2a2a]'
                            )}
                        />
                    ))}
                </div>
                <button
                    onClick={onNext}
                    disabled={selected.length < 2}
                    className={cn(
                        'justify-self-end flex items-center gap-2 rounded-full px-6 py-2.5 font-semibold transition-all',
                        selected.length >= 2
                            ? 'bg-gradient-to-r from-[#FE3C72] to-[#FF6B6B] text-white'
                            : 'bg-[#1a1a1a] text-gray-600 cursor-not-allowed'
                    )}
                >
                    Next <ArrowRight className="h-4 w-4" />
                </button>
            </div>
        </motion.div>
    )
}

function VibesStep({
    selected,
    onChange,
    onNext,
    onBack,
    currentStep
}: {
    selected: VibeTag[]
    onChange: (vibes: VibeTag[]) => void
    onNext: () => void
    onBack: () => void
    currentStep: number
}) {
    const toggle = (v: VibeTag) => {
        onChange(selected.includes(v) ? selected.filter(x => x !== v) : [...selected, v])
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="w-full max-w-2xl"
        >
            <div className="mb-8 text-center">
                <Sparkles className="mx-auto mb-4 h-10 w-10 text-[#FE3C72]" />
                <h2 className="mb-2 text-2xl font-bold text-white">What's your vibe?</h2>
                <p className="text-gray-400">Pick the moods that describe your ideal date (at least 2)</p>
            </div>

            <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-5">
                {(Object.entries(VIBE_DEFINITIONS) as [VibeTag, typeof VIBE_DEFINITIONS[VibeTag]][]).map(([key, vibe]) => (
                    <button
                        key={key}
                        onClick={() => toggle(key)}
                        className={cn(
                            'flex flex-col items-center gap-2 rounded-2xl p-4 transition-all',
                            selected.includes(key)
                                ? 'bg-gradient-to-r from-[#FE3C72] to-[#FF6B6B] text-white shadow-lg shadow-[#FE3C72]/25'
                                : 'bg-[#1a1a1a] text-gray-300 hover:bg-[#2a2a2a]'
                        )}
                    >
                        <span className="text-2xl">{vibe.emoji}</span>
                        <span className="text-xs font-medium">{vibe.label}</span>
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-3 items-center">
                <button onClick={onBack} className="justify-self-start flex items-center gap-2 rounded-full bg-[#2a2a2a] px-6 py-2.5 font-semibold text-gray-300 transition-all hover:bg-[#333] hover:text-white">Back</button>
                <div className="flex justify-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                        <div
                            key={s}
                            className={cn(
                                'h-1.5 w-8 rounded-full transition-all',
                                s <= currentStep ? 'bg-[#FE3C72]' : 'bg-[#2a2a2a]'
                            )}
                        />
                    ))}
                </div>
                <button
                    onClick={onNext}
                    disabled={selected.length < 2}
                    className={cn(
                        'justify-self-end flex items-center gap-2 rounded-full px-6 py-2.5 font-semibold transition-all',
                        selected.length >= 2
                            ? 'bg-gradient-to-r from-[#FE3C72] to-[#FF6B6B] text-white'
                            : 'bg-[#1a1a1a] text-gray-600 cursor-not-allowed'
                    )}
                >
                    Next <ArrowRight className="h-4 w-4" />
                </button>
            </div>
        </motion.div>
    )
}

function BudgetStep({
    selected,
    onChange,
    onNext,
    onBack,
    currentStep
}: {
    selected: BudgetTier[]
    onChange: (budgets: BudgetTier[]) => void
    onNext: () => void
    onBack: () => void
    currentStep: number
}) {
    const toggle = (b: BudgetTier) => {
        onChange(selected.includes(b) ? selected.filter(x => x !== b) : [...selected, b])
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="w-full max-w-2xl"
        >
            <div className="mb-8 text-center">
                <Wallet className="mx-auto mb-4 h-10 w-10 text-[#FE3C72]" />
                <h2 className="mb-2 text-2xl font-bold text-white">What's your budget range?</h2>
                <p className="text-gray-400">Select all that apply</p>
            </div>

            <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                {(Object.entries(BUDGET_DEFINITIONS) as [BudgetTier, typeof BUDGET_DEFINITIONS[BudgetTier]][]).map(([key, budget]) => (
                    <button
                        key={key}
                        onClick={() => toggle(key)}
                        className={cn(
                            'flex items-center gap-3 rounded-2xl p-4 transition-all sm:flex-col sm:w-40',
                            selected.includes(key)
                                ? 'bg-gradient-to-r from-[#FE3C72] to-[#FF6B6B] text-white shadow-lg shadow-[#FE3C72]/25'
                                : 'bg-[#1a1a1a] text-gray-300 hover:bg-[#2a2a2a]'
                        )}
                    >
                        <span className="text-2xl">{budget.emoji}</span>
                        <div className="text-left sm:text-center">
                            <div className="font-semibold">{budget.label}</div>
                            <div className="text-xs opacity-75">{budget.range}</div>
                        </div>
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-3 items-center">
                <button onClick={onBack} className="justify-self-start flex items-center gap-2 rounded-full bg-[#2a2a2a] px-6 py-2.5 font-semibold text-gray-300 transition-all hover:bg-[#333] hover:text-white">Back</button>
                <div className="flex justify-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                        <div
                            key={s}
                            className={cn(
                                'h-1.5 w-8 rounded-full transition-all',
                                s <= currentStep ? 'bg-[#FE3C72]' : 'bg-[#2a2a2a]'
                            )}
                        />
                    ))}
                </div>
                <button
                    onClick={onNext}
                    disabled={selected.length === 0}
                    className={cn(
                        'justify-self-end flex items-center gap-2 rounded-full px-6 py-2.5 font-semibold transition-all',
                        selected.length > 0
                            ? 'bg-gradient-to-r from-[#FE3C72] to-[#FF6B6B] text-white'
                            : 'bg-[#1a1a1a] text-gray-600 cursor-not-allowed'
                    )}
                >
                    Next <ArrowRight className="h-4 w-4" />
                </button>
            </div>
        </motion.div>
    )
}

function TimeStep({
    selected,
    onChange,
    onNext,
    onBack,
    currentStep
}: {
    selected: TimeWindow[]
    onChange: (times: TimeWindow[]) => void
    onNext: () => void
    onBack: () => void
    currentStep: number
}) {
    const toggle = (t: TimeWindow) => {
        onChange(selected.includes(t) ? selected.filter(x => x !== t) : [...selected, t])
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="w-full max-w-2xl"
        >
            <div className="mb-8 text-center">
                <Clock className="mx-auto mb-4 h-10 w-10 text-[#FE3C72]" />
                <h2 className="mb-2 text-2xl font-bold text-white">When are you usually free?</h2>
                <p className="text-gray-400">Pick your preferred date time slots</p>
            </div>

            <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {(Object.entries(TIME_WINDOW_DEFINITIONS) as [TimeWindow, typeof TIME_WINDOW_DEFINITIONS[TimeWindow]][]).map(([key, tw]) => (
                    <button
                        key={key}
                        onClick={() => toggle(key)}
                        className={cn(
                            'flex items-center gap-3 rounded-2xl p-4 transition-all',
                            selected.includes(key)
                                ? 'bg-gradient-to-r from-[#FE3C72] to-[#FF6B6B] text-white shadow-lg shadow-[#FE3C72]/25'
                                : 'bg-[#1a1a1a] text-gray-300 hover:bg-[#2a2a2a]'
                        )}
                    >
                        <span className="text-xl">{tw.emoji}</span>
                        <span className="text-sm font-medium">{tw.label}</span>
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-3 items-center">
                <button onClick={onBack} className="justify-self-start flex items-center gap-2 rounded-full bg-[#2a2a2a] px-6 py-2.5 font-semibold text-gray-300 transition-all hover:bg-[#333] hover:text-white">Back</button>
                <div className="flex justify-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                        <div
                            key={s}
                            className={cn(
                                'h-1.5 w-8 rounded-full transition-all',
                                s <= currentStep ? 'bg-[#FE3C72]' : 'bg-[#2a2a2a]'
                            )}
                        />
                    ))}
                </div>
                <button
                    onClick={onNext}
                    disabled={selected.length === 0}
                    className={cn(
                        'justify-self-end flex items-center gap-2 rounded-full px-6 py-2.5 font-semibold transition-all',
                        selected.length > 0
                            ? 'bg-gradient-to-r from-[#FE3C72] to-[#FF6B6B] text-white'
                            : 'bg-[#1a1a1a] text-gray-600 cursor-not-allowed'
                    )}
                >
                    Next <ArrowRight className="h-4 w-4" />
                </button>
            </div>
        </motion.div>
    )
}

// ============================================
// Match Selection Step
// ============================================

function MatchSelectionStep({
    selected,
    onChange,
    onNext,
    onBack,
    currentStep
}: {
    selected: string | null
    onChange: (matchId: string) => void
    onNext: () => void
    onBack: () => void
    currentStep: number
}) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="w-full max-w-3xl"
        >
            <div className="mb-8 text-center">
                <Heart className="mx-auto mb-4 h-10 w-10 text-[#FE3C72]" fill="#FE3C72" />
                <h2 className="mb-2 text-2xl font-bold text-white">Who are you planning dates with?</h2>
                <p className="text-gray-400">Select your match to get personalized recommendations</p>
            </div>

            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {MATCHED_WOMEN.map((match) => (
                    <button
                        key={match.id}
                        onClick={() => onChange(match.id)}
                        className={cn(
                            'relative overflow-hidden rounded-2xl p-4 text-left transition-all',
                            selected === match.id
                                ? 'bg-gradient-to-br from-[#FE3C72]/20 to-[#FF6B6B]/20 ring-2 ring-[#FE3C72]'
                                : 'bg-[#1a1a1a] hover:bg-[#222]'
                        )}
                    >
                        {/* Photo */}
                        <div className="mb-3 flex items-center gap-3">
                            <div className="relative h-14 w-14 overflow-hidden rounded-full">
                                <Image
                                    src={match.photo}
                                    alt={match.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div>
                                <h3 className="font-bold text-white">{match.name}, {match.age}</h3>
                                {selected === match.id && (
                                    <span className="text-xs font-medium text-[#FE3C72]">Selected</span>
                                )}
                            </div>
                        </div>

                        {/* Bio */}
                        <p className="mb-3 text-sm text-gray-400 line-clamp-2">{match.bio}</p>

                        {/* Vibes */}
                        <div className="flex flex-wrap gap-1.5">
                            {match.preferences.vibes.slice(0, 3).map((vibe) => (
                                <span
                                    key={vibe}
                                    className="rounded-full bg-[#2a2a2a] px-2 py-0.5 text-xs text-gray-300"
                                >
                                    {VIBE_DEFINITIONS[vibe]?.emoji} {VIBE_DEFINITIONS[vibe]?.label}
                                </span>
                            ))}
                        </div>

                        {/* Selected indicator */}
                        {selected === match.id && (
                            <div className="absolute top-3 right-3">
                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FE3C72]">
                                    <Heart className="h-3 w-3 text-white" fill="white" />
                                </div>
                            </div>
                        )}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-3 items-center">
                <button onClick={onBack} className="justify-self-start flex items-center gap-2 rounded-full bg-[#2a2a2a] px-6 py-2.5 font-semibold text-gray-300 transition-all hover:bg-[#333] hover:text-white">Back</button>
                <div className="flex justify-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                        <div
                            key={s}
                            className={cn(
                                'h-1.5 w-8 rounded-full transition-all',
                                s <= currentStep ? 'bg-[#FE3C72]' : 'bg-[#2a2a2a]'
                            )}
                        />
                    ))}
                </div>
                <button
                    onClick={onNext}
                    disabled={!selected}
                    className={cn(
                        'justify-self-end flex items-center gap-2 rounded-full px-6 py-2.5 font-semibold transition-all',
                        selected
                            ? 'bg-gradient-to-r from-[#FE3C72] to-[#FF6B6B] text-white'
                            : 'bg-[#1a1a1a] text-gray-600 cursor-not-allowed'
                    )}
                >
                    Start Dating <ArrowRight className="h-4 w-4" />
                </button>
            </div>
        </motion.div>
    )
}

// ============================================
// Ideas View (Post-Onboarding)
// ============================================

function IdeasView({
    recommendations,
    completedCount,
    isLoadingRecommendations,
    recommendationsError,
    onRefresh,
    onLoadMore
}: {
    recommendations: DateSuggestion[]
    completedCount: number
    isLoadingRecommendations?: boolean
    recommendationsError?: string | null
    onRefresh?: () => void
    onLoadMore?: () => void
}) {
    const { saveDate, unsaveDate, logDate, markNotOurVibe, dismissDate, getSelectedMatch, getAllMatches, setSelectedMatch, fetchRecommendations } = useCupid()
    const [displayCount, setDisplayCount] = useState(6)
    const [filter, setFilter] = useState<'all' | 'saved'>('all')
    const [showMatchSwitcher, setShowMatchSwitcher] = useState(false)

    const selectedMatch = getSelectedMatch()
    const allMatches = getAllMatches()

    // Filter recommendations based on current filter
    const filteredRecommendations = filter === 'saved'
        ? recommendations.filter(r => r.isSaved)
        : recommendations

    const displayedRecommendations = filteredRecommendations.slice(0, displayCount)
    const hasMore = displayCount < filteredRecommendations.length

    const handleMatchSwitch = (matchId: string) => {
        setSelectedMatch(matchId)
        setShowMatchSwitcher(false)
        // Refresh recommendations after switching
        fetchRecommendations()
    }

    return (
        <div className="px-4 py-6 sm:px-6">
            <div className="mx-auto max-w-5xl">
                {/* Header - Tinder Style */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white sm:text-3xl">
                            Date Ideas
                        </h1>
                        <p className="mt-0.5 text-sm text-gray-500">
                            Personalized picks for you two
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Match Switcher - Always show */}
                        <div className="relative">
                            <button
                                onClick={() => setShowMatchSwitcher(!showMatchSwitcher)}
                                className="flex items-center gap-2 rounded-full bg-[#1a1a1a] px-3 py-1.5 transition-all hover:bg-[#222]"
                            >
                                {selectedMatch ? (
                                    <>
                                        <div className="relative h-7 w-7 overflow-hidden rounded-full">
                                            <Image
                                                src={selectedMatch.photo}
                                                alt={selectedMatch.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <span className="text-sm font-medium text-gray-300">{selectedMatch.name}</span>
                                    </>
                                ) : (
                                    <>
                                        <Heart className="h-5 w-5 text-[#FE3C72]" />
                                        <span className="text-sm font-medium text-gray-300">Select Match</span>
                                    </>
                                )}
                                <svg className={cn("h-4 w-4 text-gray-500 transition-transform", showMatchSwitcher && "rotate-180")} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {/* Dropdown */}
                            <AnimatePresence>
                                {showMatchSwitcher && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-2xl bg-[#1a1a1a] shadow-xl ring-1 ring-white/10"
                                    >
                                        <div className="p-2">
                                            <p className="px-3 py-2 text-xs font-medium uppercase text-gray-500">
                                                {selectedMatch ? 'Switch Match' : 'Select a Match'}
                                            </p>
                                            {allMatches.map((match) => (
                                                <button
                                                    key={match.id}
                                                    onClick={() => handleMatchSwitch(match.id)}
                                                    className={cn(
                                                        'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all',
                                                        selectedMatch?.id === match.id
                                                            ? 'bg-[#FE3C72]/20 text-white'
                                                            : 'text-gray-300 hover:bg-[#222]'
                                                    )}
                                                >
                                                    <div className="relative h-10 w-10 overflow-hidden rounded-full">
                                                        <Image
                                                            src={match.photo}
                                                            alt={match.name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-medium">{match.name}, {match.age}</p>
                                                        <p className="text-xs text-gray-500 line-clamp-1">{match.bio}</p>
                                                    </div>
                                                    {selectedMatch?.id === match.id && (
                                                        <Heart className="h-4 w-4 text-[#FE3C72]" fill="#FE3C72" />
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        {completedCount > 0 && (
                            <span className="hidden rounded-full bg-[#1a1a1a] px-3 py-1.5 text-xs font-medium text-gray-400 sm:block">
                                {completedCount} logged
                            </span>
                        )}
                        <Link
                            href="/wrapped"
                            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#FE3C72] to-[#FF6B6B] px-4 py-2 text-sm font-semibold text-white transition-all hover:opacity-90"
                        >
                            <Gift className="h-4 w-4" />
                            Wrapped
                        </Link>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="mb-6 flex gap-2">
                    <button
                        onClick={() => setFilter('all')}
                        className={cn(
                            'rounded-full px-4 py-2 text-sm font-semibold transition-all',
                            filter === 'all'
                                ? 'bg-[#FE3C72] text-white'
                                : 'bg-[#1a1a1a] text-gray-400 hover:bg-[#222]'
                        )}
                    >
                        All Ideas
                    </button>
                    <button
                        onClick={() => setFilter('saved')}
                        className={cn(
                            'flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all',
                            filter === 'saved'
                                ? 'bg-[#FE3C72] text-white'
                                : 'bg-[#1a1a1a] text-gray-400 hover:bg-[#222]'
                        )}
                    >
                        <Heart className="h-4 w-4" />
                        Saved
                    </button>
                </div>

                {/* Progress Banner */}
                {completedCount > 0 && completedCount < 5 && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 rounded-2xl bg-gradient-to-r from-[#FE3C72]/10 to-[#FF6B6B]/10 px-4 py-3"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-400">
                                <span className="font-semibold text-[#FE3C72]">{5 - completedCount}</span> more dates until Wrapped unlocks
                            </span>
                            <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <div
                                        key={i}
                                        className={cn(
                                            'h-2 w-2 rounded-full transition-colors',
                                            i < completedCount ? 'bg-[#FE3C72]' : 'bg-[#333]'
                                        )}
                                    />
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {completedCount >= 5 && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 rounded-2xl bg-gradient-to-r from-[#FE3C72] to-[#FF6B6B] px-4 py-3 text-center"
                    >
                        <span className="font-semibold text-white">
                            🎉 Your Relationship Wrapped is ready!
                        </span>
                    </motion.div>
                )}

                {/* Loading State - Only show when no cards exist (initial load) */}
                {isLoadingRecommendations && recommendations.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            className="mb-4 h-10 w-10 rounded-full border-3 border-[#FE3C72] border-t-transparent"
                        />
                        <p className="text-gray-500">Finding perfect spots...</p>
                    </div>
                )}

                {/* Error State */}
                {recommendationsError && !isLoadingRecommendations && (
                    <div className="mb-6 flex items-center justify-between rounded-2xl bg-[#1a1a1a] px-4 py-3">
                        <span className="text-sm text-gray-400">
                            Using backup recommendations
                        </span>
                        {onRefresh && (
                            <button
                                onClick={onRefresh}
                                className="rounded-full bg-[#2a2a2a] px-3 py-1.5 text-xs font-medium text-[#FE3C72] hover:bg-[#333]"
                            >
                                Retry
                            </button>
                        )}
                    </div>
                )}

                {/* Cards Grid - Always show when cards exist */}
                {(recommendations.length > 0 || !isLoadingRecommendations) && (
                    <>
                        {filteredRecommendations.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20">
                                <div className="mb-4 text-5xl">{filter === 'saved' ? '💕' : '💕'}</div>
                                <p className="mb-4 text-gray-500">
                                    {filter === 'saved' ? 'No saved dates yet' : 'No recommendations yet'}
                                </p>
                                {filter === 'saved' ? (
                                    <button
                                        onClick={() => setFilter('all')}
                                        className="rounded-full bg-gradient-to-r from-[#FE3C72] to-[#FF6B6B] px-6 py-2.5 text-sm font-semibold text-white"
                                    >
                                        Browse All Ideas
                                    </button>
                                ) : onRefresh && (
                                    <button
                                        onClick={onRefresh}
                                        className="rounded-full bg-gradient-to-r from-[#FE3C72] to-[#FF6B6B] px-6 py-2.5 text-sm font-semibold text-white"
                                    >
                                        Find Date Spots
                                    </button>
                                )}
                            </div>
                        ) : (
                            <>
                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    <AnimatePresence mode="popLayout">
                                        {displayedRecommendations.map((date) => (
                                            <DateCard
                                                key={date.id}
                                                date={date}
                                                onSave={saveDate}
                                                onUnsave={unsaveDate}
                                                onComplete={logDate}
                                                onNotOurVibe={markNotOurVibe}
                                                onDismiss={dismissDate}
                                            />
                                        ))}
                                    </AnimatePresence>
                                </div>

                                {/* Show More Button */}
                                <div className="mt-8 flex justify-center">
                                    <button
                                        onClick={() => {
                                            if (hasMore) {
                                                setDisplayCount(prev => prev + 6)
                                            } else if (onLoadMore) {
                                                onLoadMore()
                                            }
                                        }}
                                        disabled={isLoadingRecommendations}
                                        className="flex items-center gap-2 rounded-full bg-[#1a1a1a] px-6 py-3 text-sm font-semibold text-gray-300 transition-all hover:bg-[#222] disabled:opacity-50"
                                    >
                                        {isLoadingRecommendations ? 'Loading...' : 'Show More'}
                                    </button>
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

// ============================================
// Main Page Component
// ============================================

export default function CupidPage() {
    const {
        state,
        setUserPreferences,
        setSelectedMatch,
        completeOnboarding,
        getRecommendations,
        fetchRecommendations,
        recommendations: cachedRecommendations,
        isLoading,
        isLoadingRecommendations,
        recommendationsError
    } = useCupid()
    const [step, setStep] = useState(0)
    const [prefs, setPrefs] = useState<CupidPreferences>({
        city: 'NYC',
        neighborhoods: [],
        budgetTiers: [],
        vibes: [],
        cuisines: ['coffee', 'dessert'],
        timeWindows: [],
    })
    const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null)

    // Only fetch recommendations if none are cached
    useEffect(() => {
        if (state.isOnboarded && state.userPreferences && cachedRecommendations.length === 0 && !isLoading && !isLoadingRecommendations) {
            fetchRecommendations()
        }
    }, [state.isOnboarded, state.userPreferences, cachedRecommendations.length, isLoading, isLoadingRecommendations, fetchRecommendations])

    // If already onboarded, show the ideas page
    if (state.isOnboarded && !isLoading) {
        const recommendations = getRecommendations()
        return (
            <IdeasView
                recommendations={recommendations}
                completedCount={state.completedDates.length}
                isLoadingRecommendations={isLoadingRecommendations}
                recommendationsError={recommendationsError}
                onRefresh={() => fetchRecommendations()}
                onLoadMore={() => fetchRecommendations(true)}
            />
        )
    }

    // Onboarding wizard
    const finishSetup = async () => {
        setUserPreferences(prefs)
        if (selectedMatchId) {
            setSelectedMatch(selectedMatchId)
        }
        completeOnboarding()
        // Fetch recommendations after setting preferences
        await fetchRecommendations()
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center px-6 py-12">
            {/* Steps */}
            {step === 0 && <WelcomeStep onNext={() => setStep(1)} />}
            {step === 1 && (
                <NeighborhoodStep
                    selected={prefs.neighborhoods}
                    onChange={(n) => setPrefs({ ...prefs, neighborhoods: n })}
                    onNext={() => setStep(2)}
                    onBack={() => setStep(0)}
                    currentStep={step}
                />
            )}
            {step === 2 && (
                <VibesStep
                    selected={prefs.vibes}
                    onChange={(v) => setPrefs({ ...prefs, vibes: v })}
                    onNext={() => setStep(3)}
                    onBack={() => setStep(1)}
                    currentStep={step}
                />
            )}
            {step === 3 && (
                <BudgetStep
                    selected={prefs.budgetTiers}
                    onChange={(b) => setPrefs({ ...prefs, budgetTiers: b })}
                    onNext={() => setStep(4)}
                    onBack={() => setStep(2)}
                    currentStep={step}
                />
            )}
            {step === 4 && (
                <TimeStep
                    selected={prefs.timeWindows}
                    onChange={(t) => setPrefs({ ...prefs, timeWindows: t })}
                    onNext={() => setStep(5)}
                    onBack={() => setStep(3)}
                    currentStep={step}
                />
            )}
            {step === 5 && (
                <MatchSelectionStep
                    selected={selectedMatchId}
                    onChange={setSelectedMatchId}
                    onNext={finishSetup}
                    onBack={() => setStep(4)}
                    currentStep={step}
                />
            )}
        </div>
    )
}
