'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

export function LoadingScreen() {
    return (
        <div className="flex h-full min-h-[60vh] w-full items-center justify-center overflow-hidden">
            <div className="relative flex flex-col items-center justify-center">
                {/* 1. Deep Ambient Glows (Stationary/Slow Pulse) */}
                <div className="absolute h-[300px] w-[300px] rounded-full bg-pulse-500/10 blur-[80px]" />
                <div className="absolute h-[200px] w-[200px] rounded-full bg-accent-500/10 blur-[60px] translate-x-10 -translate-y-10" />

                {/* 2. Rotating Orbital Rings */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="absolute h-48 w-48 rounded-full border border-pulse-500/10 border-t-pulse-500/40"
                />
                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                    className="absolute h-40 w-40 rounded-full border border-accent-500/10 border-b-accent-500/40"
                />

                {/* 3. Drifting Particles (Stars) */}
                {[...Array(8)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{
                            x: Math.random() * 200 - 100,
                            y: Math.random() * 200 - 100,
                            opacity: 0
                        }}
                        animate={{
                            y: [null, Math.random() * -100 - 50],
                            opacity: [0, 0.4, 0],
                            scale: [0, 1, 0]
                        }}
                        transition={{
                            duration: 3 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 5,
                            ease: "easeInOut"
                        }}
                        className="absolute h-1 w-1 rounded-full bg-white shadow-[0_0_8px_white]"
                    />
                ))}

                {/* 4. The Logo with Floating & Glow Effect */}
                <motion.div
                    animate={{
                        y: [-8, 8, -8],
                        filter: [
                            'drop-shadow(0 0 10px rgba(255, 22, 89, 0.2))',
                            'drop-shadow(0 0 25px rgba(255, 22, 89, 0.5))',
                            'drop-shadow(0 0 10px rgba(255, 22, 89, 0.2))'
                        ]
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="relative z-10 mb-8"
                >
                    <Image
                        src="/assets/MatchPulse Logo.svg"
                        alt="MatchPulse Logo"
                        width={80}
                        height={80}
                        className="h-20 w-20"
                    />
                </motion.div>

                {/* 5. Refined Text Content */}
                <div className="relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mb-2"
                    >
                        <h3 className="text-2xl font-black tracking-tight text-white">
                            MATCH<span className="bg-gradient-to-r from-pulse-400 to-accent-400 bg-clip-text text-transparent">PULSE</span>
                        </h3>
                    </motion.div>

                    <motion.div
                        className="flex justify-center gap-1.5"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        {['a', 'n', 'a', 'l', 'y', 'z', 'i', 'n', 'g'].map((char, i) => (
                            <motion.span
                                key={i}
                                animate={{
                                    opacity: [0.3, 1, 0.3],
                                    y: [0, -2, 0]
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    delay: i * 0.1,
                                    ease: "easeInOut"
                                }}
                                className="text-[11px] font-bold uppercase tracking-[0.2em] text-surface-400"
                            >
                                {char}
                            </motion.span>
                        ))}
                    </motion.div>
                </div>
            </div>
        </div>
    )
}

