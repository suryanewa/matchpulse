'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Star, Check, Heart, MapPin, CheckCircle2 } from 'lucide-react'
import { DateSuggestion, DateLog, DateLogTag } from '@/types/cupid'
import { DATE_LOG_TAG_DEFINITIONS } from '@/data/cupid-data'
import { cn } from '@/lib/utils'

interface DateCardProps {
    date: DateSuggestion
    onSave: (id: string) => void
    onUnsave: (id: string) => void
    onComplete: (log: Omit<DateLog, 'id'>) => void
    onNotOurVibe: (id: string) => void
    onDismiss?: (id: string) => void
}

export function DateCard({ date, onSave, onUnsave, onComplete, onNotOurVibe, onDismiss }: DateCardProps) {
    const [showLogModal, setShowLogModal] = useState(false)

    // Extract rating and review count from description
    const ratingMatch = date.description?.match(/(\d+\.?\d*)⭐/)
    const reviewMatch = date.description?.match(/\((\d+)\s*reviews?\)/i)
    const rating = ratingMatch ? parseFloat(ratingMatch[1]) : date.rating
    const reviewCount = reviewMatch ? parseInt(reviewMatch[1]) : null

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                whileHover={{ y: -4, transition: { duration: 0.15, ease: 'easeOut' } }}
                className="group relative overflow-hidden rounded-2xl bg-[#1a1a1a] transition-[background-color,box-shadow] duration-150 ease-out hover:bg-[#222] hover:shadow-xl hover:shadow-black/50"
            >
                {/* Dismiss X Button */}
                {onDismiss && (
                    <button
                        onClick={() => onDismiss(date.id)}
                        className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-gray-400 opacity-0 transition-all hover:bg-black/70 hover:text-white group-hover:opacity-100"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
                {/* Photo Header - if available */}
                {date.photoUrl && (
                    <div className="relative h-32 w-full overflow-hidden">
                        <img
                            src={date.photoUrl}
                            alt={date.title}
                            className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] to-transparent" />
                    </div>
                )}

                <div className="p-4">
                    {/* Title Row */}
                    <div className="mb-2">
                        <h3 className="text-lg font-bold leading-tight text-white">
                            {date.title}
                        </h3>
                    </div>

                    {/* Location & Rating */}
                    <div className="mb-3 flex items-center gap-3 text-sm text-gray-400">
                        <span className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            {date.neighborhood}
                        </span>
                        {rating && (
                            <span className="flex items-center gap-1">
                                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                                {rating.toFixed(1)}
                                {reviewCount && (
                                    <span className="text-gray-500">({reviewCount.toLocaleString()})</span>
                                )}
                            </span>
                        )}
                    </div>

                    {/* Why It Fits */}
                    <p className="mb-4 text-sm leading-relaxed text-gray-400">
                        ✨ {date.whyItFits}
                    </p>

                    {/* Action Buttons - Tinder Style */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => date.isSaved ? onUnsave(date.id) : onSave(date.id)}
                            className={cn(
                                'flex flex-1 items-center justify-center gap-2 rounded-full py-2.5 text-sm font-semibold transition-all',
                                date.isSaved
                                    ? 'bg-[#FE3C72] text-white'
                                    : 'bg-[#2a2a2a] text-gray-300 hover:bg-[#333]'
                            )}
                        >
                            {date.isSaved ? (
                                <>
                                    <Heart className="h-4 w-4 fill-white" />
                                    Saved
                                </>
                            ) : (
                                <>
                                    <Heart className="h-4 w-4" />
                                    Save
                                </>
                            )}
                        </button>
                        <button
                            onClick={() => setShowLogModal(true)}
                            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#FE3C72] to-[#FF6B6B] py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90"
                        >
                            <CheckCircle2 className="h-4 w-4" />
                            We Did This
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Log Modal */}
            <AnimatePresence>
                {showLogModal && (
                    <QuickLogModal
                        date={date}
                        onClose={() => setShowLogModal(false)}
                        onSubmit={(log) => {
                            onComplete(log)
                            setShowLogModal(false)
                        }}
                    />
                )}
            </AnimatePresence>
        </>
    )
}

// ============================================
// Quick Log Modal - Tinder Style
// ============================================

interface QuickLogModalProps {
    date: DateSuggestion
    onClose: () => void
    onSubmit: (log: Omit<DateLog, 'id'>) => void
}

function QuickLogModal({ date, onClose, onSubmit }: QuickLogModalProps) {
    const [rating, setRating] = useState<1 | 2 | 3 | 4 | 5>(5)
    const [selectedTags, setSelectedTags] = useState<DateLogTag[]>([])
    const [note, setNote] = useState('')

    const toggleTag = (tag: DateLogTag) => {
        setSelectedTags(prev =>
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        )
    }

    const handleSubmit = () => {
        onSubmit({
            dateIdeaId: date.id,
            dateIdeaTitle: date.title,
            category: date.category,
            neighborhood: date.neighborhood,
            completedAt: new Date(),
            didGo: true,
            rating,
            tags: selectedTags,
            note: note || undefined,
        })
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md overflow-hidden rounded-3xl bg-[#1a1a1a]"
            >
                {/* Header */}
                <div className="relative bg-gradient-to-r from-[#FE3C72] to-[#FF6B6B] px-6 py-5">
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 rounded-full bg-white/20 p-1.5 text-white hover:bg-white/30"
                    >
                        <X className="h-4 w-4" />
                    </button>
                    <h2 className="text-xl font-bold text-white">How was it? ✨</h2>
                    <p className="mt-1 text-sm text-white/80">{date.title}</p>
                </div>

                <div className="p-6">
                    {/* Rating */}
                    <div className="mb-6">
                        <label className="mb-3 block text-sm font-medium text-gray-400">
                            Rate your date
                        </label>
                        <div className="flex justify-center gap-2">
                            {([1, 2, 3, 4, 5] as const).map((star) => (
                                <button
                                    key={star}
                                    onClick={() => setRating(star)}
                                    className="transition-transform hover:scale-110"
                                >
                                    <Star
                                        className={cn(
                                            'h-10 w-10 transition-colors',
                                            star <= rating
                                                ? 'fill-[#FFD700] text-[#FFD700]'
                                                : 'text-[#333]'
                                        )}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="mb-6">
                        <label className="mb-3 block text-sm font-medium text-gray-400">
                            Vibe check
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {(Object.entries(DATE_LOG_TAG_DEFINITIONS) as [DateLogTag, typeof DATE_LOG_TAG_DEFINITIONS[DateLogTag]][]).map(([key, tag]) => (
                                <button
                                    key={key}
                                    onClick={() => toggleTag(key)}
                                    className={cn(
                                        'rounded-full px-3.5 py-2 text-sm font-medium transition-all',
                                        selectedTags.includes(key)
                                            ? 'bg-[#FE3C72] text-white'
                                            : 'bg-[#2a2a2a] text-gray-400 hover:bg-[#333]'
                                    )}
                                >
                                    {tag.emoji} {tag.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Note */}
                    <div className="mb-6">
                        <label className="mb-3 block text-sm font-medium text-gray-400">
                            Quick note (optional)
                        </label>
                        <input
                            type="text"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Best night ever..."
                            className="w-full rounded-xl border-0 bg-[#2a2a2a] px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FE3C72]"
                        />
                    </div>

                    {/* Submit */}
                    <button
                        onClick={handleSubmit}
                        className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#FE3C72] to-[#FF6B6B] py-3.5 text-base font-bold text-white transition-all hover:opacity-90"
                    >
                        <Check className="h-5 w-5" />
                        Log This Date
                    </button>
                </div>
            </motion.div>
        </motion.div>
    )
}

export { QuickLogModal }
