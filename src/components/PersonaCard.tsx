'use client'

import { Persona } from '@/types'
import { cn } from '@/lib/utils'
import { TrendingUp, Lightbulb, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface PersonaCardProps {
    persona: Persona
}

// Map persona names to specific gradient colors for consistent emoji backgrounds
const getEmojiGradient = (personaName: string): string => {
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

export function PersonaCard({ persona }: PersonaCardProps) {
    const emojiGradient = getEmojiGradient(persona.name)

    return (
        <Link href={`/personas/${persona.id}`}>
            <motion.div
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                className="group relative h-full cursor-pointer overflow-hidden rounded-3xl bg-[#1a1a1a] p-5 shadow-lg transition-all hover:bg-[#222] hover:shadow-xl hover:shadow-black/50 flex flex-col"
            >
                {/* Header Row */}
                <div className="mb-4 flex items-start justify-between">
                    {/* Emoji with Gradient Background */}
                    <div className={cn(
                        'flex h-14 w-14 items-center justify-center rounded-2xl text-3xl shadow-inner',
                        `bg-gradient-to-br ${emojiGradient}`
                    )}>
                        {persona.emoji}
                    </div>

                    <div className="rounded-full bg-[#2a2a2a] px-3 py-1 text-xs font-medium text-gray-400">
                        {persona.painPoints.length} pain points
                    </div>
                </div>

                {/* Title & Tagline */}
                <div className="mb-4">
                    <h3 className="mb-1 text-xl font-bold text-white group-hover:text-[#FE3C72] transition-colors">
                        {persona.name}
                    </h3>
                    <p className="text-sm font-medium text-gray-500">
                        {persona.tagline}
                    </p>
                </div>

                {/* Full Description */}
                <p className="mb-6 text-sm text-gray-400 leading-relaxed flex-grow">
                    {persona.description}
                </p>

                {/* Footer Stats */}
                <div className="flex items-center gap-4 border-t border-[#2a2a2a] pt-4 mt-auto">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-[#FE3C72]" />
                        <span className="text-sm font-bold text-white">{persona.linkedTrendCount}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Lightbulb className="h-4 w-4 text-amber-500" />
                        <span className="text-sm font-bold text-white">{persona.linkedOpportunityCount}</span>
                    </div>
                    <div className="ml-auto">
                        <ArrowRight className="h-5 w-5 text-gray-600 transition-transform group-hover:translate-x-1 group-hover:text-white" />
                    </div>
                </div>
            </motion.div>
        </Link>
    )
}
