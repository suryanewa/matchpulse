'use client'

import { useState, useEffect } from 'react'
import { PersonaCard } from '@/components/PersonaCard'
import { StaggerContainer, StaggerItem } from '@/components/ui/MotionPrimitives'
import { Loader2 } from 'lucide-react'
import { Persona } from '@/types'

interface ApiPersona {
    id: string
    name: string
    tagline: string
    description: string
    emoji: string
    color: string
    linkedClusterCount: number
    linkedOpportunityCount: number
    topBehaviors: Array<{
        id: string
        title: string
        growthScore: number
        confidence: number
    }>
    motivations: string[]
    fears: string[]
    datingGoals: string[]
    typicalBehaviors: string[]
    painPoints: string[]
}

function transformToPersona(api: ApiPersona): Persona {
    return {
        id: api.id,
        name: api.name,
        emoji: api.emoji,
        tagline: api.tagline,
        description: api.description,
        color: api.color,
        linkedTrendCount: api.linkedClusterCount,
        linkedOpportunityCount: api.linkedOpportunityCount,
        topBehaviors: api.topBehaviors?.map(b => b.title) || [],
        motivations: api.motivations || [],
        fears: api.fears || [],
        datingGoals: api.datingGoals || [],
        typicalBehaviors: api.typicalBehaviors || [],
        painPoints: api.painPoints || []
    }
}

export default function PersonasPage() {
    const [personas, setPersonas] = useState<Persona[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchPersonas() {
            try {
                const res = await fetch('/api/personas')
                const data = await res.json()

                if (data.success && data.data) {
                    const transformed = data.data.map(transformToPersona)
                    setPersonas(transformed)
                } else {
                    setError(data.error || 'Failed to fetch personas')
                }
            } catch (err) {
                setError('Failed to connect to API')
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchPersonas()
    }, [])

    const totalLinks = personas.reduce((acc, p) => acc + p.linkedTrendCount, 0)
    const totalOpps = personas.reduce((acc, p) => acc + p.linkedOpportunityCount, 0)

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
                    <div className="mt-1 text-3xl font-bold text-emerald-400">{totalLinks}</div>
                </div>
                <div className="rounded-xl border border-surface-800 bg-surface-900/50 p-4">
                    <span className="text-sm text-surface-500">Active Opportunities</span>
                    <div className="mt-1 text-3xl font-bold text-amber-400">{totalOpps}</div>
                </div>
                <div className="rounded-xl border border-surface-800 bg-surface-900/50 p-4">
                    <span className="text-sm text-surface-500">Quiz Completions</span>
                    <div className="mt-1 text-3xl font-bold text-pulse-400">0</div>
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-pulse-500" />
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-center">
                    <p className="text-red-300">{error}</p>
                </div>
            )}

            {/* Persona Grid */}
            {!loading && !error && (
                <div>
                    <h2 className="mb-4 text-lg font-semibold text-white">All Personas</h2>
                    <StaggerContainer className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {personas.map(persona => (
                            <StaggerItem key={persona.id}>
                                <PersonaCard persona={persona} />
                            </StaggerItem>
                        ))}
                    </StaggerContainer>
                </div>
            )}
        </div>
    )
}
