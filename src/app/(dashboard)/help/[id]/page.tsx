'use client'

import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ChevronLeft, Clock, ArrowRight, BookOpen } from 'lucide-react'
import { helpGuides } from '@/data/help-guides'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export default function GuideDetailPage() {
    const { id } = useParams()
    const router = useRouter()
    const guide = helpGuides.find(g => g.id === id)

    if (!guide) {
        return (
            <div className="flex h-[60vh] flex-col items-center justify-center text-center">
                <h1 className="text-2xl font-bold text-white mb-4">Guide not found</h1>
                <button
                    onClick={() => router.push('/help')}
                    className="text-pulse-400 hover:text-pulse-300 flex items-center gap-2"
                >
                    <ChevronLeft className="h-4 w-4" />
                    Back to Help Center
                </button>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
            {/* Header / Breadcrumb */}
            <nav className="flex items-center justify-between">
                <Link
                    href="/help"
                    className="group flex items-center gap-2 text-sm font-medium text-surface-400 transition-colors hover:text-white"
                >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-900 border border-surface-800 transition-colors group-hover:border-surface-600">
                        <ChevronLeft className="h-4 w-4" />
                    </div>
                    Back to Help Center
                </Link>
                <div className="flex items-center gap-2 text-xs font-medium text-surface-500 bg-surface-900/50 px-3 py-1.5 rounded-full border border-surface-800">
                    <Clock className="h-3 w-3" />
                    {guide.duration} read
                </div>
            </nav>

            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-2xl border border-surface-800 bg-surface-900/50 p-8 md:p-12 backdrop-blur-md">
                <div className="absolute inset-0 -z-10 bg-gradient-to-br from-pulse-500/5 to-accent-500/5" />
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative z-10 space-y-4"
                >
                    <div className={cn("inline-flex h-12 w-12 items-center justify-center rounded-xl bg-surface-950/50 border border-surface-800", guide.color)}>
                        <guide.icon className="h-6 w-6" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white">{guide.title}</h1>
                    <p className="text-lg text-surface-400 max-w-2xl">
                        {guide.description}
                    </p>
                </motion.div>
            </div>

            {/* Content Sections */}
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
                <div className="lg:col-span-3 space-y-12">
                    {guide.content.map((item, i) => (
                        <motion.section
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * i }}
                            className="space-y-4"
                        >
                            <h2 className="text-xl font-bold text-white flex items-center gap-3">
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-pulse-500/10 text-[10px] font-bold text-pulse-400 border border-pulse-500/20">
                                    0{i + 1}
                                </span>
                                {item.section}
                            </h2>
                            <p className="text-surface-400 leading-relaxed text-lg">
                                {item.text}
                            </p>
                        </motion.section>
                    ))}

                    {/* Footer Navigation */}
                    <div className="pt-12 border-t border-surface-800 flex flex-col md:flex-row gap-6 items-center justify-between text-center md:text-left">
                        <div className="space-y-1">
                            <h4 className="text-white font-semibold">Found this helpful?</h4>
                            <p className="text-sm text-surface-500">Explore more guides to unlock MatchPulse's full potential.</p>
                        </div>
                        <Link
                            href="/help"
                            className="flex items-center gap-2 rounded-lg bg-pulse-500 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-pulse-600 active:scale-95 shadow-lg shadow-pulse-500/20"
                        >
                            Explore All Guides
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>

                {/* Sticky Sidebar Right */}
                <aside className="hidden lg:block space-y-6">
                    <div className="sticky top-6 p-6 rounded-xl border border-surface-800 bg-surface-900/30">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-pulse-400" />
                            Related Guides
                        </h3>
                        <div className="space-y-4">
                            {helpGuides
                                .filter(g => g.id !== id)
                                .map(g => (
                                    <Link
                                        key={g.id}
                                        href={`/help/${g.id}`}
                                        className="block group"
                                    >
                                        <p className="text-sm font-medium text-surface-400 group-hover:text-pulse-400 transition-colors mb-1">{g.title}</p>
                                        <p className="text-xs text-surface-600">{g.duration} read</p>
                                    </Link>
                                ))
                            }
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    )
}
