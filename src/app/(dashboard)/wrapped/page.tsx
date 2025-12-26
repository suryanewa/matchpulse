'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Gift, Heart, MapPin, Star, Clock, Sparkles, X, ChevronRight, Trophy, Flame } from 'lucide-react'
import Link from 'next/link'
import { useCupid } from '@/context/CupidContext'
import { ARCHETYPE_DEFINITIONS, VIBE_DEFINITIONS } from '@/data/cupid-data'
import { VibeTag } from '@/types/cupid'
import { cn } from '@/lib/utils'

const FULL_WRAPPED_THRESHOLD = 5
const SLIDE_DURATION = 6000 // 6 seconds per slide

// ============================================
// Counting Number Animation
// ============================================

function CountingNumber({ value, duration = 2000 }: { value: number; duration?: number }) {
    const [count, setCount] = useState(0)

    useEffect(() => {
        let startTime: number
        let animationFrame: number

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp
            const progress = Math.min((timestamp - startTime) / duration, 1)
            setCount(Math.floor(progress * value))
            if (progress < 1) {
                animationFrame = requestAnimationFrame(animate)
            }
        }

        animationFrame = requestAnimationFrame(animate)
        return () => cancelAnimationFrame(animationFrame)
    }, [value, duration])

    return <>{count}</>
}

// ============================================
// Stories Progress Bar
// ============================================

function StoriesProgress({
    current,
    total,
    progress
}: {
    current: number
    total: number
    progress: number
}) {
    return (
        <div className="absolute top-8 left-6 right-6 z-50 flex gap-1.5">
            {Array.from({ length: total }).map((_, i) => (
                <div
                    key={i}
                    className="h-1 flex-1 rounded-full bg-white/20 overflow-hidden"
                >
                    <motion.div
                        className="h-full bg-white"
                        initial={{ width: i < current ? '100%' : '0%' }}
                        animate={{
                            width: i < current ? '100%' : i === current ? `${progress}%` : '0%'
                        }}
                        transition={{ duration: 0.1 }}
                    />
                </div>
            ))}
        </div>
    )
}

// ============================================
// Ambient Glow Background
// ============================================

function AmbientGlow() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Animated glow 1 - Top right, drifts down-left */}
            <motion.div
                className="absolute w-[500px] h-[500px] rounded-full opacity-25"
                style={{
                    background: 'radial-gradient(circle, #FE3C72 0%, transparent 70%)',
                    filter: 'blur(80px)',
                }}
                animate={{
                    x: [100, -50, 100],
                    y: [-100, 50, -100],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
                initial={{ top: '-10%', right: '-10%' }}
            />

            {/* Animated glow 2 - Bottom left, drifts up-right */}
            <motion.div
                className="absolute w-[400px] h-[400px] rounded-full opacity-20"
                style={{
                    background: 'radial-gradient(circle, #FF6B6B 0%, transparent 70%)',
                    filter: 'blur(100px)',
                }}
                animate={{
                    x: [-50, 80, -50],
                    y: [50, -80, 50],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
                initial={{ bottom: '-5%', left: '-5%' }}
            />

            {/* Animated glow 3 - Center left, drifts horizontally */}
            <motion.div
                className="absolute w-[350px] h-[350px] rounded-full opacity-15"
                style={{
                    background: 'radial-gradient(circle, #FE3C72 0%, transparent 65%)',
                    filter: 'blur(90px)',
                }}
                animate={{
                    x: [0, 100, 0],
                    y: [-30, 30, -30],
                }}
                transition={{
                    duration: 18,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
                initial={{ top: '30%', left: '-8%' }}
            />

            {/* Animated glow 4 - Top center, drifts down */}
            <motion.div
                className="absolute w-[450px] h-[450px] rounded-full opacity-15"
                style={{
                    background: 'radial-gradient(circle, #FF8A8A 0%, transparent 70%)',
                    filter: 'blur(120px)',
                }}
                animate={{
                    y: [-50, 100, -50],
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    duration: 22,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
                initial={{ top: '-15%', left: '30%' }}
            />

            {/* Animated glow 5 - Right side, drifts vertically */}
            <motion.div
                className="absolute w-[300px] h-[300px] rounded-full opacity-20"
                style={{
                    background: 'radial-gradient(circle, #FE3C72 0%, transparent 60%)',
                    filter: 'blur(70px)',
                }}
                animate={{
                    y: [0, -120, 0],
                    x: [-20, 40, -20],
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
                initial={{ top: '50%', right: '-5%' }}
            />

            {/* Center pulsing glow */}
            <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full"
                style={{
                    background: 'radial-gradient(circle, #FE3C72 0%, transparent 50%)',
                    filter: 'blur(120px)',
                }}
                animate={{
                    opacity: [0.08, 0.15, 0.08],
                    scale: [0.9, 1.1, 0.9],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            />
        </div>
    )
}

// ============================================
// Individual Slide Components
// ============================================

// Slide 1: Intro
function IntroSlide() {
    return (
        <motion.div className="flex flex-col items-center justify-center text-center">
            <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                className="relative mb-8"
            >
                <div className="flex h-32 w-32 items-center justify-center rounded-3xl bg-gradient-to-br from-[#FE3C72] to-[#FF6B6B] shadow-2xl shadow-[#FE3C72]/40">
                    <Heart className="h-16 w-16 text-white" fill="white" />
                </div>
                <motion.div
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 rounded-3xl bg-[#FE3C72]/20 blur-2xl -z-10"
                />
            </motion.div>
            <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-8xl font-black text-white mb-4"
            >
                2025.
            </motion.h1>
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-xl text-gray-400"
            >
                The year you made memories together.
            </motion.p>
        </motion.div>
    )
}

// Slide 2: Total Dates
function TotalDatesSlide({ count }: { count: number }) {
    return (
        <motion.div className="flex flex-col items-center justify-center text-center">
            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xl text-gray-400 mb-4"
            >
                You went on
            </motion.p>
            <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', delay: 0.3 }}
                className="text-9xl font-black bg-gradient-to-r from-[#FE3C72] to-[#FF6B6B] bg-clip-text text-transparent mb-4"
            >
                <CountingNumber value={count} />
            </motion.div>
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-3xl font-bold text-white"
            >
                dates together
            </motion.p>
        </motion.div>
    )
}

// Slide 3: Archetype Reveal
function ArchetypeSlide({ archetype }: { archetype: string }) {
    const def = ARCHETYPE_DEFINITIONS[archetype as keyof typeof ARCHETYPE_DEFINITIONS]
    if (!def) return null

    return (
        <motion.div className="flex flex-col items-center justify-center text-center max-w-lg">
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-lg text-gray-400 mb-6"
            >
                Your dating archetype is...
            </motion.p>
            <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 150, delay: 0.3 }}
                className="text-9xl mb-6"
            >
                {def.emoji}
            </motion.div>
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-4xl font-black text-white mb-4"
            >
                {def.label}
            </motion.h2>
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="text-gray-400 leading-relaxed"
            >
                {def.description}
            </motion.p>
        </motion.div>
    )
}

// Slide 4: Top Vibe
function TopVibeSlide({ vibes }: { vibes: VibeTag[] }) {
    if (!vibes || vibes.length === 0) {
        return (
            <motion.div className="flex flex-col items-center justify-center text-center">
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-lg text-gray-400 mb-6"
                >
                    Your dating vibe
                </motion.p>
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-6xl mb-4"
                >
                    ✨
                </motion.div>
                <motion.h2 className="text-3xl font-black text-white">
                    Adventurous
                </motion.h2>
            </motion.div>
        )
    }

    const topVibe = vibes[0]
    const def = VIBE_DEFINITIONS[topVibe]

    if (!def) {
        return (
            <motion.div className="flex flex-col items-center justify-center text-center">
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-lg text-gray-400 mb-6"
                >
                    Your #1 date vibe
                </motion.p>
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-6xl mb-4"
                >
                    💫
                </motion.div>
                <motion.h2 className="text-4xl font-black text-white capitalize">
                    {topVibe.replace(/-/g, ' ')}
                </motion.h2>
            </motion.div>
        )
    }

    return (
        <motion.div className="flex flex-col items-center justify-center text-center">
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-lg text-gray-400 mb-6"
            >
                Your #1 date vibe
            </motion.p>
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className={cn(
                    "inline-flex items-center gap-4 rounded-3xl px-10 py-6 mb-6",
                    `bg-gradient-to-r ${def.color}`
                )}
            >
                <span className="text-6xl">{def.emoji}</span>
                <span className="text-4xl font-black text-white">{def.label}</span>
            </motion.div>
            {vibes.length > 1 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex gap-3"
                >
                    {vibes.slice(1, 4).map((vibe, i) => {
                        const vibeDef = VIBE_DEFINITIONS[vibe]
                        if (!vibeDef) return null
                        return (
                            <motion.span
                                key={vibe}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.8 + i * 0.1 }}
                                className="rounded-full bg-white/10 px-4 py-2 text-sm text-white"
                            >
                                {vibeDef.emoji} {vibeDef.label}
                            </motion.span>
                        )
                    })}
                </motion.div>
            )}
        </motion.div>
    )
}

// Slide 5: Favorite Neighborhood
function NeighborhoodSlide({ neighborhood }: { neighborhood: string }) {
    // Clean up neighborhood display - remove city-level names
    const displayNeighborhood = neighborhood && neighborhood !== 'New York' && neighborhood !== 'NYC'
        ? neighborhood
        : 'All Over Town'

    return (
        <motion.div className="flex flex-col items-center justify-center text-center">
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-lg text-gray-400 mb-6"
            >
                Your go-to spot
            </motion.p>
            <motion.div
                initial={{ scale: 0, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className="mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-2xl shadow-emerald-500/30"
            >
                <MapPin className="h-12 w-12 text-white" />
            </motion.div>
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-5xl font-black text-white"
            >
                {displayNeighborhood}
            </motion.h2>
        </motion.div>
    )
}

// Slide 6: Best Date
function BestDateSlide({ date }: { date: { dateIdeaTitle: string; rating: number; neighborhood: string } | null }) {
    if (!date) return null

    return (
        <motion.div className="flex flex-col items-center justify-center text-center max-w-lg">
            <motion.div
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', delay: 0.1 }}
                className="mb-6 flex items-center gap-2 rounded-full bg-amber-500 px-5 py-2.5"
            >
                <Trophy className="h-5 w-5 text-white" fill="white" />
                <span className="font-bold text-white">Best Date of the Year</span>
            </motion.div>
            <motion.h2
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-4xl font-black text-white mb-4"
            >
                {date.dateIdeaTitle}
            </motion.h2>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="flex items-center gap-6 text-gray-400"
            >
                <span className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-amber-400" fill="currentColor" />
                    <span className="text-xl font-bold text-white">{date.rating}/5</span>
                </span>
                <span className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    {date.neighborhood}
                </span>
            </motion.div>
        </motion.div>
    )
}

// Slide 7: Stats Grid
function StatsSlide({ stats, avgRating }: { stats: { neighborhoodCount: number; totalHoursSpent: number }; avgRating: number }) {
    const statItems = [
        { icon: MapPin, value: stats.neighborhoodCount, label: 'Neighborhoods', color: 'from-emerald-500 to-teal-500', delay: 0.1 },
        { icon: Star, value: avgRating.toFixed(1), label: 'Avg Rating', color: 'from-amber-500 to-orange-500', delay: 0.2 },
        { icon: Clock, value: Math.round(stats.totalHoursSpent), label: 'Hours Spent', color: 'from-blue-500 to-indigo-500', delay: 0.3 },
        { icon: Flame, value: '🔥', label: 'Chemistry', color: 'from-pink-500 to-rose-500', delay: 0.4 },
    ]

    return (
        <motion.div className="text-center">
            <motion.h3
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-lg text-gray-400 mb-8"
            >
                By the numbers
            </motion.h3>
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                {statItems.map((stat) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ delay: stat.delay, type: 'spring' }}
                        className={cn(
                            'flex flex-col items-center gap-2 rounded-2xl p-6',
                            `bg-gradient-to-br ${stat.color}`
                        )}
                    >
                        <stat.icon className="h-6 w-6 text-white/80" />
                        <span className="text-3xl font-black text-white">{stat.value}</span>
                        <span className="text-xs font-medium text-white/70">{stat.label}</span>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    )
}

// Slide 8: Outro
function OutroSlide() {
    return (
        <motion.div className="flex flex-col items-center justify-center text-center">
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className="text-8xl mb-8"
            >
                💕
            </motion.div>
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-4xl font-black text-white mb-4"
            >
                Here&apos;s to more adventures
            </motion.h2>
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-gray-400 mb-8"
            >
                Keep making memories together
            </motion.p>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
            >
                <Link
                    href="/cupid"
                    className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#FE3C72] to-[#FF6B6B] px-6 py-3 font-semibold text-white"
                >
                    Plan Next Date
                    <ChevronRight className="h-4 w-4" />
                </Link>
            </motion.div>
        </motion.div>
    )
}

// ============================================
// Main Stories Component
// ============================================

function WrappedStories({ wrappedData, onClose }: {
    wrappedData: NonNullable<ReturnType<typeof useCupid>['state']['wrappedData']>
    onClose: () => void
}) {
    const [currentSlide, setCurrentSlide] = useState(0)
    const [progress, setProgress] = useState(0)
    const [isPaused, setIsPaused] = useState(false)

    const totalSlides = 8

    const slides = [
        <IntroSlide key="intro" />,
        <TotalDatesSlide key="total" count={wrappedData.totalDatesCompleted} />,
        <ArchetypeSlide key="archetype" archetype={wrappedData.archetype} />,
        <TopVibeSlide key="vibes" vibes={wrappedData.topVibes || []} />,
        <NeighborhoodSlide key="neighborhood" neighborhood={wrappedData.mostVisitedNeighborhood} />,
        <BestDateSlide key="best" date={wrappedData.bestDate} />,
        <StatsSlide key="stats" stats={wrappedData.stats} avgRating={wrappedData.averageRating} />,
        <OutroSlide key="outro" />,
    ]

    const nextSlide = useCallback(() => {
        if (currentSlide < totalSlides - 1) {
            setCurrentSlide(s => s + 1)
            setProgress(0)
        }
    }, [currentSlide, totalSlides])

    const prevSlide = useCallback(() => {
        if (currentSlide > 0) {
            setCurrentSlide(s => s - 1)
            setProgress(0)
        }
    }, [currentSlide])

    // Auto-advance timer - continues on last slide but doesn't advance
    useEffect(() => {
        if (isPaused) return

        const interval = setInterval(() => {
            setProgress(p => {
                if (p >= 100) {
                    if (currentSlide < totalSlides - 1) {
                        nextSlide()
                    }
                    return currentSlide === totalSlides - 1 ? 100 : 0
                }
                return p + (100 / (SLIDE_DURATION / 100))
            })
        }, 100)

        return () => clearInterval(interval)
    }, [currentSlide, isPaused, nextSlide, totalSlides])

    // Handle click navigation
    const handleClick = (e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const x = e.clientX - rect.left
        const third = rect.width / 3

        if (x < third) {
            prevSlide()
        } else if (x > third * 2) {
            nextSlide()
        } else {
            setIsPaused(p => !p)
        }
    }

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') prevSlide()
            if (e.key === 'ArrowRight') nextSlide()
            if (e.key === 'Escape') onClose()
            if (e.key === ' ') {
                e.preventDefault()
                setIsPaused(p => !p)
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [nextSlide, prevSlide, onClose])

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col bg-black"
            onClick={handleClick}
        >
            {/* Solid black background */}
            <div className="absolute inset-0 bg-black" />

            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-black to-[#0a0a0a]" />

            {/* Floating hearts background */}
            <AmbientGlow />

            {/* Progress bar */}
            <StoriesProgress current={currentSlide} total={totalSlides} progress={progress} />

            {/* Close button - positioned lower */}
            <button
                onClick={(e) => {
                    e.stopPropagation()
                    onClose()
                }}
                className="absolute top-16 right-6 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-all"
            >
                <X className="h-5 w-5" />
            </button>

            {/* Pause indicator */}
            <AnimatePresence>
                {isPaused && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 flex h-20 w-20 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm"
                    >
                        <div className="flex gap-2">
                            <div className="h-6 w-2 rounded-full bg-white" />
                            <div className="h-6 w-2 rounded-full bg-white" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Slide content */}
            <div className="relative flex-1 flex items-center justify-center px-8">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0, x: 50, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -50, scale: 0.95 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                    >
                        {slides[currentSlide]}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Navigation hints */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs text-gray-600">
                Tap sides to navigate · Center to pause
            </div>
        </motion.div>
    )
}

// ============================================
// Main Page Component
// ============================================

export default function WrappedPage() {
    const { state, generateWrapped, getCompletedDates } = useCupid()
    const [wrappedData, setWrappedData] = useState(state.wrappedData)
    const [showStories, setShowStories] = useState(false)

    useEffect(() => {
        if (!wrappedData && state.completedDates.length > 0) {
            const data = generateWrapped()
            if (data) {
                setWrappedData(data)
            }
        }
    }, [state.completedDates, wrappedData, generateWrapped])

    const completedDates = getCompletedDates()

    // Not ready state
    if (!state.isOnboarded) {
        return (
            <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center max-w-md"
                >
                    <div className="mb-8 flex h-28 w-28 items-center justify-center rounded-3xl bg-gradient-to-br from-[#FE3C72] to-[#FF6B6B] mx-auto shadow-2xl shadow-[#FE3C72]/30">
                        <Gift className="h-14 w-14 text-white" />
                    </div>
                    <h1 className="mb-4 text-3xl font-black text-white">Your Wrapped Awaits</h1>
                    <p className="mb-8 text-gray-400">
                        Complete your Cupid setup first, then log some dates to unlock your personalized Relationship Wrapped!
                    </p>
                    <Link
                        href="/cupid"
                        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#FE3C72] to-[#FF6B6B] px-6 py-3 font-semibold text-white"
                    >
                        Start with Cupid <ChevronRight className="h-4 w-4" />
                    </Link>
                </motion.div>
            </div>
        )
    }

    // Not enough dates
    if (completedDates.length < FULL_WRAPPED_THRESHOLD) {
        const remaining = FULL_WRAPPED_THRESHOLD - completedDates.length
        return (
            <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center max-w-md"
                >
                    <motion.div
                        animate={{ y: [-5, 5, -5] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="mb-8 flex h-28 w-28 items-center justify-center rounded-3xl bg-gradient-to-br from-[#FE3C72] to-[#FF6B6B] mx-auto shadow-2xl shadow-[#FE3C72]/30"
                    >
                        <Gift className="h-14 w-14 text-white" />
                    </motion.div>
                    <h1 className="mb-4 text-3xl font-black text-white">Almost There!</h1>
                    <p className="mb-2 text-gray-400">
                        Log <span className="font-bold text-[#FE3C72]">{remaining} more date{remaining > 1 ? 's' : ''}</span> to unlock your Wrapped
                    </p>
                    <p className="mb-8 text-sm text-gray-500">
                        Wrapped unlocks at {FULL_WRAPPED_THRESHOLD} dates
                    </p>

                    {/* Progress bar */}
                    <div className="mx-auto mb-8 h-3 w-64 overflow-hidden rounded-full bg-[#1a1a1a]">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(completedDates.length / FULL_WRAPPED_THRESHOLD) * 100}%` }}
                            className="h-full rounded-full bg-gradient-to-r from-[#FE3C72] to-[#FF6B6B]"
                        />
                    </div>

                    <Link
                        href="/cupid"
                        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#FE3C72] to-[#FF6B6B] px-6 py-3 font-semibold text-white"
                    >
                        Browse Date Ideas <ChevronRight className="h-4 w-4" />
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
            <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="h-12 w-12 rounded-full border-4 border-[#FE3C72] border-t-transparent"
                />
            </div>
        )
    }

    // Stories view
    if (showStories) {
        return (
            <AnimatePresence>
                <WrappedStories wrappedData={wrappedData} onClose={() => setShowStories(false)} />
            </AnimatePresence>
        )
    }

    // Landing page - properly centered
    return (
        <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center text-center max-w-md"
            >
                {/* Icon with glow */}
                <motion.div
                    animate={{ scale: [1, 1.05, 1], rotate: [0, 2, -2, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="relative mb-8"
                >
                    <div className="flex h-28 w-28 items-center justify-center rounded-3xl bg-gradient-to-br from-[#FE3C72] to-[#FF6B6B] shadow-2xl shadow-[#FE3C72]/40">
                        <Gift className="h-14 w-14 text-white" />
                    </div>
                    <motion.div
                        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0.2, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 rounded-3xl bg-[#FE3C72] blur-2xl -z-10"
                    />
                </motion.div>

                {/* Title */}
                <h1 className="mb-3 text-4xl font-black text-white">
                    Your Year in <span className="bg-gradient-to-r from-[#FE3C72] to-[#FF6B6B] bg-clip-text text-transparent">Dates</span>
                </h1>

                {/* Subtitle */}
                <p className="mb-8 text-gray-400">
                    Tap to experience your personalized dating story
                </p>

                {/* Button */}
                <motion.button
                    onClick={() => setShowStories(true)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#FE3C72] to-[#FF6B6B] px-8 py-4 text-lg font-bold text-white shadow-xl shadow-[#FE3C72]/30"
                >
                    View Wrapped
                    <ChevronRight className="h-5 w-5" />
                </motion.button>
            </motion.div>
        </div>
    )
}
