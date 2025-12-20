'use client'

import { BehaviorTrend } from '@/types'
import { Sparkline } from '@/components/ui/Sparkline'
import { Chip } from '@/components/ui/Chip'
import { formatNumber, formatGrowth, cn } from '@/lib/utils'
import { TrendingUp, TrendingDown, Bookmark, BookmarkCheck } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useDashboard } from '@/context/DashboardContext'

interface BehaviorCardProps {
    trend: BehaviorTrend
    onClick?: () => void
}

export function BehaviorCard({ trend, onClick }: BehaviorCardProps) {
    const { savedTrendIds, toggleSaveTrend } = useDashboard()
    const isSaved = savedTrendIds.has(trend.id)
    const isPositiveGrowth = trend.growthRate > 0

    const handleSave = (e: React.MouseEvent) => {
        e.stopPropagation()
        toggleSaveTrend(trend.id)
    }

    return (
        <motion.div
            onClick={onClick}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
                'group relative cursor-pointer overflow-hidden rounded-xl border border-surface-800 bg-surface-900/50 p-5 transition-colors',
                'hover:border-surface-700 hover:bg-surface-900'
            )}
        >
            {/* Save Button */}
            <button
                onClick={handleSave}
                className={cn(
                    'absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-lg border transition-all',
                    isSaved
                        ? 'border-pulse-500/50 bg-pulse-500/10 text-pulse-400'
                        : 'border-transparent bg-surface-800/50 text-surface-500 opacity-0 group-hover:opacity-100 hover:text-white'
                )}
            >
                {isSaved ? (
                    <BookmarkCheck className="h-4 w-4" />
                ) : (
                    <Bookmark className="h-4 w-4" />
                )}
            </button>

            {/* Growth Indicator */}
            <div className={cn(
                'mb-4 flex h-10 w-10 items-center justify-center rounded-lg',
                isPositiveGrowth ? 'bg-emerald-500/20' : 'bg-rose-500/20'
            )}>
                {isPositiveGrowth ? (
                    <TrendingUp className="h-5 w-5 text-emerald-400" />
                ) : (
                    <TrendingDown className="h-5 w-5 text-rose-400" />
                )}
            </div>

            {/* Title & Description */}
            <h3 className="mb-2 font-semibold text-white line-clamp-2">
                {trend.title}
            </h3>
            <p className="mb-4 text-sm text-surface-400 line-clamp-2">
                {trend.description}
            </p>

            {/* Sparkline */}
            <div className="mb-4 h-12">
                <Sparkline
                    data={trend.sparklineData}
                    color={isPositiveGrowth ? '#10b981' : '#ef4444'}
                    height={48}
                />
            </div>

            {/* Stats */}
            <div className="mb-4 flex items-center justify-between text-sm">
                <div>
                    <span className="text-surface-500">Mentions: </span>
                    <span className="font-medium text-white">{formatNumber(trend.mentionCount)}</span>
                </div>
                <Chip
                    variant={isPositiveGrowth ? 'success' : 'danger'}
                    size="sm"
                >
                    {formatGrowth(trend.growthRate)}
                </Chip>
            </div>

            {/* Top Phrases */}
            <div className="flex flex-wrap gap-1">
                {trend.topPhrases.slice(0, 3).map((phrase) => (
                    <Chip key={phrase} variant="outline" size="sm">
                        {phrase}
                    </Chip>
                ))}
                {trend.topPhrases.length > 3 && (
                    <Chip variant="outline" size="sm">
                        +{trend.topPhrases.length - 3}
                    </Chip>
                )}
            </div>
        </motion.div>
    )
}
