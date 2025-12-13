'use client'

import { motion, AnimatePresence, HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

// Fade In
interface FadeInProps extends HTMLMotionProps<'div'> {
    delay?: number
    duration?: number
    blur?: boolean
}

export function FadeIn({
    children,
    className,
    delay = 0,
    duration = 0.4,
    blur = false,
    ...props
}: FadeInProps) {
    return (
        <motion.div
            initial={{ opacity: 0, filter: blur ? 'blur(8px)' : 'blur(0px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, filter: blur ? 'blur(8px)' : 'blur(0px)' }}
            transition={{ duration, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
            className={className}
            {...props}
        >
            {children}
        </motion.div>
    )
}

// Slide Up
interface SlideUpProps extends HTMLMotionProps<'div'> {
    delay?: number
    duration?: number
    offset?: number
}

export function SlideUp({
    children,
    className,
    delay = 0,
    duration = 0.4,
    offset = 20,
    ...props
}: SlideUpProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: offset }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: offset }}
            transition={{ duration, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
            className={className}
            {...props}
        >
            {children}
        </motion.div>
    )
}

// Stagger Container
interface StaggerContainerProps extends HTMLMotionProps<'div'> {
    staggerDelay?: number
    delayChildren?: number
}

export function StaggerContainer({
    children,
    className,
    staggerDelay = 0.05,
    delayChildren = 0,
    ...props
}: StaggerContainerProps) {
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={{
                hidden: { opacity: 0 },
                visible: {
                    opacity: 1,
                    transition: {
                        delayChildren,
                        staggerChildren: staggerDelay
                    }
                }
            }}
            className={className}
            {...props}
        >
            {children}
        </motion.div>
    )
}

// Stagger Item (to be used directly inside StaggerContainer)
export function StaggerItem({ children, className, ...props }: HTMLMotionProps<'div'>) {
    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                        type: 'spring',
                        stiffness: 300,
                        damping: 24
                    }
                }
            }}
            className={className}
            {...props}
        >
            {children}
        </motion.div>
    )
}

// Scale Button (tap effect)
export function ScaleButton({ children, className, ...props }: HTMLMotionProps<'button'>) {
    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            className={cn(className)}
            {...props}
        >
            {children}
        </motion.button>
    )
}

// Hover Card (lift effect)
export function HoverCard({ children, className, ...props }: HTMLMotionProps<'div'>) {
    return (
        <motion.div
            whileHover={{ y: -4, boxShadow: '0 12px 30px -10px rgba(236, 72, 153, 0.15)' }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className={className}
            {...props}
        >
            {children}
        </motion.div>
    )
}
