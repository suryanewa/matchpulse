'use client'

import { useState } from 'react'
import { PersonaCard } from '@/components/PersonaCard'
import { personas } from '@/data/mock-data'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'

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
                    <h1 className="text-2xl font-bold text-white">
                        Dating Personas
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Explore different dating personality archetypes
                    </p>
                </div>
                <span className="rounded-full bg-[#1a1a1a] px-3 py-1.5 text-xs font-medium text-gray-400">
                    {filteredPersonas.length} archetypes
                </span>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                    type="text"
                    placeholder="Search personas..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#1a1a1a] border-0 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FE3C72]/50"
                />
            </div>

            {/* Persona Cards Grid - 3x3 */}
            <motion.div
                className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                {filteredPersonas.map((persona, index) => (
                    <motion.div
                        key={persona.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <PersonaCard persona={persona} />
                    </motion.div>
                ))}
            </motion.div>

            {filteredPersonas.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16">
                    <div className="mb-4 text-4xl">🔍</div>
                    <p className="text-gray-500">No personas found matching your search.</p>
                </div>
            )}
        </div>
    )
}
