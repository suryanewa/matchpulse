'use client'

import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

export function LoadingScreen() {
    return (
        <div className="flex h-full min-h-[50vh] w-full items-center justify-center">
            <div className="relative flex flex-col items-center justify-center">
                {/* Pulse Effect Background */}
                <motion.div
                    animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.3, 0.1, 0.3],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="absolute h-32 w-32 rounded-full bg-pulse-500/20 blur-xl"
                />

                {/* Icon */}
                <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="relative z-10 mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-pulse-500 to-accent-500 shadow-xl shadow-pulse-500/20"
                >
                    <Sparkles className="h-8 w-8 text-white" />
                </motion.div>

                {/* Text */}
                <div className="text-center">
                    <motion.h3
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-1 text-xl font-bold text-white"
                    >
                        MatchPulse
                    </motion.h3>
                    <motion.div
                        className="flex justify-center gap-[2px]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        {['L', 'o', 'a', 'd', 'i', 'n', 'g', '.', '.', '.'].map((char, i) => (
                            <motion.span
                                key={i}
                                animate={{ opacity: [1, 0.4, 1] }}
                                transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    delay: i * 0.1,
                                    ease: "easeInOut"
                                }}
                                className="text-sm font-medium text-surface-400"
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
