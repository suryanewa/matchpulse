'use client'

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPersonaById, getTrendsForPersona, getOpportunitiesForPersona } from '@/data/mock-data'
import { Chip } from '@/components/ui/Chip'
import { Sparkline } from '@/components/ui/Sparkline'
import { cn, formatNumber, formatGrowth, getSeverityColor, getStatusColor } from '@/lib/utils'
import {
    ArrowLeft,
    TrendingUp,
    Heart,
    AlertTriangle,
    Target,
    MessageSquareQuote,
    Lightbulb,
    ExternalLink
} from 'lucide-react'

interface PersonaDetailPageProps {
    params: { id: string }
}

export default function PersonaDetailPage({ params }: PersonaDetailPageProps) {
    const { id } = params
    const persona = getPersonaById(id)

    if (!persona) {
        notFound()
    }

    const linkedTrends = getTrendsForPersona(id)
    const linkedOpportunities = getOpportunitiesForPersona(id)

    return (
        <div className="space-y-8">
            {/* Back Link */}
            <Link
                href="/personas"
                className="inline-flex items-center gap-2 text-sm text-surface-400 transition-colors hover:text-white"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to Personas
            </Link>

            {/* Header */}
            <div className="relative overflow-hidden rounded-2xl border border-surface-800 bg-surface-900/50 p-8">
                {/* Background gradient */}
                <div
                    className={cn(
                        'absolute -right-20 -top-20 h-64 w-64 rounded-full opacity-20 blur-3xl',
                        `bg-gradient-to-br ${persona.gradient}`
                    )}
                />
                <div
                    className={cn(
                        'absolute -bottom-20 -left-20 h-64 w-64 rounded-full opacity-10 blur-3xl',
                        `bg-gradient-to-br ${persona.gradient}`
                    )}
                />

                <div className="relative flex items-start gap-6">
                    <div
                        className={cn(
                            'flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl text-5xl shadow-lg',
                            `bg-gradient-to-br ${persona.gradient}`
                        )}
                    >
                        {persona.emoji}
                    </div>
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-white">{persona.name}</h1>
                        <p className="mt-1 text-lg text-surface-400">{persona.tagline}</p>
                        <p className="mt-4 max-w-2xl text-surface-300">{persona.description}</p>

                        {/* Quick stats */}
                        <div className="mt-6 flex gap-6">
                            <div className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-emerald-400" />
                                <span className="font-semibold text-white">{persona.linkedTrendCount}</span>
                                <span className="text-surface-500">linked trends</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Lightbulb className="h-5 w-5 text-amber-400" />
                                <span className="font-semibold text-white">{persona.linkedOpportunityCount}</span>
                                <span className="text-surface-500">opportunities</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid gap-8 lg:grid-cols-3">
                {/* Left Column - Profile Info */}
                <div className="space-y-6 lg:col-span-1">
                    {/* Motivations */}
                    <div className="rounded-xl border border-surface-800 bg-surface-900/50 p-5">
                        <div className="mb-4 flex items-center gap-2">
                            <Heart className="h-5 w-5 text-pulse-400" />
                            <h2 className="font-semibold text-white">Motivations</h2>
                        </div>
                        <ul className="space-y-2">
                            {persona.motivations.map((motivation, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-surface-300">
                                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-pulse-400" />
                                    {motivation}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Fears */}
                    <div className="rounded-xl border border-surface-800 bg-surface-900/50 p-5">
                        <div className="mb-4 flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-amber-400" />
                            <h2 className="font-semibold text-white">Fears</h2>
                        </div>
                        <ul className="space-y-2">
                            {persona.fears.map((fear, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-surface-300">
                                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                                    {fear}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Dating Goals */}
                    <div className="rounded-xl border border-surface-800 bg-surface-900/50 p-5">
                        <div className="mb-4 flex items-center gap-2">
                            <Target className="h-5 w-5 text-emerald-400" />
                            <h2 className="font-semibold text-white">Dating Goals</h2>
                        </div>
                        <ul className="space-y-2">
                            {persona.datingGoals.map((goal, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-surface-300">
                                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                                    {goal}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Pain Points */}
                    <div className="rounded-xl border border-surface-800 bg-surface-900/50 p-5">
                        <div className="mb-4 flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-rose-400" />
                            <h2 className="font-semibold text-white">Pain Points</h2>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {persona.painPoints.map((point) => (
                                <Chip key={point} variant="danger" size="md">
                                    {point}
                                </Chip>
                            ))}
                        </div>
                    </div>

                    {/* Communication Style */}
                    <div className="rounded-xl border border-surface-800 bg-surface-900/50 p-5">
                        <h2 className="mb-3 font-semibold text-white">Communication Style</h2>
                        <p className="text-sm text-surface-300">{persona.communicationStyle}</p>
                    </div>
                </div>

                {/* Right Column - Trends, Quotes, Opportunities */}
                <div className="space-y-6 lg:col-span-2">
                    {/* Linked Behaviors */}
                    <div className="rounded-xl border border-surface-800 bg-surface-900/50 p-5">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="font-semibold text-white">Linked Behaviors</h2>
                            <span className="text-sm text-surface-500">{linkedTrends.length} trends</span>
                        </div>
                        <div className="space-y-3">
                            {linkedTrends.slice(0, 5).map((trend) => {
                                const link = trend.linkedPersonas.find(lp => lp.personaId === id)
                                const confidence = link?.confidence || 0
                                return (
                                    <Link
                                        key={trend.id}
                                        href={`/behaviors?trendId=${trend.id}`}
                                        className="flex items-center justify-between rounded-lg border border-surface-800 bg-surface-900 p-4 transition-colors hover:border-surface-700"
                                    >
                                        <div className="flex-1">
                                            <div className="font-medium text-white">{trend.title}</div>
                                            <div className="mt-1 flex items-center gap-3 text-sm text-surface-500">
                                                <span>{formatNumber(trend.mentionCount)} mentions</span>
                                                <span className={trend.growthRate > 0 ? 'text-emerald-400' : 'text-rose-400'}>
                                                    {formatGrowth(trend.growthRate)}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="ml-4 flex items-center gap-3">
                                            <div className="h-8 w-24">
                                                <Sparkline
                                                    data={trend.sparklineData}
                                                    color={trend.growthRate > 0 ? '#10b981' : '#ef4444'}
                                                    height={32}
                                                />
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm font-semibold text-white">
                                                    {(confidence * 100).toFixed(0)}%
                                                </div>
                                                <div className="text-xs text-surface-500">match</div>
                                            </div>
                                            <ExternalLink className="h-4 w-4 text-surface-500" />
                                        </div>
                                    </Link>
                                )
                            })}
                        </div>
                    </div>

                    {/* Representative Quotes */}
                    <div className="rounded-xl border border-surface-800 bg-surface-900/50 p-5">
                        <div className="mb-4 flex items-center gap-2">
                            <MessageSquareQuote className="h-5 w-5 text-accent-400" />
                            <h2 className="font-semibold text-white">Representative Quotes</h2>
                        </div>
                        <div className="space-y-3">
                            {persona.quotes.map((quote, i) => {
                                const QuoteWrapper = quote.url ? 'a' : 'div'
                                const wrapperProps = quote.url ? {
                                    href: quote.url,
                                    target: '_blank',
                                    rel: 'noopener noreferrer',
                                    className: "block rounded-lg border border-surface-800 bg-surface-900 p-4 transition-all hover:border-surface-600 hover:bg-surface-800/80 group"
                                } : {
                                    className: "rounded-lg border border-surface-800 bg-surface-900 p-4"
                                }

                                return (
                                    <QuoteWrapper key={i} {...(wrapperProps as any)}>
                                        <div className="flex justify-between gap-2">
                                            <p className="text-surface-200 italic flex-1">&ldquo;{quote.text}&rdquo;</p>
                                            {quote.url && (
                                                <ExternalLink className="h-3.5 w-3.5 shrink-0 text-surface-500 transition-colors group-hover:text-pulse-400" />
                                            )}
                                        </div>
                                        <div className="mt-2 text-xs text-surface-500">via {quote.source}</div>
                                    </QuoteWrapper>
                                )
                            })}
                        </div>
                    </div>

                    {/* Opportunities */}
                    <div className="rounded-xl border border-surface-800 bg-surface-900/50 p-5">
                        <div className="mb-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Lightbulb className="h-5 w-5 text-amber-400" />
                                <h2 className="font-semibold text-white">Product Opportunities</h2>
                            </div>
                            <Link
                                href="/opportunities"
                                className="text-sm text-pulse-400 hover:text-pulse-300"
                            >
                                View all →
                            </Link>
                        </div>
                        <div className="space-y-3">
                            {linkedOpportunities.slice(0, 3).map((opp) => (
                                <div
                                    key={opp.id}
                                    className="rounded-lg border border-surface-800 bg-surface-900 p-4"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="font-medium text-white">{opp.title}</div>
                                            <p className="mt-1 text-sm text-surface-400 line-clamp-2">
                                                {opp.problemStatement}
                                            </p>
                                        </div>
                                        <div className="ml-4 flex gap-2">
                                            <Chip className={getSeverityColor(opp.severity)} size="sm">
                                                {opp.severity}
                                            </Chip>
                                            <Chip className={getStatusColor(opp.status)} size="sm">
                                                {opp.status.replace('_', ' ')}
                                            </Chip>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
