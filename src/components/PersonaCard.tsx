'use client'

import { Persona } from '@/types'
import { cn } from '@/lib/utils'
import { ArrowRight, TrendingUp, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { HoverCard } from '@/components/ui/MotionPrimitives'

interface PersonaCardProps {
    persona: Persona
}

export function PersonaCard({ persona }: PersonaCardProps) {
    return (
        <Link href={`/personas/${persona.id}`}>
            <HoverCard
                className={cn(
                    'group relative overflow-hidden rounded-xl border border-surface-800 bg-surface-900/50 p-6 transition-all duration-300',
                    'hover:border-surface-700 hover:bg-surface-900'
                )}
            >
                {/* Gradient accent with float animation */}
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, 0]
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className={cn(
                        'absolute -right-12 -top-12 h-32 w-32 rounded-full opacity-20 blur-2xl transition-opacity group-hover:opacity-30',
                        `bg-gradient-to-br ${persona.gradient}`
                    )}
                />

                {/* Header */}
                <div className="relative mb-4 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <motion.div
                            whileHover={{ scale: 1.05, rotate: 5 }}
                            className={cn(
                                'flex h-14 w-14 items-center justify-center rounded-xl text-3xl shadow-lg',
                                `bg-gradient-to-br ${persona.gradient}`
                            )}
                        >
                            {persona.emoji}
                        </motion.div>
                        <div>
                            <h3 className="text-lg font-semibold text-white group-hover:text-pulse-300 transition-colors">
                                {persona.name}
                            </h3>
                            <p className="text-sm text-surface-400">
                                {persona.tagline}
                            </p>
                        </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-surface-600 transition-all group-hover:translate-x-1 group-hover:text-pulse-400" />
                </div>

                {/* Description */}
                <p className="mb-4 text-sm text-surface-400 line-clamp-2">
                    {persona.description}
                </p>

                {/* Stats */}
                <div className="mb-4 flex gap-4">
                    <div className="flex items-center gap-1.5 text-sm">
                        <TrendingUp className="h-4 w-4 text-emerald-400" />
                        <span className="font-semibold text-white">{persona.linkedTrendCount}</span>
                        <span className="text-surface-500">trends</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm">
                        <AlertCircle className="h-4 w-4 text-amber-400" />
                        <span className="font-semibold text-white">{persona.linkedOpportunityCount}</span>
                        <span className="text-surface-500">opportunities</span>
                    </div>
                </div>

                {/* Pain Points */}
                <div className="border-t border-surface-800 pt-4">
                    <span className="text-xs font-medium text-surface-500">Top Pain Points:</span>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                        {persona.painPoints.slice(0, 3).map((point) => (
                            <span
                                key={point}
                                className="rounded-full bg-surface-800 px-2 py-0.5 text-xs text-surface-300"
                            >
                                {point}
                            </span>
                        ))}
                    </div>
                </div>
            </HoverCard>
        </Link>
    )
}
