'use client'

import { useState, useMemo } from 'react'
import { behaviorTrends } from '@/data/mock-data'
import { BehaviorCard } from '@/components/BehaviorCard'
import { BehaviorDetailDrawer } from '@/components/BehaviorDetailDrawer'
import { BehaviorTrend, TimeFilter, SortOption } from '@/types'
import { StaggerContainer, StaggerItem } from '@/components/ui/MotionPrimitives'
import { cn } from '@/lib/utils'
import { Filter, SlidersHorizontal } from 'lucide-react'

const timeFilters: { value: TimeFilter; label: string }[] = [
    { value: '7d', label: '7 days' },
    { value: '30d', label: '30 days' },
    { value: '90d', label: '90 days' },
    { value: 'all', label: 'All time' },
]

const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'fastest_rising', label: 'Fastest Rising' },
    { value: 'most_mentioned', label: 'Most Mentioned' },
    { value: 'most_polarizing', label: 'Most Polarizing' },
    { value: 'newest', label: 'Newest' },
]

export default function BehaviorsPage() {
    const [timeFilter, setTimeFilter] = useState<TimeFilter>('30d')
    const [sortBy, setSortBy] = useState<SortOption>('fastest_rising')
    const [selectedTrend, setSelectedTrend] = useState<BehaviorTrend | null>(null)
    const [showFilters, setShowFilters] = useState(false)

    const sortedTrends = useMemo(() => {
        const trends = [...behaviorTrends]

        switch (sortBy) {
            case 'fastest_rising':
                return trends.sort((a, b) => b.growthRate - a.growthRate)
            case 'most_mentioned':
                return trends.sort((a, b) => b.mentionCount - a.mentionCount)
            case 'most_polarizing':
                return trends.sort((a, b) =>
                    Math.abs(a.sentimentScore || 0) - Math.abs(b.sentimentScore || 0)
                ).reverse()
            case 'newest':
                return trends.sort((a, b) =>
                    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
                )
            default:
                return trends
        }
    }, [sortBy])

    const handleTrendClick = (trend: BehaviorTrend) => {
        setSelectedTrend(trend)
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Rising Behaviors</h1>
                    <p className="mt-1 text-surface-400">
                        Emerging dating trends and behaviors from public discourse
                    </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-surface-400">
                    <span className="font-medium text-white">{behaviorTrends.length}</span> trends tracked
                </div>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-surface-800 bg-surface-900/50 p-4">
                {/* Time Filters */}
                <div className="flex items-center gap-2">
                    <span className="text-sm text-surface-500">Time Range:</span>
                    <div className="flex gap-1 rounded-lg bg-surface-800 p-1">
                        {timeFilters.map((filter) => (
                            <button
                                key={filter.value}
                                onClick={() => setTimeFilter(filter.value)}
                                className={cn(
                                    'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                                    timeFilter === filter.value
                                        ? 'bg-surface-700 text-white'
                                        : 'text-surface-400 hover:text-white'
                                )}
                            >
                                {filter.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Sort & Filter */}
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-surface-500">Sort by:</span>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as SortOption)}
                            className="rounded-lg border border-surface-700 bg-surface-800 px-3 py-1.5 text-sm text-white focus:border-pulse-500 focus:outline-none focus:ring-1 focus:ring-pulse-500"
                        >
                            {sortOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={cn(
                            'flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors',
                            showFilters
                                ? 'border-pulse-500/50 bg-pulse-500/10 text-pulse-300'
                                : 'border-surface-700 text-surface-400 hover:bg-surface-800 hover:text-white'
                        )}
                    >
                        <SlidersHorizontal className="h-4 w-4" />
                        Filters
                    </button>
                </div>
            </div>

            {/* Extended Filters (expandable) */}
            {showFilters && (
                <div className="animate-fade-in rounded-xl border border-surface-800 bg-surface-900/50 p-4">
                    <div className="flex flex-wrap gap-6">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-surface-300">
                                Platforms
                            </label>
                            <div className="flex gap-2">
                                {['TikTok', 'Reddit', 'X/Twitter'].map((platform) => (
                                    <button
                                        key={platform}
                                        className="rounded-full border border-surface-700 bg-surface-800 px-3 py-1 text-sm text-surface-300 transition-colors hover:border-pulse-500/50 hover:text-white"
                                    >
                                        {platform}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-medium text-surface-300">
                                Sentiment
                            </label>
                            <div className="flex gap-2">
                                {['Positive', 'Neutral', 'Negative'].map((sentiment) => (
                                    <button
                                        key={sentiment}
                                        className="rounded-full border border-surface-700 bg-surface-800 px-3 py-1 text-sm text-surface-300 transition-colors hover:border-pulse-500/50 hover:text-white"
                                    >
                                        {sentiment}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Trends Grid */}
            <StaggerContainer className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {sortedTrends.map(trend => (
                    <StaggerItem key={trend.id}>
                        <BehaviorCard
                            trend={trend}
                            onClick={handleTrendClick}
                        />
                    </StaggerItem>
                ))}
            </StaggerContainer>

            {/* Detail Drawer */}
            {selectedTrend && (
                <BehaviorDetailDrawer
                    trend={selectedTrend}
                    onClose={() => setSelectedTrend(null)}
                />
            )}
        </div>
    )
}
