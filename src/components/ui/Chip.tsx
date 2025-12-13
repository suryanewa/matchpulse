import { cn } from '@/lib/utils'

interface ChipProps {
    children: React.ReactNode
    variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'outline'
    size?: 'sm' | 'md'
    className?: string
}

const variantStyles = {
    default: 'bg-surface-800 text-surface-300 border-surface-700',
    primary: 'bg-pulse-500/20 text-pulse-300 border-pulse-500/30',
    success: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    warning: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    danger: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    outline: 'bg-transparent text-surface-400 border-surface-600 hover:bg-surface-800/50 hover:text-surface-300',
}

const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
}

export function Chip({
    children,
    variant = 'default',
    size = 'sm',
    className
}: ChipProps) {
    return (
        <span
            className={cn(
                'inline-flex items-center rounded-full border font-medium transition-colors',
                variantStyles[variant],
                sizeStyles[size],
                className
            )}
        >
            {children}
        </span>
    )
}
