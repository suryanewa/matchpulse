'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Gift, Heart, MapPin, Star, Clock, Sparkles, Share2, RotateCcw, ArrowRight, ChevronLeft, ChevronRight, Utensils, Coffee, Palette } from 'lucide-react'
import Link from 'next/link'
import { useCupid } from '@/context/CupidContext'
import { ARCHETYPE_DEFINITIONS, VIBE_DEFINITIONS, TIME_WINDOW_DEFINITIONS } from '@/data/cupid-data'
import { cn } from '@/lib/utils'

const FULL_WRAPPED_THRESHOLD = 10

// ============================================
// Wrapped Card Components
// ============================================

function StatCard({
    label,
    value,
    icon: Icon,
    color,
    delay = 0
}: {
    label: string
    value: string | number
    icon: React.ComponentType<{ className?: string }>
    color: string
    delay?: number
}) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay, type: 'spring', stiffness: 200 }}
            className={cn(
                'flex flex-col items-center gap-2 rounded-2xl p-6',
                `bg-gradient-to-br ${color}`
            )}
        >
            <Icon className="h-8 w-8 text-white/80" />
            <span className="text-3xl font-black text-white">{value}</span>
            <span className="text-sm font-medium text-white/70">{label}</span>
        </motion.div>
    )
}

function ArchetypeCard({ archetype }: { archetype: string }) {
    const def = ARCHETYPE_DEFINITIONS[archetype as keyof typeof ARCHETYPE_DEFINITIONS]
    if (!def) return null

    return (
        <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className={cn(
                'relative overflow-hidden rounded-3xl p-8 text-center',
                `bg-gradient-to-br ${def.gradient}`
            )}
        >
            {/* Decorative elements */}
            <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />

            {/* Sparkle particles */}
            {[...Array(6)].map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0],
                        x: Math.random() * 200 - 100,
                        y: Math.random() * 200 - 100
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.4,
                    }}
                    className="absolute left-1/2 top-1/2 h-2 w-2 rounded-full bg-white"
                />
            ))}

            <motion.div
                animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="relative z-10 mb-4 text-7xl"
            >
                {def.emoji}
            </motion.div>
            <h2 className="relative z-10 mb-2 text-3xl font-black text-white">{def.label}</h2>
            <p className="relative z-10 text-sm text-white/80">{def.description}</p>
        </motion.div>
    )
}

// ============================================
// Slideshow Component for Full Wrapped
// ============================================

function WrappedSlideshow({ wrappedData }: { wrappedData: NonNullable<ReturnType<typeof useCupid>['state']['wrappedData']> }) {
    const [slide, setSlide] = useState(0)
    const totalSlides = 5

    const nextSlide = () => setSlide((s) => (s + 1) % totalSlides)
    const prevSlide = () => setSlide((s) => (s - 1 + totalSlides) % totalSlides)

    const slides = [
        // Slide 0: Archetype reveal
        <motion.div
            key="archetype"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center"
        >
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className="mb-6"
            >
                <ArchetypeCard archetype={wrappedData.archetype} />
            </motion.div>
            <p className="text-surface-400 text-center">Your relationship archetype</p>
        </motion.div>,

        // Slide 1: Stats overview
        <motion.div
            key="stats"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-2 gap-4"
        >
            <StatCard icon={Heart} value={wrappedData.totalDatesCompleted} label="Dates Together" color="from-pink-500 to-rose-500" delay={0.1} />
            <StatCard icon={Star} value={wrappedData.averageRating} label="Avg Rating" color="from-amber-500 to-orange-500" delay={0.2} />
            <StatCard icon={MapPin} value={wrappedData.stats.neighborhoodCount} label="Neighborhoods" color="from-emerald-500 to-teal-500" delay={0.3} />
            <StatCard icon={Clock} value={`${Math.round(wrappedData.stats.totalHoursSpent)}h`} label="Hours Spent" color="from-blue-500 to-indigo-500" delay={0.4} />
        </motion.div>,

        // Slide 2: Top vibes
        <motion.div
            key="vibes"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
        >
            <motion.div
                initial={{ y: 20 }}
                animate={{ y: 0 }}
            >
                <h3 className="mb-6 text-2xl font-bold text-white">Your Top Vibes</h3>
                <div className="flex flex-wrap justify-center gap-3">
                    {wrappedData.topVibes.map((vibe, i) => {
                        const def = VIBE_DEFINITIONS[vibe]
                        return (
                            <motion.span
                                key={vibe}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 + i * 0.15 }}
                                className={cn(
                                    'inline-flex items-center gap-2 rounded-full px-5 py-3 text-lg font-medium text-white',
                                    `bg-gradient-to-r ${def?.color || 'from-gray-500 to-gray-600'}`
                                )}
                            >
                                <span className="text-2xl">{def?.emoji}</span> {def?.label}
                            </motion.span>
                        )
                    })}
                </div>
            </motion.div>
        </motion.div>,

        // Slide 3: Favorite neighborhood
        <motion.div
            key="neighborhood"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
        >
            <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500"
            >
                <MapPin className="h-10 w-10 text-white" />
            </motion.div>
            <h3 className="mb-2 text-lg text-surface-400">Your Go-To Neighborhood</h3>
            <motion.p
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-4xl font-black text-white"
            >
                {wrappedData.mostVisitedNeighborhood}
            </motion.p>
        </motion.div>,

        // Slide 4: Best date
        <motion.div
            key="best"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
        >
            {wrappedData.bestDate && (
                <>
                    <motion.div
                        initial={{ rotate: -10, scale: 0 }}
                        animate={{ rotate: 0, scale: 1 }}
                        transition={{ type: 'spring' }}
                        className="mb-6 inline-flex items-center gap-2 rounded-full bg-amber-500 px-4 py-2 text-sm font-bold text-white"
                    >
                        <Star className="h-4 w-4" fill="currentColor" />
                        Best Date of the Year
                    </motion.div>
                    <motion.h3
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="mb-2 text-3xl font-black text-white"
                    >
                        {wrappedData.bestDate.dateIdeaTitle}
                    </motion.h3>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="flex items-center justify-center gap-4 text-surface-400"
                    >
                        <span className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-amber-400" fill="currentColor" />
                            {wrappedData.bestDate.rating}/5
                        </span>
                        <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {wrappedData.bestDate.neighborhood}
                        </span>
                    </motion.div>
                </>
            )}
        </motion.div>,
    ]

    return (
        <div className="relative">
            {/* Slide Content */}
            <div className="min-h-[400px] flex items-center justify-center">
                <AnimatePresence mode="wait">
                    {slides[slide]}
                </AnimatePresence>
            </div>

            {/* Navigation */}
            <div className="mt-8 flex items-center justify-center gap-4">
                <button
                    onClick={prevSlide}
                    className="rounded-full bg-surface-800 p-3 text-surface-400 transition-colors hover:bg-surface-700 hover:text-white"
                >
                    <ChevronLeft className="h-5 w-5" />
                </button>
                <div className="flex gap-2">
                    {Array.from({ length: totalSlides }).map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setSlide(i)}
                            className={cn(
                                'h-2 rounded-full transition-all',
                                i === slide ? 'w-8 bg-purple-500' : 'w-2 bg-surface-600'
                            )}
                        />
                    ))}
                </div>
                <button
                    onClick={nextSlide}
                    className="rounded-full bg-surface-800 p-3 text-surface-400 transition-colors hover:bg-surface-700 hover:text-white"
                >
                    <ChevronRight className="h-5 w-5" />
                </button>
            </div>
        </div>
    )
}

// ============================================
// Main Page Component
// ============================================

export default function WrappedPage() {
    const { state, generateWrapped, getCompletedDates, isLoading } = useCupid()
    const [wrappedData, setWrappedData] = useState(state.wrappedData)
    const [showUnlockAnimation, setShowUnlockAnimation] = useState(false)

    useEffect(() => {
        if (!wrappedData && state.completedDates.length > 0) {
            const data = generateWrapped()
            if (data) {
                if (state.completedDates.length >= FULL_WRAPPED_THRESHOLD) {
                    setShowUnlockAnimation(true)
                    setTimeout(() => setShowUnlockAnimation(false), 3000)
                }
                setWrappedData(data)
            }
        }
    }, [state.completedDates, wrappedData, generateWrapped])

    const completedDates = getCompletedDates()
    const isFullWrapped = completedDates.length >= FULL_WRAPPED_THRESHOLD

    // Not ready state
    if (!state.isOnboarded) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center px-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                >
                    <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-500 to-purple-500 mx-auto">
                        <Gift className="h-12 w-12 text-white" />
                    </div>
                    <h1 className="mb-4 text-3xl font-black text-white">Your Wrapped Awaits</h1>
                    <p className="mb-8 max-w-md text-surface-400">
                        Complete your Cupid setup first, then log some dates to unlock your personalized Relationship Wrapped!
                    </p>
                    <Link
                        href="/cupid"
                        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 px-6 py-3 font-semibold text-white"
                    >
                        Start with Cupid <ArrowRight className="h-4 w-4" />
                    </Link>
                </motion.div>
            </div>
        )
    }

    // Not enough dates - needs at least 3 for preview
    if (completedDates.length < 3) {
        const remaining = 3 - completedDates.length
        return (
            <div className="flex min-h-screen flex-col items-center justify-center px-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                >
                    <motion.div
                        animate={{ y: [-5, 5, -5] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-500 to-purple-500 mx-auto"
                    >
                        <Gift className="h-12 w-12 text-white" />
                    </motion.div>
                    <h1 className="mb-4 text-3xl font-black text-white">Almost There!</h1>
                    <p className="mb-2 text-surface-400">
                        Log <span className="font-bold text-purple-400">{remaining} more date{remaining > 1 ? 's' : ''}</span> to see a preview
                    </p>
                    <p className="mb-8 text-sm text-surface-500">
                        Full Wrapped unlocks at {FULL_WRAPPED_THRESHOLD} dates
                    </p>

                    {/* Progress bar */}
                    <div className="mx-auto mb-8 h-3 w-64 overflow-hidden rounded-full bg-surface-800">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(completedDates.length / FULL_WRAPPED_THRESHOLD) * 100}%` }}
                            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-500"
                        />
                    </div>

                    <Link
                        href="/cupid"
                        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 px-6 py-3 font-semibold text-white"
                    >
                        Browse Date Ideas <ArrowRight className="h-4 w-4" />
                    </Link>
                </motion.div>
            </div>
        )
    }

    // Generate wrapped if not present
    if (!wrappedData) {
        const data = generateWrapped()
        if (data) setWrappedData(data)
        return (
            <div className="flex min-h-screen items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="h-12 w-12 rounded-full border-4 border-purple-500 border-t-transparent"
                />
            </div>
        )
    }

    return (
        <div className="min-h-screen px-6 py-8">
            <div className="mx-auto max-w-2xl">
                {/* Unlock Animation Overlay */}
                <AnimatePresence>
                    {showUnlockAnimation && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: [0, 1.2, 1] }}
                                transition={{ duration: 0.6 }}
                                className="text-center"
                            >
                                <motion.div
                                    animate={{ rotate: [0, 360] }}
                                    transition={{ duration: 1, delay: 0.3 }}
                                    className="mb-6 inline-flex h-32 w-32 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-500 to-purple-500"
                                >
                                    <Gift className="h-16 w-16 text-white" />
                                </motion.div>
                                <motion.h2
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                    className="text-4xl font-black text-white"
                                >
                                    🎉 Wrapped Unlocked!
                                </motion.h2>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 text-center"
                >
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-purple-500/10 px-4 py-2 text-sm text-purple-300">
                        <Sparkles className="h-4 w-4" />
                        {isFullWrapped ? '2024 Relationship Wrapped' : 'Wrapped Preview'}
                    </div>
                    <h1 className="text-4xl font-black text-white">
                        Your Year in <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">Dates</span>
                    </h1>
                    {!isFullWrapped && (
                        <p className="mt-2 text-surface-400">
                            Log {FULL_WRAPPED_THRESHOLD - completedDates.length} more date{FULL_WRAPPED_THRESHOLD - completedDates.length !== 1 ? 's' : ''} to unlock the full experience!
                        </p>
                    )}
                </motion.div>

                {/* Full Wrapped Slideshow */}
                {isFullWrapped ? (
                    <>
                        <WrappedSlideshow wrappedData={wrappedData} />

                        {/* Share Button */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="mt-8 flex justify-center gap-4"
                        >
                            <button className="flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-surface-900 transition-all hover:bg-surface-100">
                                <Share2 className="h-4 w-4" />
                                Share Wrapped
                            </button>
                            <Link
                                href="/cupid"
                                className="flex items-center gap-2 rounded-full border border-surface-600 px-6 py-3 font-semibold text-surface-300 transition-all hover:bg-surface-800"
                            >
                                <RotateCcw className="h-4 w-4" />
                                Back to Cupid
                            </Link>
                        </motion.div>
                    </>
                ) : (
                    /* Preview Mode - Simplified View */
                    <>
                        <div className="mb-8">
                            <ArchetypeCard archetype={wrappedData.archetype} />
                        </div>

                        <div className="mb-8 grid grid-cols-2 gap-4">
                            <StatCard icon={Heart} value={wrappedData.totalDatesCompleted} label="Dates Together" color="from-pink-500 to-rose-500" delay={0.1} />
                            <StatCard icon={Star} value={wrappedData.averageRating} label="Avg Rating" color="from-amber-500 to-orange-500" delay={0.2} />
                        </div>

                        {/* Unlock Progress */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="mb-8 rounded-2xl border border-purple-500/30 bg-purple-500/10 p-6 text-center"
                        >
                            <Gift className="mx-auto mb-3 h-8 w-8 text-purple-400" />
                            <h3 className="mb-2 font-bold text-white">
                                {FULL_WRAPPED_THRESHOLD - completedDates.length} dates to full Wrapped
                            </h3>
                            <div className="mx-auto h-3 w-full max-w-xs overflow-hidden rounded-full bg-surface-800">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(completedDates.length / FULL_WRAPPED_THRESHOLD) * 100}%` }}
                                    className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-500"
                                />
                            </div>
                            <p className="mt-2 text-sm text-surface-500">{completedDates.length} / {FULL_WRAPPED_THRESHOLD} dates logged</p>
                        </motion.div>

                        <div className="flex justify-center">
                            <Link
                                href="/cupid"
                                className="flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 px-6 py-3 font-semibold text-white"
                            >
                                Log More Dates <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

