'use client'

import { useState } from 'react'
import { PersonaCard } from '@/components/PersonaCard'
import { personas } from '@/data/mock-data'
import { motion } from 'framer-motion'
import { Users, Search } from 'lucide-react'

export default function PersonasPage() {
    const [searchQuery, setSearchQuery] = useState('')

    const filteredPersonas = personas.filter(persona =>
        persona.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        persona.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        persona.description.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-white flex items-center gap-2">
                        <Users className="h-6 w-6 text-primary-500" />
                        Dating Personas
                    </h1>
                    <p className="mt-1 text-sm text-surface-400">
                        Explore different dating personality archetypes
                    </p>
                </div>
                <span className="text-sm text-surface-400">
                    {filteredPersonas.length} personas
                </span>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-500" />
                <input
                    type="text"
                    placeholder="Search personas..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-surface-800 border border-surface-700 rounded-lg text-white placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                />
            </div>

            {/* Persona Cards Grid */}
            <motion.div
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                {filteredPersonas.map((persona, index) => (
                    <motion.div
                        key={persona.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.08 }}
                    >
                        <PersonaCard persona={persona} />
                    </motion.div>
                ))}
            </motion.div>

            {filteredPersonas.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-surface-400">No personas found matching your search.</p>
                </div>
            )}
        </div>
    )
}
