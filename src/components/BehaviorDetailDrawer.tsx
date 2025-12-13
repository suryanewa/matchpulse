'use client'

import { useState } from 'react'
import { BehaviorTrend } from '@/types'
import { getPersonaById, contentSources } from '@/data/mock-data'
import { Sparkline } from '@/components/ui/Sparkline'
import { Chip } from '@/components/ui/Chip'
import { formatNumber, formatGrowth, formatRelativeTime, cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import {
    X,
    Bookmark,
    BookmarkCheck,
    ExternalLink,
    TrendingUp,
    TrendingDown,
    MessageSquare,
    Share2,
    ArrowRight
} from 'lucide-react'

interface BehaviorDetailDrawerProps {
    trend: BehaviorTrend | null
    onClose: () => void
}

export function BehaviorDetailDrawer({ trend, onClose }: BehaviorDetailDrawerProps) {
    const [isSaved, setIsSaved] = useState(trend?.isSaved || false)

    if (!trend) return null

    const isPositiveGrowth = trend.growthRate > 0

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Drawer */}
            <aside className="fixed right-0 top-0 z-50 h-full w-full max-w-xl overflow-y-auto border-l border-surface-800 bg-surface-950 shadow-2xl animate-slide-in-right">
                {/* Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-surface-800 bg-surface-950/95 p-6 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            'flex h-10 w-10 items-center justify-center rounded-lg',
                            isPositiveGrowth ? 'bg-emerald-500/20' : 'bg-rose-500/20'
                        )}>
                            {isPositiveGrowth ? (
                                <TrendingUp className="h-5 w-5 text-emerald-400" />
                            ) : (
                                <TrendingDown className="h-5 w-5 text-rose-400" />
                            )}
                        </div>
                        <div>
                            <span className="text-xs text-surface-500">Behavior Trend</span>
                            <div className="flex items-center gap-2">
                                <span className={cn(
                                    'text-sm font-semibold',
                                    isPositiveGrowth ? 'text-emerald-400' : 'text-rose-400'
                                )}>
                                    {formatGrowth(trend.growthRate)}
                                </span>
                                <span className="text-xs text-surface-500">vs last period</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsSaved(!isSaved)}
                            className={cn(
                                'flex h-9 w-9 items-center justify-center rounded-lg border transition-colors',
                                isSaved
                                    ? 'border-pulse-500/50 bg-pulse-500/10 text-pulse-400'
                                    : 'border-surface-700 text-surface-400 hover:bg-surface-800 hover:text-white'
                            )}
                        >
                            {isSaved ? (
                                <BookmarkCheck className="h-4 w-4" />
                            ) : (
                                <Bookmark className="h-4 w-4" />
                            )}
                        </button>
                        <button
                            onClick={onClose}
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-surface-700 text-surface-400 transition-colors hover:bg-surface-800 hover:text-white"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Title & Description */}
                    <div className="mb-6">
                        <h2 className="mb-2 text-2xl font-bold text-white">
                            {trend.title}
                        </h2>
                        <p className="text-surface-400">
                            {trend.description}
                        </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="mb-6 grid grid-cols-3 gap-4">
                        <div className="rounded-lg border border-surface-800 bg-surface-900/50 p-4">
                            <span className="text-xs text-surface-500">Total Mentions</span>
                            <div className="mt-1 text-2xl font-bold text-white">
                                {formatNumber(trend.mentionCount)}
                            </div>
                        </div>
                        <div className="rounded-lg border border-surface-800 bg-surface-900/50 p-4">
                            <span className="text-xs text-surface-500">Growth Rate</span>
                            <div className={cn(
                                'mt-1 text-2xl font-bold',
                                isPositiveGrowth ? 'text-emerald-400' : 'text-rose-400'
                            )}>
                                {formatGrowth(trend.growthRate)}
                            </div>
                        </div>
                        <div className="rounded-lg border border-surface-800 bg-surface-900/50 p-4">
                            <span className="text-xs text-surface-500">Sentiment</span>
                            <div className={cn(
                                'mt-1 text-2xl font-bold',
                                (trend.sentimentScore || 0) > 0 ? 'text-emerald-400' :
                                    (trend.sentimentScore || 0) < 0 ? 'text-rose-400' : 'text-amber-400'
                            )}>
                                {(trend.sentimentScore || 0) > 0 ? 'Positive' :
                                    (trend.sentimentScore || 0) < 0 ? 'Negative' : 'Mixed'}
                            </div>
                        </div>
                    </div>

                    {/* Sparkline */}
                    <div className="mb-6">
                        <h3 className="mb-3 text-sm font-semibold text-surface-300">
                            Trend Over Time (30 days)
                        </h3>
                        <div className="h-32 rounded-lg border border-surface-800 bg-surface-900/50 p-4">
                            <Sparkline
                                data={trend.sparklineData}
                                color={isPositiveGrowth ? '#10b981' : '#ef4444'}
                                height={80}
                            />
                        </div>
                    </div>

                    {/* Platform Breakdown */}
                    <div className="mb-6">
                        <h3 className="mb-3 text-sm font-semibold text-surface-300">
                            Platform Distribution
                        </h3>
                        <div className="space-y-2">
                            {trend.platformBreakdown.map((platform) => {
                                const source = contentSources.find(s => s.id === platform.sourceId)
                                return (
                                    <div key={platform.sourceId} className="flex items-center gap-3">
                                        <span className="text-lg">{source?.icon}</span>
                                        <span className="w-20 text-sm text-surface-300">{source?.name}</span>
                                        <div className="flex-1">
                                            <div className="h-2 overflow-hidden rounded-full bg-surface-800">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${platform.percentage}%` }}
                                                    transition={{ duration: 1, delay: 0.2 }}
                                                    className="h-full rounded-full bg-gradient-to-r from-pulse-500 to-accent-500"
                                                />
                                            </div>
                                        </div>
                                        <span className="w-12 text-right text-sm font-medium text-white">
                                            {platform.percentage}%
                                        </span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Top Phrases */}
                    <div className="mb-6">
                        <h3 className="mb-3 text-sm font-semibold text-surface-300">
                            Related Phrases
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {trend.topPhrases.map((phrase) => (
                                <Chip key={phrase} variant="primary" size="md">
                                    {phrase}
                                </Chip>
                            ))}
                        </div>
                    </div>

                    {/* Linked Personas */}
                    <div className="mb-6">
                        <h3 className="mb-3 text-sm font-semibold text-surface-300">
                            Associated Personas
                        </h3>
                        <div className="space-y-2">
                            {trend.linkedPersonas.map((link) => {
                                const persona = getPersonaById(link.personaId)
                                if (!persona) return null
                                return (
                                    <div
                                        key={link.personaId}
                                        className="flex items-center justify-between rounded-lg border border-surface-800 bg-surface-900/50 p-3 transition-colors hover:border-surface-700"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">{persona.emoji}</span>
                                            <div>
                                                <div className="font-medium text-white">{persona.name}</div>
                                                <div className="text-xs text-surface-500">{persona.tagline}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="text-right">
                                                <div className="text-sm font-semibold text-white">
                                                    {(link.confidence * 100).toFixed(0)}%
                                                </div>
                                                <div className="text-xs text-surface-500">confidence</div>
                                            </div>
                                            <ArrowRight className="h-4 w-4 text-surface-500" />
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Representative Posts */}
                    <div className="mb-6">
                        <h3 className="mb-3 text-sm font-semibold text-surface-300">
                            Representative Posts
                        </h3>
                        <div className="space-y-3">
                            {trend.representativePosts.map((post, index) => (
                                <div
                                    key={index}
                                    className="rounded-lg border border-surface-800 bg-surface-900/50 p-4"
                                >
                                    <p className="mb-3 text-sm text-surface-200 italic">
                                        &ldquo;{post.text}&rdquo;
                                    </p>
                                    <div className="flex items-center justify-between text-xs text-surface-500">
                                        <span>via {post.source}</span>
                                        <span>{formatNumber(post.engagement)} engagements</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-surface-700 bg-surface-800 py-3 text-sm font-medium text-white transition-colors hover:bg-surface-700">
                            <Share2 className="h-4 w-4" />
                            Share
                        </button>
                        <button className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-pulse-500 to-accent-500 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90">
                            <MessageSquare className="h-4 w-4" />
                            Create Opportunity
                        </button>
                    </div>
                </div>
            </aside>
        </>
    )
}
