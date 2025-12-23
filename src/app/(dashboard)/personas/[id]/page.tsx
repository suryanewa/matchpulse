'use client'

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPersonaById, getTrendsForPersona, getOpportunitiesForPersona } from '@/data/mock-data'
import { Sparkline } from '@/components/ui/Sparkline'
import { cn, formatNumber, formatGrowth } from '@/lib/utils'
import {
    ArrowLeft,
    TrendingUp,
    Heart,
    AlertTriangle,
    Target,
    MessageSquareQuote,
    Lightbulb,
    ExternalLink,
    ArrowRight
} from 'lucide-react'

interface PersonaDetailPageProps {
    params: { id: string }
}

// Map persona names to specific gradient colors
const getPersonaGradient = (personaName: string): string => {
    const gradientMap: Record<string, string> = {
        'The Overthinker': 'from-purple-500 to-indigo-600',
        'The Slow Burner': 'from-amber-500 to-orange-500',
        'The Chaos Creative': 'from-rose-500 to-pink-500',
        'The Energy Extrovert': 'from-yellow-400 to-amber-500',
        'The Hopeful Romantic': 'from-pink-500 to-rose-500',
        'The Practical Matcher': 'from-emerald-500 to-teal-500',
    }
    return gradientMap[personaName] || 'from-gray-500 to-gray-600'
}

export default function PersonaDetailPage({ params }: PersonaDetailPageProps) {
    const { id } = params
    const persona = getPersonaById(id)

    if (!persona) {
        notFound()
    }

    const linkedTrends = getTrendsForPersona(id)
    const linkedOpportunities = getOpportunitiesForPersona(id)
    const personaGradient = getPersonaGradient(persona.name)

    return (
        <div className="space-y-6">
            {/* Back Link - Tinder style */}
            <Link
                href="/personas"
                className="inline-flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-white"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to Personas
            </Link>

            {/* Header - Tinder style card */}
            <div className="relative overflow-hidden rounded-3xl bg-[#1a1a1a] p-8">
                {/* Background gradient blobs */}
                <div
                    className={cn(
                        'absolute -right-20 -top-20 h-64 w-64 rounded-full opacity-30 blur-3xl',
                        `bg-gradient-to-br ${personaGradient}`
                    )}
                />
                <div
                    className={cn(
                        'absolute -bottom-20 -left-20 h-64 w-64 rounded-full opacity-20 blur-3xl',
                        `bg-gradient-to-br ${personaGradient}`
                    )}
                />

                <div className="relative flex items-start gap-6">
                    <div
                        className={cn(
                            'flex h-28 w-28 shrink-0 items-center justify-center rounded-3xl text-6xl shadow-xl',
                            `bg-gradient-to-br ${personaGradient}`
                        )}
                    >
                        {persona.emoji}
                    </div>
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-white">{persona.name}</h1>
                        <p className="mt-1 text-lg text-gray-400">{persona.tagline}</p>
                        <p className="mt-4 max-w-2xl text-gray-300 leading-relaxed">{persona.description}</p>

                        {/* Quick stats - Tinder style pills */}
                        <div className="mt-6 flex gap-4">
                            <div className="flex items-center gap-2 rounded-full bg-emerald-500/20 px-4 py-2">
                                <TrendingUp className="h-5 w-5 text-emerald-400" />
                                <span className="font-bold text-emerald-400">{persona.linkedTrendCount}</span>
                                <span className="text-sm text-emerald-400">linked trends</span>
                            </div>
                            <div className="flex items-center gap-2 rounded-full bg-amber-500/20 px-4 py-2">
                                <Lightbulb className="h-5 w-5 text-amber-400" />
                                <span className="font-bold text-amber-400">{persona.linkedOpportunityCount}</span>
                                <span className="text-sm text-amber-400">opportunities</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Left Column - Profile Info */}
                <div className="space-y-4 lg:col-span-1">
                    {/* Motivations - Tinder style card */}
                    <div className="rounded-2xl bg-[#1a1a1a] p-5">
                        <div className="mb-4 flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#FE3C72] to-[#FF6B6B]">
                                <Heart className="h-4 w-4 text-white" />
                            </div>
                            <h2 className="font-bold text-white">Motivations</h2>
                        </div>
                        <ul className="space-y-2">
                            {persona.motivations.map((motivation, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#FE3C72]" />
                                    {motivation}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Fears - Tinder style card */}
                    <div className="rounded-2xl bg-[#1a1a1a] p-5">
                        <div className="mb-4 flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-500">
                                <AlertTriangle className="h-4 w-4 text-white" />
                            </div>
                            <h2 className="font-bold text-white">Fears</h2>
                        </div>
                        <ul className="space-y-2">
                            {persona.fears.map((fear, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-amber-500" />
                                    {fear}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Dating Goals - Tinder style card */}
                    <div className="rounded-2xl bg-[#1a1a1a] p-5">
                        <div className="mb-4 flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500">
                                <Target className="h-4 w-4 text-white" />
                            </div>
                            <h2 className="font-bold text-white">Dating Goals</h2>
                        </div>
                        <ul className="space-y-2">
                            {persona.datingGoals.map((goal, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
                                    {goal}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Pain Points - Tinder style chips */}
                    <div className="rounded-2xl bg-[#1a1a1a] p-5">
                        <div className="mb-4 flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-rose-500 to-red-500">
                                <AlertTriangle className="h-4 w-4 text-white" />
                            </div>
                            <h2 className="font-bold text-white">Pain Points</h2>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {persona.painPoints.map((point) => (
                                <span
                                    key={point}
                                    className="rounded-lg bg-rose-500/20 px-3 py-1.5 text-sm font-medium text-rose-400"
                                >
                                    {point}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Communication Style */}
                    <div className="rounded-2xl bg-[#1a1a1a] p-5">
                        <h2 className="mb-3 font-bold text-white">Communication Style</h2>
                        <p className="text-sm text-gray-400 leading-relaxed">{persona.communicationStyle}</p>
                    </div>
                </div>

                {/* Right Column - Trends, Quotes, Opportunities */}
                <div className="space-y-4 lg:col-span-2">
                    {/* Linked Behaviors - Tinder style */}
                    <div className="rounded-2xl bg-[#1a1a1a] p-5">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="font-bold text-white">Linked Behaviors</h2>
                            <span className="text-sm text-gray-500">{linkedTrends.length} trends</span>
                        </div>
                        <div className="space-y-3">
                            {linkedTrends.slice(0, 5).map((trend) => {
                                const link = trend.linkedPersonas.find(lp => lp.personaId === id)
                                const confidence = link?.confidence || 0
                                return (
                                    <Link
                                        key={trend.id}
                                        href={`/behaviors?trendId=${trend.id}`}
                                        className="flex items-center justify-between rounded-2xl bg-[#222] p-4 transition-all hover:bg-[#2a2a2a]"
                                    >
                                        <div className="flex-1">
                                            <div className="font-semibold text-white">{trend.title}</div>
                                            <div className="mt-1 flex items-center gap-3 text-sm text-gray-500">
                                                <span>{formatNumber(trend.mentionCount)} mentions</span>
                                                <span className={trend.growthRate > 0 ? 'text-emerald-400' : 'text-rose-400'}>
                                                    {formatGrowth(trend.growthRate)}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="ml-4 flex items-center gap-4">
                                            <div className="h-10 w-28">
                                                <Sparkline
                                                    data={trend.sparklineData}
                                                    color={trend.growthRate > 0 ? '#10b981' : '#f43f5e'}
                                                    height={40}
                                                    strokeWidth={2}
                                                />
                                            </div>
                                            <div className="text-right">
                                                <div className="text-lg font-bold text-white">
                                                    {(confidence * 100).toFixed(0)}%
                                                </div>
                                                <div className="text-xs text-gray-500">match</div>
                                            </div>
                                            <ExternalLink className="h-4 w-4 text-gray-600" />
                                        </div>
                                    </Link>
                                )
                            })}
                        </div>
                    </div>

                    {/* Representative Quotes - Tinder style */}
                    <div className="rounded-2xl bg-[#1a1a1a] p-5">
                        <div className="mb-4 flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-indigo-500">
                                <MessageSquareQuote className="h-4 w-4 text-white" />
                            </div>
                            <h2 className="font-bold text-white">Representative Quotes</h2>
                        </div>
                        <div className="space-y-3">
                            {persona.quotes.map((quote, i) => {
                                const QuoteWrapper = quote.url ? 'a' : 'div'
                                const wrapperProps = quote.url ? {
                                    href: quote.url,
                                    target: '_blank',
                                    rel: 'noopener noreferrer',
                                    className: "block rounded-2xl bg-[#222] p-4 transition-all hover:bg-[#2a2a2a] group"
                                } : {
                                    className: "rounded-2xl bg-[#222] p-4"
                                }

                                return (
                                    <QuoteWrapper key={i} {...(wrapperProps as any)}>
                                        <div className="flex justify-between gap-2">
                                            <p className="text-gray-300 italic flex-1">&ldquo;{quote.text}&rdquo;</p>
                                            {quote.url && (
                                                <ExternalLink className="h-4 w-4 shrink-0 text-gray-600 transition-colors group-hover:text-[#FE3C72]" />
                                            )}
                                        </div>
                                        <div className="mt-2 text-xs text-gray-500">via {quote.source}</div>
                                    </QuoteWrapper>
                                )
                            })}
                        </div>
                    </div>

                    {/* Opportunities - Tinder style */}
                    <div className="rounded-2xl bg-[#1a1a1a] p-5">
                        <div className="mb-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-500">
                                    <Lightbulb className="h-4 w-4 text-white" />
                                </div>
                                <h2 className="font-bold text-white">Product Opportunities</h2>
                            </div>
                            <Link
                                href="/opportunities"
                                className="flex items-center gap-1 text-sm text-[#FE3C72] hover:text-[#FF6B6B]"
                            >
                                View all <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                        <div className="space-y-3">
                            {linkedOpportunities.slice(0, 3).map((opp) => (
                                <div
                                    key={opp.id}
                                    className="rounded-2xl bg-[#222] p-4"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="font-semibold text-white">{opp.title}</div>
                                            <p className="mt-1 text-sm text-gray-400 line-clamp-2">
                                                {opp.problemStatement}
                                            </p>
                                        </div>
                                        <div className="ml-4 flex gap-2">
                                            <span className={cn(
                                                'rounded-full px-3 py-1 text-xs font-bold uppercase',
                                                opp.severity === 'critical' && 'bg-rose-500 text-white',
                                                opp.severity === 'high' && 'bg-orange-500 text-white',
                                                opp.severity === 'medium' && 'bg-amber-500 text-black',
                                                opp.severity === 'low' && 'bg-gray-600 text-gray-300'
                                            )}>
                                                {opp.severity}
                                            </span>
                                            <span className={cn(
                                                'rounded-full px-3 py-1 text-xs font-bold uppercase',
                                                opp.status === 'new' && 'bg-[#FE3C72] text-white',
                                                opp.status === 'reviewed' && 'bg-emerald-500 text-white',
                                                opp.status === 'in_discovery' && 'bg-purple-500 text-white',
                                                opp.status === 'not_relevant' && 'bg-gray-600 text-gray-300'
                                            )}>
                                                {opp.status.replace('_', ' ')}
                                            </span>
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
