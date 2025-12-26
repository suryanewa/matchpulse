'use client'

import { BehaviorTrend } from '@/types'
import { Sparkline } from '@/components/ui/Sparkline'
import { formatNumber, formatGrowth, cn } from '@/lib/utils'
import { TrendingUp, TrendingDown, Heart } from 'lucide-react'
import { motion } from 'framer-motion'
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
            whileHover={{ y: -4, transition: { duration: 0.15, ease: 'easeOut' } }}
            whileTap={{ scale: 0.98 }}
            className="group relative h-full cursor-pointer overflow-hidden rounded-3xl bg-[#1a1a1a] p-5 shadow-lg transition-[background-color,box-shadow] duration-150 ease-out hover:bg-[#222] hover:shadow-xl hover:shadow-black/50 flex flex-col justify-between"
        >
            <div>
                {/* Header Row */}
                <div className="mb-4 flex items-start justify-between">
                    {/* Icon with Gradient Background */}
                    <div className={cn(
                        'flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br shadow-inner',
                        isPositiveGrowth
                            ? 'from-emerald-500 to-emerald-600'
                            : 'from-rose-500 to-rose-600'
                    )}>
                        {isPositiveGrowth ? (
                            <TrendingUp className="h-6 w-6 text-white" />
                        ) : (
                            <TrendingDown className="h-6 w-6 text-white" />
                        )}
                    </div>

                    {/* Save Button */}
                    <button
                        onClick={handleSave}
                        className={cn(
                            'flex h-10 w-10 items-center justify-center rounded-full transition-all',
                            isSaved
                                ? 'bg-[#FE3C72]/20 text-[#FE3C72]'
                                : 'bg-transparent text-gray-600 hover:bg-[#2a2a2a] hover:text-gray-400'
                        )}
                    >
                        {isSaved ? (
                            <Heart className="h-5 w-5 fill-current" />
                        ) : (
                            <Heart className="h-5 w-5" />
                        )}
                    </button>
                </div>

                {/* Title & Description */}
                <div className="mb-4">
                    <h3 className="mb-2 text-xl font-bold text-white line-clamp-2 leading-tight">
                        {trend.title}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                        {trend.description}
                    </p>
                </div>
            </div>

            {/* Metrics & Graph Row */}
            <div className="mt-auto">
                <div className="mb-4 h-24 w-full -mx-2">
                    <Sparkline
                        data={trend.sparklineData}
                        color={isPositiveGrowth ? '#10b981' : '#f43f5e'} // emerald-500 : rose-500
                        height={96}
                        strokeWidth={3}
                        showGradient={true}
                    />
                </div>

                <div className="flex items-end justify-between border-t border-[#2a2a2a] pt-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className={cn(
                                'text-2xl font-bold tracking-tight',
                                isPositiveGrowth ? 'text-emerald-500' : 'text-rose-500'
                            )}>
                                {formatGrowth(trend.growthRate)}
                            </span>
                        </div>
                        <span className="text-xs font-medium uppercase tracking-wider text-gray-600">
                            {formatNumber(trend.mentionCount)} Mentions
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
