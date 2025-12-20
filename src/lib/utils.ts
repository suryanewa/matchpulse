import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type React from 'react'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatNumber(num: number): string {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M'
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
}

export function formatGrowth(rate: number): string {
    const sign = rate >= 0 ? '+' : ''
    return `${sign}${rate.toFixed(0)}%`
}

export function formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }).format(date)
}

export function formatRelativeTime(date: Date): string {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
    return `${Math.floor(diffDays / 365)} years ago`
}

export function getConfidenceLabel(confidence: number): string {
    if (confidence >= 0.8) return 'High'
    if (confidence >= 0.5) return 'Medium'
    return 'Low'
}

export function getConfidenceColor(confidence: number): string {
    if (confidence >= 0.8) return 'text-emerald-400'
    if (confidence >= 0.5) return 'text-amber-400'
    return 'text-rose-400'
}

export type ChipColorResult = {
    className: string;
    style: React.CSSProperties;
}

export function getSeverityColor(severity: string): ChipColorResult {
    switch (severity) {
        case 'critical':
            return {
                className: '',
                style: { backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#f87171', borderColor: 'rgba(239, 68, 68, 0.3)' }
            }
        case 'high':
            return {
                className: '',
                style: { backgroundColor: 'rgba(249, 115, 22, 0.2)', color: '#fb923c', borderColor: 'rgba(249, 115, 22, 0.3)' }
            }
        case 'medium':
            return {
                className: '',
                style: { backgroundColor: 'rgba(234, 179, 8, 0.2)', color: '#facc15', borderColor: 'rgba(234, 179, 8, 0.3)' }
            }
        case 'low':
            return {
                className: '',
                style: { backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#34d399', borderColor: 'rgba(16, 185, 129, 0.3)' }
            }
        default:
            return {
                className: 'bg-surface-700 text-surface-300 border-surface-600',
                style: {}
            }
    }
}

export function getStatusColor(status: string): ChipColorResult {
    switch (status) {
        case 'new':
            return {
                className: '',
                style: { backgroundColor: 'rgba(14, 165, 233, 0.2)', color: '#38bdf8', borderColor: 'rgba(14, 165, 233, 0.3)' }
            }
        case 'reviewed':
            return {
                className: '',
                style: { backgroundColor: 'rgba(139, 92, 246, 0.2)', color: '#a78bfa', borderColor: 'rgba(139, 92, 246, 0.3)' }
            }
        case 'in_discovery':
            return {
                className: '',
                style: { backgroundColor: 'rgba(6, 182, 212, 0.2)', color: '#22d3ee', borderColor: 'rgba(6, 182, 212, 0.3)' }
            }
        case 'implemented':
            return {
                className: '',
                style: { backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#34d399', borderColor: 'rgba(16, 185, 129, 0.3)' }
            }
        case 'not_relevant':
            return {
                className: 'bg-surface-700 text-surface-500 border-surface-600',
                style: {}
            }
        default:
            return {
                className: 'bg-surface-700 text-surface-300 border-surface-600',
                style: {}
            }
    }
}

// Time-based stats calculation for opportunities
// Base values are for 'all' time, we scale down for shorter periods
export type TimeFilter = '24h' | '7d' | '30d' | '12m' | 'all'

export function getTimeBasedStats(
    baseMentions: number,
    baseGrowth: number,
    timeFilter: TimeFilter
): { mentions: number; growth: number } {
    // Multipliers based on realistic data distribution over time
    // Shorter time periods = fewer mentions but potentially higher growth %
    const config = {
        '24h': { mentionRatio: 0.008, growthMultiplier: 3.5 },   // ~0.8% of total, high recent volatility
        '7d': { mentionRatio: 0.05, growthMultiplier: 2.0 },    // ~5% of total
        '30d': { mentionRatio: 0.18, growthMultiplier: 1.0 },    // ~18% of total (base reference)
        '12m': { mentionRatio: 0.75, growthMultiplier: 0.4 },    // ~75% of total, smoothed growth
        'all': { mentionRatio: 1.0, growthMultiplier: 0.25 },    // 100%, most smoothed
    }

    const { mentionRatio, growthMultiplier } = config[timeFilter]

    // Calculate scaled mentions (with some randomness for realism)
    const scaledMentions = Math.round(baseMentions * mentionRatio)

    // Growth is inverted - shorter periods show more volatility
    // Also add slight variation based on mentions to make it feel dynamic
    const variationFactor = 0.9 + (baseMentions % 10) / 50 // 0.9 to 1.1
    const scaledGrowth = Math.round(baseGrowth * growthMultiplier * variationFactor)

    return {
        mentions: Math.max(scaledMentions, 1), // At least 1 mention
        growth: scaledGrowth
    }
}
