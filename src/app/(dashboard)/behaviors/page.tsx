'use client'

import { useState } from 'react'
import { BehaviorCard } from '@/components/BehaviorCard'
import { BehaviorDetailDrawer } from '@/components/BehaviorDetailDrawer'
import { behaviorTrends } from '@/data/mock-data'
import { BehaviorTrend } from '@/types'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp, Filter, Search, Bookmark, ChevronDown } from 'lucide-react'
import { useDashboard } from '@/context/DashboardContext'
import { useMemo, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

function BehaviorsContent() {
    const [selectedTrend, setSelectedTrend] = useState<BehaviorTrend | null>(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [sortBy, setSortBy] = useState<'growth' | 'mentions' | 'recent'>('growth')
    const [showSavedOnly, setShowSavedOnly] = useState(false)
    const { timeFilter, savedTrendIds } = useDashboard()
    const searchParams = useSearchParams()
    const trendId = searchParams.get('trendId')

    // Handle trendId from URL to open drawer automatically
    useEffect(() => {
        if (trendId) {
            const trend = behaviorTrends.find(t => t.id === trendId)
            if (trend) {
                // We need to apply the timeframe scaling to the selected trend as well
                // so the drawer matches the scale of the cards on the page.
                // However, the drawer logic uses the trend object passed to it.
                // For now, let's just find the raw trend.
                setSelectedTrend(trend)
            }
        }
    }, [trendId])

    // Simulate different data for different timeframes
    const trendsWithTimeframe = useMemo(() => {
        return behaviorTrends.map(trend => {
            // 1. Calculate realistic multipliers for Mention Counts
            // 24h = ~1/30 of a month, 7d = ~1/4, 12m = ~12x, All = ~25x
            const mentionMultiplier =
                timeFilter === '24h' ? (1 / 30) :
                    timeFilter === '7d' ? (7 / 30) :
                        timeFilter === '12m' ? 12 :
                            timeFilter === 'all' ? 25 : 1.0

            // 2. Calculate Growth Rates
            // 24h: ±0.5% to ±3% (very stable)
            // 7d: ±5% to ±20%
            // 30d: baseline (original data is 30d)
            // 12m: ±100% to ±800%
            let growthRate = trend.growthRate
            if (timeFilter === '24h') {
                growthRate = (trend.growthRate / Math.abs(trend.growthRate || 1)) * (1 + Math.random() * 2)
            } else if (timeFilter === '7d') {
                growthRate = trend.growthRate * 0.25
            } else if (timeFilter === '12m') {
                growthRate = trend.growthRate * 6.5
            } else if (timeFilter === 'all') {
                growthRate = trend.growthRate * 15
            }

            // 3. Handle Sparkline Data (Normalize to 30 points for smooth morphing)
            let sparklineData = []

            if (timeFilter === '24h') {
                // For 24h, stretch 24 hours into 30 points
                const last2 = trend.sparklineData.slice(-2)
                const startVal = last2[0].value
                const endVal = last2[1].value
                sparklineData = Array.from({ length: 30 }).map((_, i) => ({
                    date: `H${i}`,
                    value: Math.round(startVal + (endVal - startVal) * (i / 29) + (Math.random() * 0.05 - 0.025) * startVal)
                }))
            } else if (timeFilter === '7d') {
                // Stretch 7 days into 30 points
                const last7 = trend.sparklineData.slice(-7)
                sparklineData = Array.from({ length: 30 }).map((_, i) => {
                    const idx = Math.min(6, Math.floor((i / 29) * 6))
                    const nextIdx = Math.min(6, idx + 1)
                    const weight = (i / 29) * 6 - idx
                    const val = last7[idx].value * (1 - weight) + last7[nextIdx].value * weight
                    return { date: `D${i}`, value: Math.round(val + (Math.random() * 0.02 - 0.01) * val) }
                })
            } else if (timeFilter === '12m') {
                // Stretch 12 months into 30 points
                const base = trend.sparklineData[0].value
                const factor = trend.growthRate > 0 ? 1.05 : 0.95
                sparklineData = Array.from({ length: 30 }).map((_, i) => ({
                    date: `M${i}`,
                    value: Math.round(base * Math.pow(factor, (i / 29) * 12) * (1 + Math.random() * 0.15 - 0.075))
                }))
            } else {
                // Default 30d (already 31 points, slice to 30)
                sparklineData = trend.sparklineData.slice(0, 30)
            }

            return {
                ...trend,
                mentionCount: Math.round(trend.mentionCount * mentionMultiplier),
                growthRate: Math.round(growthRate),
                sparklineData
            }
        })
    }, [timeFilter])

    const filteredTrends = trendsWithTimeframe
        .filter(trend => {
            const matchesSearch = trend.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                trend.description.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesSaved = showSavedOnly ? savedTrendIds.has(trend.id) : true
            return matchesSearch && matchesSaved
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'growth':
                    return b.growthRate - a.growthRate
                case 'mentions':
                    return b.mentionCount - a.mentionCount
                case 'recent':
                    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
                default:
                    return 0
            }
        })

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-white flex items-center gap-2">
                        <TrendingUp className="h-6 w-6 text-primary-500" />
                        Behavior Trends
                    </h1>
                    <p className="mt-1 text-sm text-surface-400">
                        Discover emerging dating behaviors and patterns
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-sm text-surface-400">
                        {filteredTrends.length} trends
                    </span>
                </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-500" />
                    <input
                        type="text"
                        placeholder="Search trends..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-surface-800 border border-surface-700 rounded-lg text-white placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowSavedOnly(!showSavedOnly)}
                        className={cn(
                            'flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors',
                            showSavedOnly
                                ? 'border-primary-500/50 bg-primary-500/10 text-primary-400'
                                : 'border-surface-700 bg-surface-800 text-surface-400 hover:text-white'
                        )}
                    >
                        <Bookmark className={cn('h-4 w-4', showSavedOnly && 'fill-current')} />
                        Saved
                    </button>
                    <Filter className="h-4 w-4 text-surface-500 ml-2" />
                    <div className="relative">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as 'growth' | 'mentions' | 'recent')}
                            className="appearance-none bg-surface-800 border border-surface-700 rounded-lg pl-3 pr-10 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 cursor-pointer"
                        >
                            <option value="growth">Fastest Rising</option>
                            <option value="mentions">Most Mentioned</option>
                            <option value="recent">Recently Updated</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-500 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Trend Cards Grid */}
            <motion.div
                className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                {filteredTrends.map((trend, index) => (
                    <motion.div
                        key={trend.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <BehaviorCard
                            trend={trend}
                            onClick={() => setSelectedTrend(trend)}
                        />
                    </motion.div>
                ))}
            </motion.div>

            {filteredTrends.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-surface-400">No trends found matching your search.</p>
                </div>
            )}

            {/* Detail Drawer */}
            <AnimatePresence mode="wait">
                {selectedTrend && (
                    <BehaviorDetailDrawer
                        trend={selectedTrend}
                        onClose={() => setSelectedTrend(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    )
}

export default function BehaviorsPage() {
    return (
        <Suspense fallback={
            <div className="flex h-[50vh] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
            </div>
        }>
            <BehaviorsContent />
        </Suspense>
    )
}
