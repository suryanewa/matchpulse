'use client'

import { personas } from '@/data/mock-data'
import { PersonaCard } from '@/components/PersonaCard'
import { Users, TrendingUp, AlertCircle } from 'lucide-react'
import { StaggerContainer, StaggerItem } from '@/components/ui/MotionPrimitives'

export default function PersonasPage() {
    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Personas & Pain Points</h1>
                    <p className="mt-1 text-surface-400">
                        Dating archetypes with their common behaviors and challenges
                    </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-surface-400">
                    <span className="font-medium text-white">{personas.length}</span> personas defined
                </div>
            </div>

            {/* Overview Stats */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border border-surface-800 bg-surface-900/50 p-4">
                    <span className="text-sm text-surface-500">Total Personas</span>
                    <div className="mt-1 text-3xl font-bold text-white">{personas.length}</div>
                </div>
                <div className="rounded-xl border border-surface-800 bg-surface-900/50 p-4">
                    <span className="text-sm text-surface-500">Linked Trends</span>
                    <div className="mt-1 text-3xl font-bold text-emerald-400">
                        {personas.reduce((acc, p) => acc + p.linkedTrendCount, 0)}
                    </div>
                </div>
                <div className="rounded-xl border border-surface-800 bg-surface-900/50 p-4">
                    <span className="text-sm text-surface-500">Active Opportunities</span>
                    <div className="mt-1 text-3xl font-bold text-amber-400">
                        {personas.reduce((acc, p) => acc + p.linkedOpportunityCount, 0)}
                    </div>
                </div>
                <div className="rounded-xl border border-surface-800 bg-surface-900/50 p-4">
                    <span className="text-sm text-surface-500">Quiz Completions</span>
                    <div className="mt-1 text-3xl font-bold text-pulse-400">1,247</div>
                </div>
            </div>

            {/* Persona Grid */}
            <div>
                <h2 className="mb-4 text-lg font-semibold text-white">All Personas</h2>
                {/* Personas Grid */}
                <StaggerContainer className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {personas.map(persona => (
                        <StaggerItem key={persona.id}>
                            <PersonaCard persona={persona} />
                        </StaggerItem>
                    ))}
                </StaggerContainer>
            </div>
        </div>
    )
}
