import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
    title: 'MatchPulse',
    description: 'Real-time dating culture insights and trend detection for product teams',
    manifest: '/manifest.json',
    icons: {
        icon: [
            { url: '/favicon.ico', sizes: 'any' },
            { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
            { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
        ],
        apple: '/apple-touch-icon.png',
    },
    appleWebApp: {
        capable: true,
        title: 'MatchPulse',
        statusBarStyle: 'black-translucent',
    },
    themeColor: '#FE3C72',
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
