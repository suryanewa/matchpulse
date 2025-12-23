'use client'

import { BehaviorTrend } from '@/types'
import { getPersonaById, contentSources } from '@/data/mock-data'
import { Sparkline } from '@/components/ui/Sparkline'
import { formatNumber, formatGrowth, cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { X, ArrowRight, Bookmark, Heart, ExternalLink, TrendingUp, TrendingDown } from 'lucide-react'
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
                className="fixed inset-0 bg-black/70 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Drawer - Tinder style */}
            <motion.aside
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="relative flex h-full w-full max-w-xl flex-col bg-[#111] shadow-2xl"
            >
                {/* Header - Tinder style */}
                <div className="flex-shrink-0 flex items-center justify-between bg-[#1a1a1a] p-5">
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            'flex h-12 w-12 items-center justify-center rounded-xl',
                            isPositiveGrowth
                                ? 'bg-gradient-to-br from-emerald-500 to-teal-500'
                                : 'bg-gradient-to-br from-rose-500 to-red-500'
                        )}>
                            {isPositiveGrowth ? (
                                <TrendingUp className="h-6 w-6 text-white" />
                            ) : (
                                <TrendingDown className="h-6 w-6 text-white" />
                            )}
                        </div>
                        <div>
                            <span className="text-xs text-gray-500">Behavior Trend</span>
                            <div className="flex items-center gap-2">
                                <span className={cn(
                                    'text-lg font-bold',
                                    isPositiveGrowth ? 'text-emerald-400' : 'text-rose-400'
                                )}>
                                    {formatGrowth(trend.growthRate)}
                                </span>
                                <span className="text-xs text-gray-500">vs last period</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => toggleSaveTrend(trend.id)}
                            className={cn(
                                'flex h-10 w-10 items-center justify-center rounded-full transition-all',
                                isSaved
                                    ? 'bg-[#FE3C72] text-white'
                                    : 'bg-[#2a2a2a] text-gray-400 hover:bg-[#333] hover:text-white'
                            )}
                        >
                            {isSaved ? (
                                <Heart className="h-5 w-5 fill-current" />
                            ) : (
                                <Bookmark className="h-5 w-5" />
                            )}
                        </button>
                        <button
                            onClick={onClose}
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2a2a2a] text-gray-400 transition-all hover:bg-[#333] hover:text-white"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-5 space-y-6">
                    {/* Title & Description */}
                    <div>
                        <h2 className="mb-3 text-2xl font-bold text-white">
                            {trend.title}
                        </h2>
                        <p className="text-gray-400 leading-relaxed">
                            {trend.description}
                        </p>
                    </div>

                    {/* Stats Grid - Tinder style cards */}
                    <div className="grid grid-cols-3 gap-3">
                        <div className="rounded-2xl bg-[#1a1a1a] p-4">
                            <span className="text-xs text-gray-500">Total Mentions</span>
                            <div className="mt-1 text-2xl font-bold text-white">
                                {formatNumber(trend.mentionCount)}
                            </div>
                        </div>
                        <div className="rounded-2xl bg-[#1a1a1a] p-4">
                            <span className="text-xs text-gray-500">Growth Rate</span>
                            <div className={cn(
                                'mt-1 text-2xl font-bold',
                                isPositiveGrowth ? 'text-emerald-400' : 'text-rose-400'
                            )}>
                                {formatGrowth(trend.growthRate)}
                            </div>
                        </div>
                        <div className="rounded-2xl bg-[#1a1a1a] p-4">
                            <span className="text-xs text-gray-500">Sentiment</span>
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

                    {/* Sparkline - Tinder style */}
                    <div>
                        <h3 className="mb-3 text-sm font-semibold text-gray-400">
                            Trend Over Time ({timeFilter === '24h' ? '24 hours' : timeFilter === '7d' ? '7 days' : '30 days'})
                        </h3>
                        <div className="h-36 rounded-2xl bg-[#1a1a1a] p-4">
                            <Sparkline
                                data={trend.sparklineData}
                                color={isPositiveGrowth ? '#10b981' : '#f43f5e'}
                                height={100}
                                strokeWidth={3}
                                showGradient={true}
                            />
                        </div>
                    </div>

                    {/* Platform Breakdown - Tinder style bars */}
                    <div>
                        <h3 className="mb-3 text-sm font-semibold text-gray-400">
                            Platform Distribution
                        </h3>
                        <div className="space-y-3">
                            {trend.platformBreakdown.map((platform) => {
                                const source = contentSources.find(s => s.id === platform.sourceId)
                                return (
                                    <div key={platform.sourceId} className="flex items-center gap-3">
                                        <span className="text-xl">{source?.icon}</span>
                                        <span className="w-20 text-sm text-gray-300">{source?.name}</span>
                                        <div className="flex-1">
                                            <div className="h-2.5 overflow-hidden rounded-full bg-[#2a2a2a]">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${platform.percentage}%` }}
                                                    transition={{ duration: 1, delay: 0.2 }}
                                                    className="h-full rounded-full bg-gradient-to-r from-[#FE3C72] to-[#FF6B6B]"
                                                />
                                            </div>
                                        </div>
                                        <span className="w-12 text-right text-sm font-bold text-white">
                                            {platform.percentage}%
                                        </span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Top Phrases - Tinder style chips */}
                    <div>
                        <h3 className="mb-3 text-sm font-semibold text-gray-400">
                            Related Phrases
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {trend.topPhrases.map((phrase) => (
                                <span
                                    key={phrase}
                                    className="rounded-full bg-gradient-to-r from-[#FE3C72] to-[#FF6B6B] px-4 py-2 text-sm font-semibold text-white"
                                >
                                    {phrase}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Linked Personas - Tinder style cards */}
                    <div>
                        <h3 className="mb-3 text-sm font-semibold text-gray-400">
                            Associated Personas
                        </h3>
                        <div className="space-y-2">
                            {trend.linkedPersonas.map((link) => {
                                const persona = getPersonaById(link.personaId)
                                if (!persona) return null
                                return (
                                    <div
                                        key={link.personaId}
                                        className="flex items-center justify-between rounded-2xl bg-[#1a1a1a] p-4 transition-colors hover:bg-[#222]"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-3xl">{persona.emoji}</span>
                                            <div>
                                                <div className="font-semibold text-white">{persona.name}</div>
                                                <div className="text-xs text-gray-500">{persona.tagline}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="text-right">
                                                <div className="text-lg font-bold text-[#FE3C72]">
                                                    {(link.confidence * 100).toFixed(0)}%
                                                </div>
                                                <div className="text-xs text-gray-500">match</div>
                                            </div>
                                            <ArrowRight className="h-5 w-5 text-gray-600" />
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Representative Posts - Tinder style quote cards */}
                    <div>
                        <h3 className="mb-3 text-sm font-semibold text-gray-400">
                            Representative Posts
                        </h3>
                        <div className="space-y-3">
                            {trend.representativePosts.map((post, index) => {
                                const CardWrapper = post.url ? 'a' : 'div'
                                const wrapperProps = post.url ? {
                                    href: post.url,
                                    target: '_blank',
                                    rel: 'noopener noreferrer',
                                    className: "block rounded-2xl bg-[#1a1a1a] p-4 transition-all hover:bg-[#222] group"
                                } : {
                                    className: "rounded-2xl bg-[#1a1a1a] p-4"
                                }

                                return (
                                    <CardWrapper key={index} {...(wrapperProps as any)}>
                                        <div className="flex justify-between gap-2">
                                            <p className="mb-3 text-sm text-gray-300 italic flex-1">
                                                &ldquo;{post.text}&rdquo;
                                            </p>
                                            {post.url && (
                                                <ExternalLink className="h-4 w-4 shrink-0 text-gray-600 transition-colors group-hover:text-[#FE3C72]" />
                                            )}
                                        </div>
                                        <div className="flex items-center justify-between text-xs text-gray-500">
                                            <span>via {post.source}</span>
                                            <span className="font-medium text-gray-400">{formatNumber(post.engagement)} engagements</span>
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
