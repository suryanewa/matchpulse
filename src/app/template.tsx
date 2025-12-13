'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

export default function Template({ children }: { children: ReactNode }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
            {children}
        </motion.div>
    )
}
