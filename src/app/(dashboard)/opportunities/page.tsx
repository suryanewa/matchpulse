'use client'

import { useState, useMemo } from 'react'
import { opportunityCards, personas } from '@/data/mock-data'
import { OpportunityCard } from '@/components/OpportunityCard'
import { OpportunityCard as OpportunityType, OpportunityStatus, OpportunitySeverity } from '@/types'
import { cn } from '@/lib/utils'
import { Filter, LayoutGrid, List } from 'lucide-react'
import { StaggerContainer, StaggerItem } from '@/components/ui/MotionPrimitives'

type ViewMode = 'grid' | 'list'

export default function OpportunitiesPage() {
    const [viewMode, setViewMode] = useState<ViewMode>('list')
    const [statusFilter, setStatusFilter] = useState<OpportunityStatus | 'all'>('all')
    const [severityFilter, setSeverityFilter] = useState<OpportunitySeverity | 'all'>('all')
    const [personaFilter, setPersonaFilter] = useState<string>('all')

    const filteredOpportunities = useMemo(() => {
        return opportunityCards.filter(opp => {
            if (statusFilter !== 'all' && opp.status !== statusFilter) return false
            if (severityFilter !== 'all' && opp.severity !== severityFilter) return false
            if (personaFilter !== 'all' && !opp.personaIds.includes(personaFilter)) return false
            return true
        })
    }, [statusFilter, severityFilter, personaFilter])

    const statusCounts = useMemo(() => {
        return {
            all: opportunityCards.length,
            new: opportunityCards.filter(o => o.status === 'new').length,
            reviewed: opportunityCards.filter(o => o.status === 'reviewed').length,
            in_discovery: opportunityCards.filter(o => o.status === 'in_discovery').length,
            not_relevant: opportunityCards.filter(o => o.status === 'not_relevant').length,
        }
    }, [])

    const handleStatusChange = (id: string, newStatus: OpportunityStatus) => {
        console.log('Status change not implemented for mock data', id, newStatus)
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Product Opportunities</h1>
                    <p className="mt-1 text-surface-400">
                        AI-generated product ideas based on cultural trends and personas
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={cn(
                            'flex h-9 w-9 items-center justify-center rounded-lg border transition-colors',
                            viewMode === 'grid'
                                ? 'border-pulse-500/50 bg-pulse-500/10 text-pulse-400'
                                : 'border-surface-700 text-surface-400 hover:bg-surface-800 hover:text-white'
                        )}
                    >
                        <LayoutGrid className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={cn(
                            'flex h-9 w-9 items-center justify-center rounded-lg border transition-colors',
                            viewMode === 'list'
                                ? 'border-pulse-500/50 bg-pulse-500/10 text-pulse-400'
                                : 'border-surface-700 text-surface-400 hover:bg-surface-800 hover:text-white'
                        )}
                    >
                        <List className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* Status Tabs */}
            <div className="flex gap-1 rounded-lg bg-surface-900 p-1">
                {(['all', 'new', 'reviewed', 'in_discovery', 'not_relevant'] as const).map((status) => (
                    <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={cn(
                            'flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors',
                            statusFilter === status
                                ? 'bg-surface-800 text-white'
                                : 'text-surface-400 hover:text-white'
                        )}
                    >
                        {status === 'all' ? 'All' : status.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}
                        <span className={cn(
                            'rounded-full px-2 py-0.5 text-xs',
                            statusFilter === status ? 'bg-surface-700' : 'bg-surface-800'
                        )}>
                            {statusCounts[status]}
                        </span>
                    </button>
                ))}
            </div>

            {/* Filters Bar */}
            <div className="flex flex-wrap items-center gap-4 rounded-xl border border-surface-800 bg-surface-900/50 p-4">
                <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-surface-500" />
                    <span className="text-sm text-surface-500">Filters:</span>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-sm text-surface-400">Severity:</span>
                    <select
                        value={severityFilter}
                        onChange={(e) => setSeverityFilter(e.target.value as OpportunitySeverity | 'all')}
                        className="rounded-lg border border-surface-700 bg-surface-800 px-3 py-1.5 text-sm text-white focus:border-pulse-500 focus:outline-none"
                    >
                        <option value="all">All</option>
                        <option value="critical">Critical</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                    </select>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-sm text-surface-400">Persona:</span>
                    <select
                        value={personaFilter}
                        onChange={(e) => setPersonaFilter(e.target.value)}
                        className="rounded-lg border border-surface-700 bg-surface-800 px-3 py-1.5 text-sm text-white focus:border-pulse-500 focus:outline-none"
                    >
                        <option value="all">All Personas</option>
                        {personas.map((p) => (
                            <option key={p.id} value={p.id}>{p.emoji} {p.name}</option>
                        ))}
                    </select>
                </div>

                {(statusFilter !== 'all' || severityFilter !== 'all' || personaFilter !== 'all') && (
                    <button
                        onClick={() => {
                            setStatusFilter('all')
                            setSeverityFilter('all')
                            setPersonaFilter('all')
                        }}
                        className="ml-auto text-sm text-pulse-400 hover:text-pulse-300"
                    >
                        Clear filters
                    </button>
                )}
            </div>

            {/* Results Count */}
            <div className="text-sm text-surface-400">
                Showing <span className="font-medium text-white">{filteredOpportunities.length}</span> opportunities
            </div>

            {/* Opportunities List/Grid */}
            <StaggerContainer className={cn(
                'grid gap-6',
                viewMode === 'grid' ? 'md:grid-cols-2' : 'grid-cols-1'
            )}>
                {filteredOpportunities.map(opportunity => (
                    <StaggerItem key={opportunity.id}>
                        <OpportunityCard
                            opportunity={opportunity}
                            onStatusChange={handleStatusChange}
                        />
                    </StaggerItem>
                ))}
            </StaggerContainer>
            {/* Empty State */}
            {filteredOpportunities.length === 0 && (
                <div className="flex flex-col items-center justify-center rounded-xl border border-surface-800 bg-surface-900/50 py-16">
                    <div className="text-4xl">🔍</div>
                    <h3 className="mt-4 text-lg font-semibold text-white">No opportunities found</h3>
                    <p className="mt-1 text-surface-400">Try adjusting your filters</p>
                </div>
            )}
        </div>
    )
}
