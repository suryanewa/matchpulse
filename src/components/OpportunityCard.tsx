'use client'

import { OpportunityCard as OpportunityCardType } from '@/types'
import { Chip } from '@/components/ui/Chip'
import { getPersonaById, getTrendById } from '@/data/mock-data'
import { formatNumber, formatGrowth, getSeverityColor, getStatusColor, cn } from '@/lib/utils'
import {
    ChevronDown,
    MessageSquare,
    Download,
    MoreHorizontal,
    TrendingUp,
    Users,
    Zap
} from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ScaleButton } from '@/components/ui/MotionPrimitives'

interface OpportunityCardProps {
    opportunity: OpportunityCardType
    onStatusChange?: (id: string, status: OpportunityCardType['status']) => void
}

export function OpportunityCard({ opportunity, onStatusChange }: OpportunityCardProps) {
    const [isExpanded, setIsExpanded] = useState(false)
    const [notes, setNotes] = useState(opportunity.notes)

    const linkedPersonas = opportunity.personaIds.map(id => getPersonaById(id)).filter(Boolean)
    const linkedTrends = opportunity.clusterIds.map(id => getTrendById(id)).filter(Boolean)

    return (
        <motion.article
            layout
            className="rounded-xl border border-surface-800 bg-surface-900/50 transition-colors hover:border-surface-700"
        >
            {/* Main Content */}
            <div className="p-5">
                {/* Header */}
                <div className="mb-4 flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <Chip className={getSeverityColor(opportunity.severity)} size="sm">
                                {opportunity.severity}
                            </Chip>
                            <Chip className={getStatusColor(opportunity.status)} size="sm">
                                {opportunity.status.replace('_', ' ')}
                            </Chip>
                            <span className="text-xs text-surface-500">
                                {(opportunity.confidence * 100).toFixed(0)}% confidence
                            </span>
                        </div>
                        <motion.h3 layout="position" className="text-lg font-semibold text-white">
                            {opportunity.title}
                        </motion.h3>
                    </div>
                    <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-surface-700 text-surface-400 hover:bg-surface-800 hover:text-white">
                        <MoreHorizontal className="h-4 w-4" />
                    </button>
                </div>

                {/* Problem Statement */}
                <motion.p layout="position" className="mb-4 text-surface-300">
                    {opportunity.problemStatement}
                </motion.p>

                {/* Signals */}
                <div className="mb-4 flex items-center gap-4 rounded-lg bg-surface-800/50 p-3">
                    <div className="flex items-center gap-1.5">
                        <MessageSquare className="h-4 w-4 text-surface-500" />
                        <span className="text-sm font-medium text-white">
                            {formatNumber(opportunity.signals.mentionCount)}
                        </span>
                        <span className="text-xs text-surface-500">mentions</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <TrendingUp className="h-4 w-4 text-emerald-400" />
                        <span className="text-sm font-medium text-emerald-400">
                            {formatGrowth(opportunity.signals.growthPercentage)}
                        </span>
                        <span className="text-xs text-surface-500">growth</span>
                    </div>
                </div>

                {/* Linked Entities */}
                <div className="mb-4 flex flex-wrap items-center gap-2">
                    <Users className="h-4 w-4 text-surface-500" />
                    {linkedPersonas.map((persona) => persona && (
                        <span key={persona.id} className="flex items-center gap-1 rounded-full bg-surface-800 px-2 py-0.5 text-xs text-surface-300">
                            {persona.emoji} {persona.name}
                        </span>
                    ))}
                    <span className="mx-1 text-surface-600">•</span>
                    <Zap className="h-4 w-4 text-surface-500" />
                    {linkedTrends.map((trend) => trend && (
                        <span key={trend.id} className="rounded-full bg-surface-800 px-2 py-0.5 text-xs text-surface-300">
                            {trend.title.slice(0, 20)}...
                        </span>
                    ))}
                </div>

                {/* Expand Button */}
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex w-full items-center justify-center gap-1 rounded-lg border border-surface-700 bg-surface-800/50 py-2 text-sm text-surface-400 transition-colors hover:bg-surface-800 hover:text-white"
                >
                    {isExpanded ? 'Show less' : 'Show more'}
                    <ChevronDown className={cn(
                        'h-4 w-4 transition-transform duration-300',
                        isExpanded && 'rotate-180'
                    )} />
                </button>
            </div>

            {/* Expanded Content */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <div className="border-t border-surface-800 p-5">
                            {/* Why Now */}
                            <div className="mb-4">
                                <h4 className="mb-2 text-sm font-semibold text-surface-300">Why Now</h4>
                                <p className="text-sm text-surface-400">{opportunity.whyNow}</p>
                            </div>

                            {/* Evidence */}
                            <div className="mb-4">
                                <h4 className="mb-2 text-sm font-semibold text-surface-300">Evidence</h4>
                                <div className="space-y-2">
                                    {opportunity.evidenceSnippets.map((snippet, i) => (
                                        <div key={i} className="rounded-lg bg-surface-800/50 p-3">
                                            <p className="text-sm text-surface-200 italic">&ldquo;{snippet.text}&rdquo;</p>
                                            <span className="mt-1 text-xs text-surface-500">via {snippet.source}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Potential Directions */}
                            <div className="mb-4">
                                <h4 className="mb-2 text-sm font-semibold text-surface-300">Potential Directions</h4>
                                <ul className="space-y-1">
                                    {opportunity.potentialDirections.map((direction, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-surface-400">
                                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-pulse-400" />
                                            {direction}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Notes */}
                            <div className="mb-4">
                                <h4 className="mb-2 text-sm font-semibold text-surface-300">Notes</h4>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Add notes..."
                                    className="w-full rounded-lg border border-surface-700 bg-surface-800 p-3 text-sm text-white placeholder-surface-500 focus:border-pulse-500 focus:outline-none focus:ring-1 focus:ring-pulse-500"
                                    rows={3}
                                />
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3">
                                <select
                                    value={opportunity.status}
                                    onChange={(e) => onStatusChange?.(opportunity.id, e.target.value as OpportunityCardType['status'])}
                                    className="flex-1 rounded-lg border border-surface-700 bg-surface-800 px-3 py-2 text-sm text-white focus:border-pulse-500 focus:outline-none"
                                >
                                    <option value="new">New</option>
                                    <option value="reviewed">Reviewed</option>
                                    <option value="in_discovery">In Discovery</option>
                                    <option value="not_relevant">Not Relevant</option>
                                </select>
                                <ScaleButton className="flex items-center gap-2 rounded-lg border border-surface-700 bg-surface-800 px-4 py-2 text-sm text-surface-300 transition-colors hover:bg-surface-700 hover:text-white">
                                    <Download className="h-4 w-4" />
                                    Export
                                </ScaleButton>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.article>
    )
}
