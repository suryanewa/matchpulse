'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Search,
    BookOpen,
    MessageCircle,
    Zap,
    Shield,
    Layers,
    ChevronDown,
    ExternalLink,
    HelpCircle,
    PlayCircle,
    ArrowRight,
    Users
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { helpGuides } from '@/data/help-guides'
import Link from 'next/link'

const faqs = [
    {
        question: "How are the Rising Behaviors calculated?",
        answer: "We use a multi-signal processing engine that monitors Reddit, TikTok, and X (Twitter). Our algorithm looks for spikes in mention frequency, sentiment shifts, and cross-platform propagation to identify a 'Rising Behavior' before it hits the mainstream."
    },
    {
        question: "Can I export data for external analysis?",
        answer: "Yes, you can export trend data and persona summaries in JSON or CSV format. Head to the Reports tab or use our public API for automated data fetching."
    },
    {
        question: "How often is the dashboard data refreshed?",
        answer: "Our ingestion pipeline runs every 15 minutes for real-time signals, while deeper NLP analysis and persona mapping occur every 2 hours to ensure high accuracy."
    },
    {
        question: "What does 'Confidence Score' mean for Personas?",
        answer: "Confidence Score represents the statistical alignment between a specific behavior and a persona's known psychographic profile. A score above 85% indicates a very strong behavioral match."
    }
]


export default function HelpPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [openFaq, setOpenFaq] = useState<number | null>(null)

    const filteredFaqs = useMemo(() => {
        if (!searchQuery) return faqs
        const query = searchQuery.toLowerCase()
        return faqs.filter(faq =>
            faq.question.toLowerCase().includes(query) ||
            faq.answer.toLowerCase().includes(query)
        )
    }, [searchQuery])

    const filteredGuides = useMemo(() => {
        if (!searchQuery) return helpGuides
        const query = searchQuery.toLowerCase()
        return helpGuides.filter(guide =>
            guide.title.toLowerCase().includes(query) ||
            guide.description.toLowerCase().includes(query) ||
            guide.content.some(c => c.text.toLowerCase().includes(query) || c.section.toLowerCase().includes(query))
        )
    }, [searchQuery])

    const hasResults = filteredFaqs.length > 0 || filteredGuides.length > 0

    return (
        <div className="space-y-12 pb-12">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-2xl border border-surface-800 bg-surface-900/50 p-12 text-center backdrop-blur-md">
                <div className="absolute inset-0 -z-10 bg-gradient-to-br from-pulse-500/5 to-accent-500/5" />
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mx-auto max-w-2xl"
                >
                    <HelpCircle className="mx-auto h-12 w-12 text-pulse-500 mb-6" />
                    <h1 className="text-4xl font-bold text-white mb-4">How can we help?</h1>
                    <p className="text-surface-400 mb-8">
                        Search our knowledge base or browse frequently asked questions below.
                    </p>
                    <div className="relative mx-auto max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-surface-500" />
                        <input
                            type="text"
                            placeholder="Search for articles, guides..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full rounded-full border border-surface-700 bg-surface-950/50 py-3 pl-12 pr-4 text-white placeholder-surface-500 backdrop-blur-sm transition-all focus:border-pulse-500 focus:outline-none focus:ring-1 focus:ring-pulse-500"
                        />
                    </div>
                </motion.div>
            </div>

            {/* Results Grid */}
            {!hasResults ? (
                <div className="text-center py-12">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-surface-900 border border-surface-800 mb-4">
                        <Search className="h-8 w-8 text-surface-500" />
                    </div>
                    <h3 className="text-xl font-medium text-white mb-2">No results found</h3>
                    <p className="text-surface-400 max-w-md mx-auto">
                        We couldn't find any articles or FAQs matching "{searchQuery}". Try using different keywords or browse the categories below.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
                    {/* FAQ Section */}
                    {filteredFaqs.length > 0 && (
                        <div className={cn("space-y-6", filteredGuides.length === 0 ? "lg:col-span-3" : "lg:col-span-2")}>
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <MessageCircle className="h-5 w-5 text-pulse-400" />
                                Frequently Asked Questions
                            </h2>
                            <div className="space-y-3">
                                {filteredFaqs.map((faq, i) => (
                                    <div
                                        key={i}
                                        className="overflow-hidden rounded-xl border border-surface-800 bg-surface-900/30 transition-all hover:bg-surface-800/30"
                                    >
                                        <button
                                            onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                            className="flex w-full items-center justify-between p-5 text-left"
                                        >
                                            <span className="font-medium text-surface-100">{faq.question}</span>
                                            <ChevronDown className={cn(
                                                "h-5 w-5 text-surface-500 transition-transform",
                                                openFaq === i && "rotate-180"
                                            )} />
                                        </button>
                                        <AnimatePresence>
                                            {openFaq === i && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="p-5 pt-0 text-sm leading-relaxed text-surface-400 border-t border-surface-800/50">
                                                        {faq.answer}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Getting Started Guides */}
                    <div className={cn("space-y-6", filteredFaqs.length === 0 && "lg:col-span-3", filteredGuides.length === 0 && "hidden")}>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-accent-400" />
                            Featured Guides
                        </h2>
                        <div className={cn("grid gap-4", filteredFaqs.length === 0 ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1")}>
                            {filteredGuides.map((guide, i) => (
                                <Link
                                    key={guide.id}
                                    href={`/help/${guide.id}`}
                                    className="block"
                                >
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="group relative rounded-xl border border-surface-800 bg-surface-900/30 p-4 transition-all hover:border-surface-600 hover:bg-surface-800/50"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg bg-surface-800", guide.color)}>
                                                <guide.icon className="h-5 w-5" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-medium text-white group-hover:text-pulse-400 transition-colors">{guide.title}</h3>
                                                <p className="text-xs text-surface-500">{guide.duration} read</p>
                                            </div>
                                            <ArrowRight className="h-4 w-4 text-surface-600 group-hover:text-white transition-all transform group-hover:translate-x-1" />
                                        </div>
                                    </motion.div>
                                </Link>
                            ))}
                        </div>

                        {/* Support Card - Only show in sidebar if we have guides, otherwise maybe move it? Or keep it here. */}
                        {filteredFaqs.length > 0 && (
                            <div className="mt-8 rounded-xl bg-gradient-to-br from-pulse-500/10 to-accent-500/10 border border-pulse-500/20 p-6">
                                <h3 className="mb-2 font-bold text-white">Still need help?</h3>
                                <p className="mb-6 text-sm text-surface-400">
                                    Our team is available 24/7 for technical support and data inquiries.
                                </p>
                                <a
                                    href="mailto:newa@nyu.edu"
                                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-pulse-500 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-pulse-600 active:scale-95 shadow-lg shadow-pulse-500/20"
                                >
                                    Contact Support
                                    <ExternalLink className="h-4 w-4" />
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
