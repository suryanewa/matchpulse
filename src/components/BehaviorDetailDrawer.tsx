'use client'

import { BehaviorTrend } from '@/types'
import { getPersonaById, contentSources } from '@/data/mock-data'
import { Sparkline } from '@/components/ui/Sparkline'
import { Chip } from '@/components/ui/Chip'
import { formatNumber, formatGrowth, cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { X, ArrowRight, Share2, MessageSquare, Bookmark, BookmarkCheck, ExternalLink, TrendingUp, TrendingDown } from 'lucide-react'
import { useDashboard } from '@/context/DashboardContext'
import { createPortal } from 'react-dom'
import { useEffect, useState } from 'react'

interface BehaviorDetailDrawerProps {
    trend: BehaviorTrend | null
    onClose: () => void
}

export function BehaviorDetailDrawer({ trend, onClose }: BehaviorDetailDrawerProps) {
    const { savedTrendIds, toggleSaveTrend, timeFilter } = useDashboard()
    const isSaved = trend ? savedTrendIds.has(trend.id) : false
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        if (trend) {
            document.body.style.overflow = 'hidden'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [trend])

    if (!mounted || !trend) return null

    const isPositiveGrowth = trend.growthRate > 0

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-end justify-end">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Drawer */}
            <motion.aside
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="relative flex h-full w-full max-w-xl flex-col border-l border-surface-800 bg-surface-950 shadow-2xl"
            >
                {/* Header */}
                <div className="flex-shrink-0 flex items-center justify-between border-b border-surface-800 bg-surface-950/95 p-6 backdrop-blur-sm">
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
                            onClick={() => toggleSaveTrend(trend.id)}
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
                <div className="flex-1 overflow-y-auto p-6">
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
                            Trend Over Time ({timeFilter === '24h' ? '24 hours' : timeFilter === '7d' ? '7 days' : '30 days'})
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
                            {trend.representativePosts.map((post, index) => {
                                const CardWrapper = post.url ? 'a' : 'div'
                                const wrapperProps = post.url ? {
                                    href: post.url,
                                    target: '_blank',
                                    rel: 'noopener noreferrer',
                                    className: "block rounded-lg border border-surface-800 bg-surface-900/50 p-4 transition-all hover:border-surface-600 hover:bg-surface-800/80 group"
                                } : {
                                    className: "rounded-lg border border-surface-800 bg-surface-900/50 p-4"
                                }

                                return (
                                    <CardWrapper key={index} {...(wrapperProps as any)}>
                                        <div className="flex justify-between gap-2">
                                            <p className="mb-3 text-sm text-surface-200 italic flex-1">
                                                &ldquo;{post.text}&rdquo;
                                            </p>
                                            {post.url && (
                                                <ExternalLink className="h-3.5 w-3.5 shrink-0 text-surface-500 transition-colors group-hover:text-pulse-400" />
                                            )}
                                        </div>
                                        <div className="flex items-center justify-between text-xs text-surface-500">
                                            <span>via {post.source}</span>
                                            <span>{formatNumber(post.engagement)} engagements</span>
                                        </div>
                                    </CardWrapper>
                                )
                            })}
                        </div>
                    </div>

                </div>
            </motion.aside>
        </div>,
        document.body
    )
}
