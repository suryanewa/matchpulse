'use client'

import { Area, AreaChart, ResponsiveContainer } from 'recharts'

interface SparklineProps {
    data: { date: string; value: number }[]
    color?: string
    height?: number
    showGradient?: boolean
}

export function Sparkline({
    data,
    color = '#ec4899',
    height = 40,
    showGradient = true
}: SparklineProps) {
    // Calculate trend direction
    const firstValue = data[0]?.value || 0
    const lastValue = data[data.length - 1]?.value || 0
    const isPositive = lastValue >= firstValue

    const lineColor = isPositive ? '#10b981' : '#ef4444'
    // Use a stable ID based on data length or first/last points to prevent flicker during morphing
    const gradientId = `sparkline-gradient-${color.replace('#', '')}-${data.length}`

    return (
        <ResponsiveContainer width="100%" height={height}>
            <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <defs>
                    <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity={showGradient ? 0.3 : 0} />
                        <stop offset="100%" stopColor={color} stopOpacity={0} />
                    </linearGradient>
                </defs>
                <Area
                    type="monotone"
                    dataKey="value"
                    stroke={color}
                    strokeWidth={2}
                    fill={`url(#${gradientId})`}
                    dot={false}
                    isAnimationActive={true}
                    animationDuration={800}
                    animationBegin={0}
                />
            </AreaChart>
        </ResponsiveContainer>
    )
}
