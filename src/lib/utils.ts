import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

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

export function getSeverityColor(severity: string): string {
    switch (severity) {
        case 'critical': return 'bg-rose-500/20 text-rose-400 border-rose-500/30'
        case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
        case 'medium': return 'bg-amber-500/20 text-amber-400 border-amber-500/30'
        case 'low': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
        default: return 'bg-surface-700 text-surface-300 border-surface-600'
    }
}

export function getStatusColor(status: string): string {
    switch (status) {
        case 'new': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
        case 'reviewed': return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
        case 'in_discovery': return 'bg-amber-500/20 text-amber-400 border-amber-500/30'
        case 'not_relevant': return 'bg-surface-700 text-surface-400 border-surface-600'
        default: return 'bg-surface-700 text-surface-300 border-surface-600'
    }
}
