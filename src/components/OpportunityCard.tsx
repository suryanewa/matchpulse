import { OpportunityCard as OpportunityCardType, Persona, BehaviorTrend } from '@/types'
import { Chip } from '@/components/ui/Chip'
import { getPersonaById, getTrendById } from '@/data/mock-data'
import { formatNumber, formatGrowth, getSeverityColor, getStatusColor, cn, formatRelativeTime, getTimeBasedStats, TimeFilter } from '@/lib/utils'
import {
    ChevronDown,
    MessageSquare,
    TrendingUp,
    Users,
    Zap,
    ExternalLink,
    AlertCircle,
    Clock,
    Search as SearchIcon,
    Trash2,
    CheckCircle2,
    BarChart3,
    ArrowUpRight,
    Calendar,
    Target
} from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ScaleButton } from '@/components/ui/MotionPrimitives'
import Link from 'next/link'

interface OpportunityCardProps {
    opportunity: OpportunityCardType
    onStatusChange?: (id: string, status: OpportunityCardType['status']) => void
    timeFilter?: TimeFilter
}

const getSeverityIcon = (severity: string) => {
    switch (severity) {
        case 'critical': return <AlertCircle className="h-3 w-3" />
        case 'high': return <AlertCircle className="h-3 w-3" />
        case 'medium': return <AlertCircle className="h-3 w-3" />
        case 'low': return <AlertCircle className="h-3 w-3" />
        default: return null
    }
}

const getStatusIcon = (status: string) => {
    switch (status) {
        case 'new': return <Clock className="h-3 w-3" />
        case 'reviewed': return <CheckCircle2 className="h-3 w-3" />
        case 'in_discovery': return <SearchIcon className="h-3 w-3" />
        case 'not_relevant': return <Trash2 className="h-3 w-3" />
        default: return null
    }
}

export function OpportunityCard({ opportunity, onStatusChange, timeFilter = '30d' }: OpportunityCardProps) {
    const [isExpanded, setIsExpanded] = useState(false)
    const [notes, setNotes] = useState(opportunity.notes)

    const linkedPersonas = opportunity.personaIds.map(id => getPersonaById(id)).filter((p): p is Persona => !!p)
    const linkedTrends = opportunity.clusterIds.map(id => getTrendById(id)).filter((t): t is BehaviorTrend => !!t)

    // Calculate time-based stats
    const timeStats = getTimeBasedStats(
        opportunity.signals.mentionCount,
        opportunity.signals.growthPercentage,
        timeFilter
    )

    return (
        <motion.article
            layout
            className="group overflow-hidden rounded-2xl border border-surface-800 bg-surface-900/40 transition-all hover:border-surface-700 hover:bg-surface-900/60 shadow-sm hover:shadow-xl hover:shadow-primary-500/5"
        >
            {/* Main Content */}
            <div className="p-5">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left: Info & Problem */}
                    <div className="lg:col-span-8 space-y-4">
                        <div className="space-y-3">
                            {/* Status/Severity/Confidence Row */}
                            <div className="flex flex-wrap items-center gap-2">
                                {(() => {
                                    const severityColors = getSeverityColor(opportunity.severity)
                                    return (
                                        <Chip
                                            className={cn("gap-1.5", severityColors.className)}
                                            style={severityColors.style}
                                            size="sm"
                                            variant="custom"
                                        >
                                            {getSeverityIcon(opportunity.severity)}
                                            {opportunity.severity}
                                        </Chip>
                                    )
                                })()}
                                {(() => {
                                    const statusColors = getStatusColor(opportunity.status)
                                    return (
                                        <Chip
                                            className={cn("gap-1.5", statusColors.className)}
                                            style={statusColors.style}
                                            size="sm"
                                            variant="custom"
                                        >
                                            {getStatusIcon(opportunity.status)}
                                            {opportunity.status.replace('_', ' ')}
                                        </Chip>
                                    )
                                })()}
                                <div className="flex items-center gap-1.5 ml-1 px-2 py-0.5 rounded-full bg-surface-800/50 border border-surface-700/50">
                                    <Target className="h-3 w-3 text-surface-500" />
                                    <span className="text-[10px] font-bold text-surface-400 uppercase tracking-widest leading-none pt-0.5">
                                        {(opportunity.confidence * 100).toFixed(0)}% Confidence
                                    </span>
                                </div>
                            </div>

                            <motion.h3 layout="position" className="text-xl font-bold text-white tracking-tight group-hover:text-primary-400 transition-colors">
                                {opportunity.title}
                            </motion.h3>
                        </div>

                        <motion.p layout="position" className="text-surface-300 leading-relaxed text-[15px]">
                            {opportunity.problemStatement}
                        </motion.p>

                        <div className="flex flex-wrap items-center gap-3 pt-1">
                            <div className="flex items-center gap-2 pr-3 border-r border-surface-800">
                                <Users className="h-4 w-4 text-surface-500" />
                                <div className="flex -space-x-2">
                                    {linkedPersonas.map((persona) => (
                                        <Link
                                            key={persona.id}
                                            href={`/personas/${persona.id}`}
                                            title={persona.name}
                                            className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-surface-900 bg-surface-800 text-xs shadow-md transition-transform hover:scale-110 hover:z-10"
                                        >
                                            {persona.emoji}
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-1.5">
                                <Zap className="h-3.5 w-3.5 text-surface-500" />
                                {linkedTrends.slice(0, 3).map((trend) => (
                                    <Link
                                        key={trend.id}
                                        href={`/behaviors?trendId=${trend.id}`}
                                        className="text-[9px] font-bold text-surface-400 uppercase tracking-widest hover:text-primary-400 hover:border-primary-500/30 transition-all whitespace-nowrap bg-surface-800/30 px-2 py-0.5 rounded-md border border-surface-700/30"
                                    >
                                        #{trend.title.split(' ').join('')}
                                    </Link>
                                ))}
                                {linkedTrends.length > 3 && (
                                    <span className="text-[10px] font-bold text-surface-500 uppercase tracking-tight">+{linkedTrends.length - 3}</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right: Key Stats */}
                    <div className="lg:col-span-4 flex flex-col gap-3">
                        <div className="flex items-center justify-between rounded-xl bg-pulse-500/10 border border-pulse-500/20 p-3.5 transition-all hover:bg-pulse-500/15 group/stat">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pulse-500/20 text-pulse-400">
                                    <MessageSquare className="h-5 w-5" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xl font-bold text-white leading-none">
                                        {formatNumber(timeStats.mentions)}
                                    </span>
                                    <span className="text-xs text-pulse-400/80 font-medium">Mentions</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3.5 transition-all hover:bg-emerald-500/15 group/stat">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
                                    <TrendingUp className="h-5 w-5" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xl font-bold text-white leading-none">
                                        {formatGrowth(timeStats.growth)}
                                    </span>
                                    <span className="text-xs text-emerald-400/80 font-medium">Growth</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Expand Button */}
                <div className="mt-5 flex items-center gap-4">
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-surface-800/50 py-3 text-sm font-semibold text-surface-300 transition-all hover:bg-surface-700/70 hover:text-white border border-surface-700/50 active:scale-[0.98]"
                    >
                        {isExpanded ? 'Hide detailed insights' : 'View detailed evidence & roadmap'}
                        <ChevronDown className={cn(
                            'h-4 w-4 transition-all duration-500 ease-out',
                            isExpanded ? 'rotate-180 text-primary-400' : 'text-surface-500'
                        )} />
                    </button>
                </div>
            </div>

            {/* Expanded Content */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                        className="overflow-hidden bg-surface-950/40 border-t border-surface-800/50"
                    >
                        <div className="p-8 space-y-8">
                            {/* Grid Highlights */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Why Now */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-primary-400">
                                        <Calendar className="h-4 w-4" />
                                        <h4 className="text-xs font-bold uppercase tracking-widest">Market Urgency</h4>
                                    </div>
                                    <p className="text-[14px] text-surface-300 leading-relaxed bg-surface-800/20 p-4 rounded-xl border border-surface-800/50">
                                        {opportunity.whyNow}
                                    </p>
                                </div>

                                {/* Potential Directions */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-accent-400">
                                        <BarChart3 className="h-4 w-4" />
                                        <h4 className="text-xs font-bold uppercase tracking-widest">Product Roadmap</h4>
                                    </div>
                                    <ul className="space-y-2.5">
                                        {opportunity.potentialDirections.map((direction, i) => (
                                            <li key={i} className="flex items-start gap-3 group/item">
                                                <div className="mt-1.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-accent-500/10 text-accent-400 group-hover/item:bg-accent-500/20 transition-colors">
                                                    <span className="text-[10px] font-bold">{i + 1}</span>
                                                </div>
                                                <span className="text-sm text-surface-400 group-hover/item:text-surface-200 transition-colors">{direction}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Evidence */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-pulse-400">
                                    <Zap className="h-4 w-4" />
                                    <h4 className="text-xs font-bold uppercase tracking-widest">Behavioral Evidence</h4>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {opportunity.evidenceSnippets.map((snippet, i) => {
                                        const SnippetWrapper = snippet.url ? 'a' : 'div'
                                        const wrapperProps = snippet.url ? {
                                            href: snippet.url,
                                            target: '_blank',
                                            rel: 'noopener noreferrer',
                                            className: "block relative p-5 rounded-2xl bg-surface-800/20 border border-surface-800/50 hover:border-pulse-500/30 hover:bg-surface-800/40 transition-all group/quote"
                                        } : {
                                            className: "p-5 rounded-2xl bg-surface-800/20 border border-surface-800/50"
                                        }

                                        return (
                                            <SnippetWrapper key={i} {...(wrapperProps as any)}>
                                                <div className="flex h-full flex-col justify-between gap-4">
                                                    <div className="flex justify-between gap-4">
                                                        <p className="text-sm text-surface-200 italic leading-relaxed font-medium">
                                                            &ldquo;{snippet.text}&rdquo;
                                                        </p>
                                                        {snippet.url && (
                                                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface-800/50 text-surface-500 transition-all group-hover/quote:bg-pulse-500/20 group-hover/quote:text-pulse-400">
                                                                <ExternalLink className="h-3.5 w-3.5" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="h-px flex-1 bg-surface-800/50" />
                                                        <span className="text-[10px] font-bold uppercase tracking-widest text-surface-500">
                                                            via {snippet.source}
                                                        </span>
                                                    </div>
                                                </div>
                                            </SnippetWrapper>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Internal Notes */}
                            <div className="pt-4 border-t border-surface-800/50 flex flex-col md:flex-row gap-6 items-start">
                                <div className="flex-1 w-full space-y-3">
                                    <div className="flex items-center gap-2 font-semibold text-surface-400 text-sm">
                                        <MessageSquare className="h-4 w-4" />
                                        Internal Strategizing
                                    </div>
                                    <textarea
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        placeholder="Add strategic notes or research findings..."
                                        className="w-full rounded-2xl border border-surface-800 bg-surface-900/50 p-4 text-sm text-white placeholder-surface-600 focus:border-primary-500/50 focus:bg-surface-900 focus:outline-none focus:ring-4 focus:ring-primary-500/5 transition-all outline-none resize-none"
                                        rows={3}
                                    />
                                </div>

                                <div className="w-full md:w-64 space-y-3">
                                    <div className="flex items-center gap-2 font-semibold text-surface-400 text-sm">
                                        <CheckCircle2 className="h-4 w-4" />
                                        Project Status
                                    </div>
                                    <div className="relative group/select">
                                        <select
                                            value={opportunity.status}
                                            onChange={(e) => onStatusChange?.(opportunity.id, e.target.value as OpportunityCardType['status'])}
                                            className="w-full appearance-none rounded-2xl border border-surface-800 bg-surface-900/50 px-5 py-3 text-sm font-medium text-white focus:border-primary-500/50 focus:outline-none transition-all cursor-pointer"
                                        >
                                            <option value="new">New Entry</option>
                                            <option value="reviewed">Under Review</option>
                                            <option value="in_discovery">Discovery Phase</option>
                                            <option value="not_relevant">Discarded</option>
                                        </select>
                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-500 pointer-events-none group-hover/select:text-surface-300 transition-colors" />
                                    </div>
                                    <p className="text-[11px] text-surface-500 italic px-1">
                                        Last updated 1 day ago
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.article>
    )
}
