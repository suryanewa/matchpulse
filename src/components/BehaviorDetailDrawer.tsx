'use client'

import { BehaviorTrend } from '@/types'
import { getPersonaById, contentSources } from '@/data/mock-data'
import { Sparkline } from '@/components/ui/Sparkline'
import { formatNumber, formatGrowth, cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { X, ArrowRight, Heart, ExternalLink, TrendingUp, TrendingDown } from 'lucide-react'
import { useDashboard } from '@/context/DashboardContext'
import { createPortal } from 'react-dom'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface BehaviorDetailDrawerProps {
    trend: BehaviorTrend | null
    onClose: () => void
}

const TikTokIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.03-2.86-.31-4.13-1.03-2.28-1.3-3.6-3.81-3.23-6.39.14-1.28.6-2.5 1.39-3.51.83-1.05 1.93-1.86 3.19-2.35 1.28-.5 2.67-.61 4.03-.3v3.95c-1.18-.25-2.42-.03-3.4.67-1.14.81-1.6 2.22-1.14 3.5.42 1.2 1.66 2.05 2.94 1.96 1.47-.03 2.66-1.18 2.8-2.65.1-1.14.02-2.3.02-3.45V0h.01z" />
    </svg>
)

const RedditIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
    </svg>
)

const XIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.294 19.497h2.039L6.482 2.395H4.293l13.314 18.255z" />
    </svg>
)

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
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className={cn(
                            'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl',
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
                        <h2 className="text-lg font-bold text-white truncate">
                            {trend.title}
                        </h2>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-3">
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
                                <Heart className="h-5 w-5" />
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
                    {/* Description */}
                    <p className="text-gray-400 leading-relaxed">
                        {trend.description}
                    </p>

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
                                        <div className="flex h-8 w-8 items-center justify-center text-gray-400">
                                            {platform.sourceId === 'tiktok' && <TikTokIcon className="h-4 w-4" />}
                                            {platform.sourceId === 'reddit' && <RedditIcon className="h-5 w-5" />}
                                            {platform.sourceId === 'twitter' && <XIcon className="h-4 w-4" />}
                                        </div>
                                        <span className="w-20 text-sm font-medium text-gray-300">{source?.name}</span>
                                        <div className="flex-1">
                                            <div className="h-2.5 overflow-hidden rounded-full bg-[#2a2a2a]">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${platform.percentage}%` }}
                                                    transition={{ duration: 1, delay: 0.2 }}
                                                    className={cn(
                                                        'h-full rounded-full bg-gradient-to-r',
                                                        isPositiveGrowth
                                                            ? 'from-emerald-500 to-teal-500'
                                                            : 'from-rose-500 to-red-500'
                                                    )}
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
                                    className="rounded-full bg-[#2a2a2a] px-4 py-2 text-sm font-medium text-gray-300"
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
                                    <Link
                                        key={link.personaId}
                                        href={`/personas/${link.personaId}`}
                                        className="flex items-center justify-between rounded-2xl bg-[#1a1a1a] p-4 transition-colors hover:bg-[#222] group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-3xl">{persona.emoji}</span>
                                            <div>
                                                <div className="font-semibold text-white group-hover:text-white">{persona.name}</div>
                                                <div className="text-xs text-gray-400">{persona.tagline}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="text-right">
                                                <div className="text-lg font-bold text-white">
                                                    {(link.confidence * 100).toFixed(0)}%
                                                </div>
                                                <div className="text-xs text-gray-500">match</div>
                                            </div>
                                            <ArrowRight className="h-5 w-5 text-gray-600 transition-transform group-hover:translate-x-1" />
                                        </div>
                                    </Link>
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
