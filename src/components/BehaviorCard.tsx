'use client'

import { BehaviorTrend } from '@/types'
import { Chip } from '@/components/ui/Chip'
import { Sparkline } from '@/components/ui/Sparkline'
import { formatNumber, formatGrowth, cn } from '@/lib/utils'
import { TrendingUp, Users, Bookmark, BookmarkCheck, ExternalLink } from 'lucide-react'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { HoverCard } from '@/components/ui/MotionPrimitives'
import { personas } from '@/data/mock-data'

interface BehaviorCardProps {
    trend: BehaviorTrend
    onClick: (trend: BehaviorTrend) => void
}

export function BehaviorCard({ trend, onClick }: BehaviorCardProps) {
    const [isSaved, setIsSaved] = useState(trend.isSaved)

    return (
        <HoverCard
            onClick={() => onClick(trend)}
            className="group relative cursor-pointer overflow-hidden rounded-xl border border-surface-800 bg-surface-900/50 p-5 transition-colors hover:border-surface-700 hover:bg-surface-900"
        >
            {/* Header */}
            <div className="mb-4 flex items-start justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Chip className={trend.growthRate > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'} size="sm">
                            {formatGrowth(trend.growthRate)}
                        </Chip>
                        <span className="text-xs text-surface-500">vs last 30d</span>
                    </div>
                    <motion.h3
                        layoutId={`title-${trend.id}`}
                        className="text-lg font-semibold text-white group-hover:text-pulse-300 transition-colors"
                    >
                        {trend.title}
                    </motion.h3>
                </div>
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                        e.stopPropagation()
                        setIsSaved(!isSaved)
                    }}
                    className={cn(
                        'flex h-8 w-8 items-center justify-center rounded-full transition-colors',
                        isSaved ? 'text-pulse-400' : 'text-surface-600 group-hover:text-surface-400'
                    )}
                >
                    {isSaved ? <BookmarkCheck className="h-5 w-5" /> : <Bookmark className="h-5 w-5" />}
                </motion.button>
            </div>

            {/* Description */}
            <p className="mb-4 text-sm text-surface-400 line-clamp-2">
                {trend.description}
            </p>

            {/* Sparkline Area */}
            <div className="mb-4 h-16 w-full">
                <Sparkline
                    data={trend.sparklineData}
                    color={trend.growthRate > 0 ? '#10b981' : '#ef4444'}
                    height={64}
                />
            </div>

            {/* Footer Stats */}
            <div className="flex items-center justify-between border-t border-surface-800 pt-4">
                <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1.5">
                        <Users className="h-4 w-4 text-surface-500" />
                        <span className="font-medium text-white">{formatNumber(trend.mentionCount)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <TrendingUp className="h-4 w-4 text-emerald-400" />
                        <span className="font-medium text-white">High</span>
                    </div>
                </div>

                {/* Platform Icons (mini) */}
                <div className="flex -space-x-2">
                    {trend.platformBreakdown.slice(0, 3).map((p, i) => (
                        <div
                            key={p.sourceId}
                            className="flex h-6 w-6 items-center justify-center rounded-full border border-surface-900 bg-surface-800 text-[10px] text-surface-400 ring-2 ring-surface-950"
                            style={{ zIndex: 3 - i }}
                        >
                            {p.sourceId.charAt(0).toUpperCase()}
                        </div>
                    ))}
                </div>
            </div>

            {/* Linked Personas */}
            <div className="flex items-center gap-2 border-t border-surface-800 pt-4 mt-4">
                <span className="text-xs text-surface-500">Personas:</span>
                <div className="flex items-center gap-1.5">
                    {trend.linkedPersonas.slice(0, 3).map((link) => {
                        const persona = personas.find(p => p.id === link.personaId)
                        if (!persona) return null
                        return (
                            <div
                                key={link.personaId}
                                className="flex items-center gap-1 rounded-full bg-surface-800 px-2 py-0.5"
                                title={`${persona.name} (${(link.confidence * 100).toFixed(0)}% confidence)`}
                            >
                                <span className="text-sm">{persona.emoji}</span>
                                <span className="text-xs text-surface-300">
                                    {(link.confidence * 100).toFixed(0)}%
                                </span>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Hover indicator */}
            <div className="absolute bottom-4 right-4 opacity-0 transition-opacity group-hover:opacity-100">
                <ExternalLink className="h-4 w-4 text-surface-500" />
            </div>
        </HoverCard>
    )
}
