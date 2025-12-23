'use client'

import { useState } from 'react'
import { OpportunityCard } from '@/components/OpportunityCard'
import { opportunityCards, personas } from '@/data/mock-data'
import { motion } from 'framer-motion'
import { Lightbulb, Filter, Search, ChevronDown } from 'lucide-react'
import { useDashboard } from '@/context/DashboardContext'

export default function OpportunitiesPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [severityFilter, setSeverityFilter] = useState<string>('all')
    const { timeFilter } = useDashboard()

    const filteredOpportunities = opportunityCards
        .filter(opp => {
            const matchesSearch =
                opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                opp.problemStatement.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesStatus = statusFilter === 'all' || opp.status === statusFilter
            const matchesSeverity = severityFilter === 'all' || opp.severity === severityFilter
            return matchesSearch && matchesStatus && matchesSeverity
        })
        .sort((a, b) => {
            // Sort by severity: critical > high > medium > low
            const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 }
            return (severityOrder[b.severity] || 0) - (severityOrder[a.severity] || 0)
        })

    // Get persona names for display
    const getPersonaName = (id: string) => {
        const persona = personas.find(p => p.id === id)
        return persona ? `${persona.emoji} ${persona.name}` : id
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">
                        Product Opportunities
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Data-driven feature ideas from behavioral signals
                    </p>
                </div>
                <span className="rounded-full bg-[#1a1a1a] px-3 py-1.5 text-xs font-medium text-gray-400">
                    {filteredOpportunities.length} opportunities
                </span>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row md:items-center gap-3">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search opportunities..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-[#1a1a1a] border-0 rounded-xl text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FE3C72]/50"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="appearance-none bg-[#1a1a1a] border-0 rounded-xl pl-4 pr-10 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#FE3C72]/50 cursor-pointer min-w-[140px]"
                        >
                            <option value="all">All Status</option>
                            <option value="new">New</option>
                            <option value="reviewed">Reviewed</option>
                            <option value="in_discovery">In Discovery</option>
                            <option value="discarded">Discarded</option>
                        </select>
                        <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                    </div>

                    <div className="relative">
                        <select
                            value={severityFilter}
                            onChange={(e) => setSeverityFilter(e.target.value)}
                            className="appearance-none bg-[#1a1a1a] border-0 rounded-xl pl-4 pr-10 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#FE3C72]/50 cursor-pointer min-w-[140px]"
                        >
                            <option value="all">All Severity</option>
                            <option value="critical">Critical</option>
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                        </select>
                        <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Opportunity Cards */}
            <motion.div
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                {filteredOpportunities.map((opportunity, index) => (
                    <motion.div
                        key={opportunity.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <OpportunityCard
                            opportunity={opportunity}
                            timeFilter={timeFilter}
                        />
                    </motion.div>
                ))}
            </motion.div>

            {filteredOpportunities.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-surface-400">No opportunities found matching your filters.</p>
                </div>
            )}
        </div>
    )
}
