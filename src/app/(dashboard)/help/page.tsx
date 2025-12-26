'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Search,
    BookOpen,
    MessageCircle,
    ChevronDown,
    ExternalLink,
    HelpCircle,
    ArrowRight,
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
        <div className="space-y-10 pb-12">
            {/* Hero Section - Tinder style */}
            <div className="relative overflow-hidden rounded-3xl bg-[#1a1a1a] p-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mx-auto max-w-2xl"
                >
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#FE3C72] to-[#FF6B6B] shadow-lg shadow-[#FE3C72]/20">
                        <HelpCircle className="h-8 w-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-3">How can we help?</h1>
                    <p className="text-gray-500 mb-8">
                        Search our knowledge base or browse frequently asked questions below.
                    </p>
                    <div className="relative mx-auto max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search for articles, guides..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full rounded-2xl border-0 bg-[#222] py-4 pl-12 pr-4 text-white placeholder-gray-600 transition-all focus:outline-none focus:ring-2 focus:ring-[#FE3C72]/50"
                        />
                    </div>
                </motion.div>
            </div>

            {/* Results Grid */}
            {!hasResults ? (
                <div className="text-center py-12">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#1a1a1a] mb-4">
                        <Search className="h-10 w-10 text-gray-600" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No results found</h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                        We couldn't find any articles or FAQs matching "{searchQuery}". Try using different keywords or browse the categories below.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
                    {/* FAQ Section - Tinder style */}
                    {filteredFaqs.length > 0 && (
                        <div className={cn("space-y-5", filteredGuides.length === 0 ? "lg:col-span-3" : "lg:col-span-2")}>
                            <h2 className="text-xl font-bold text-white flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FE3C72] text-white">
                                    <MessageCircle className="h-5 w-5" />
                                </div>
                                Frequently Asked Questions
                            </h2>
                            <div className="space-y-3">
                                {filteredFaqs.map((faq, i) => (
                                    <div
                                        key={i}
                                        className="overflow-hidden rounded-2xl bg-[#1a1a1a] transition-all"
                                    >
                                        <button
                                            onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                            className="flex w-full items-center justify-between p-5 text-left"
                                        >
                                            <span className="font-medium text-white">{faq.question}</span>
                                            <div className={cn(
                                                "flex h-8 w-8 items-center justify-center rounded-full bg-[#222] transition-all",
                                                openFaq === i && "bg-[#FE3C72]"
                                            )}>
                                                <ChevronDown className={cn(
                                                    "h-4 w-4 text-gray-400 transition-transform",
                                                    openFaq === i && "rotate-180 text-white"
                                                )} />
                                            </div>
                                        </button>
                                        <AnimatePresence>
                                            {openFaq === i && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="px-5 pb-5 text-sm leading-relaxed text-gray-400">
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

                    {/* Getting Started Guides - Tinder style */}
                    <div className={cn("space-y-5", filteredFaqs.length === 0 && "lg:col-span-3", filteredGuides.length === 0 && "hidden")}>
                        <h2 className="text-xl font-bold text-white flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-white">
                                <BookOpen className="h-5 w-5" />
                            </div>
                            Featured Guides
                        </h2>
                        <div className={cn("grid gap-3", filteredFaqs.length === 0 ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1")}>
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
                                        className="group relative rounded-2xl bg-[#1a1a1a] p-4 transition-[background-color,transform] duration-150 ease-out hover:bg-[#222] hover:-translate-y-1"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl", guide.color)}>
                                                <guide.icon className="h-5 w-5" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-medium text-white group-hover:text-[#FE3C72] transition-colors">{guide.title}</h3>
                                                <p className="text-xs text-gray-500">{guide.duration} read</p>
                                            </div>
                                            <ArrowRight className="h-4 w-4 text-gray-600 transition-all transform group-hover:translate-x-1 group-hover:text-[#FE3C72]" />
                                        </div>
                                    </motion.div>
                                </Link>
                            ))}
                        </div>

                        {/* Support Card - Tinder style */}
                        {filteredFaqs.length > 0 && (
                            <div className="mt-6 rounded-2xl bg-gradient-to-br from-[#FE3C72]/10 to-[#FF6B6B]/5 p-6">
                                <h3 className="mb-2 font-bold text-white">Still need help?</h3>
                                <p className="mb-5 text-sm text-gray-500">
                                    Our team is available 24/7 for technical support and data inquiries.
                                </p>
                                <a
                                    href="mailto:newa@nyu.edu"
                                    className="flex w-full items-center justify-center gap-2 rounded-full bg-[#FE3C72] px-4 py-3 text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95 shadow-lg shadow-[#FE3C72]/20"
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
