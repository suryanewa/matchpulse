import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
    title: 'MatchPulse | Cultural Insights Dashboard',
    description: 'Real-time dating culture insights and trend detection for product teams',
    icons: {
        icon: '/favicon.ico',
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className="dark">
            <body className="min-h-screen bg-surface-950 text-white antialiased">
                {children}
            </body>
        </html>
    )
}
