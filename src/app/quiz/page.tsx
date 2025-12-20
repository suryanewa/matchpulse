import Link from 'next/link'
import { personas } from '@/data/mock-data'
import { Sparkles, ArrowRight, Heart, Users, Zap } from 'lucide-react'

export default function QuizLandingPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-surface-950 via-surface-900 to-surface-950">
            {/* Back to Dashboard Link */}
            <div className="border-b border-surface-800 px-6 py-4">
                <div className="mx-auto max-w-5xl">
                    <Link
                        href="/behaviors"
                        className="text-sm text-surface-500 hover:text-surface-300"
                    >
                        ← Back to Dashboard
                    </Link>
                </div>
            </div>

            {/* Hero Section */}
            <section className="relative overflow-hidden px-6 py-20">
                {/* Background decorations */}
                <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-pulse-500/10 blur-3xl" />
                <div className="absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-accent-500/10 blur-3xl" />

                <div className="relative mx-auto max-w-4xl text-center">
                    {/* Badge */}
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-pulse-500/30 bg-pulse-500/10 px-4 py-1.5 text-sm text-pulse-300">
                        <Sparkles className="h-4 w-4" />
                        MatchPulse Quiz
                    </div>

                    {/* Main heading */}
                    <h1 className="mb-6 text-5xl font-bold tracking-tight text-white md:text-6xl">
                        What&apos;s Your{' '}
                        <span className="bg-gradient-to-r from-pulse-400 via-accent-400 to-cyan-400 bg-clip-text text-transparent">
                            Dating Style
                        </span>
                        ?
                    </h1>

                    {/* Subheading */}
                    <p className="mx-auto mb-10 max-w-2xl text-xl text-surface-300">
                        Answer 10 quick questions and discover your dating archetype.
                        Get insights into your patterns, strengths, and what you should know about yourself.
                    </p>

                    {/* CTA Button */}
                    <Link
                        href="/quiz/questions"
                        className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pulse-500 to-accent-500 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-pulse-500/25 transition-all hover:shadow-xl hover:shadow-pulse-500/30"
                    >
                        Take the Quiz
                        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Link>

                    <p className="mt-4 text-sm text-surface-500">
                        Takes about 2 minutes • 100% free
                    </p>
                </div>
            </section>

            {/* Persona Preview Section */}
            <section className="px-6 py-16">
                <div className="mx-auto max-w-5xl">
                    <h2 className="mb-10 text-center text-2xl font-bold text-white">
                        Discover Which Type You Are
                    </h2>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {personas.map((persona) => (
                            <div
                                key={persona.id}
                                className="group relative overflow-hidden rounded-xl border border-surface-800 bg-surface-900/50 p-5 transition-all hover:border-surface-700 hover:bg-surface-900"
                            >
                                {/* Gradient background */}
                                <div className={`absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-20 blur-2xl bg-gradient-to-br ${persona.gradient}`} />

                                <div className="relative flex items-center gap-4">
                                    <div className={`flex h-14 w-14 items-center justify-center rounded-xl text-2xl bg-gradient-to-br ${persona.gradient}`}>
                                        {persona.emoji}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white">{persona.name}</h3>
                                        <p className="text-sm text-surface-400 line-clamp-1">{persona.tagline}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="px-6 py-16">
                <div className="mx-auto max-w-4xl">
                    <h2 className="mb-10 text-center text-2xl font-bold text-white">
                        How It Works
                    </h2>

                    <div className="grid gap-8 md:grid-cols-3">
                        <div className="text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-pulse-500/20">
                                <Heart className="h-8 w-8 text-pulse-400" />
                            </div>
                            <h3 className="mb-2 font-semibold text-white">Answer Honestly</h3>
                            <p className="text-sm text-surface-400">
                                10 questions about your dating behaviors, preferences, and thought patterns
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-500/20">
                                <Zap className="h-8 w-8 text-accent-400" />
                            </div>
                            <h3 className="mb-2 font-semibold text-white">Get Matched</h3>
                            <p className="text-sm text-surface-400">
                                Our algorithm maps your answers to one of 6 distinct dating personas
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/20">
                                <Users className="h-8 w-8 text-cyan-400" />
                            </div>
                            <h3 className="mb-2 font-semibold text-white">Understand Yourself</h3>
                            <p className="text-sm text-surface-400">
                                Get insights into your patterns and share your results with friends
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer CTA */}
            <section className="px-6 py-16">
                <div className="mx-auto max-w-2xl text-center">
                    <p className="mb-6 text-lg text-surface-300">
                        Ready to discover your dating style?
                    </p>
                    <Link
                        href="/quiz/questions"
                        className="group inline-flex items-center gap-2 rounded-full border border-pulse-500/50 bg-pulse-500/10 px-6 py-3 font-medium text-pulse-300 transition-all hover:bg-pulse-500/20"
                    >
                        Start the Quiz
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>
            </section>
        </div>
    )
}
