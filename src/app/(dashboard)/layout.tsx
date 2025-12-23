import { Sidebar } from '@/components/Sidebar'
import { Header } from '@/components/Header'
import { DashboardProvider } from '@/context/DashboardContext'
import { CupidProvider } from '@/context/CupidContext'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <DashboardProvider>
            <CupidProvider>
                <div className="flex min-h-screen bg-surface-950">
                    <Sidebar />
                    <div className="ml-64 flex flex-1 flex-col">
                        <Header />
                        <main className="flex-1 p-6">
                            {children}
                        </main>
                    </div>
                </div>
            </CupidProvider>
        </DashboardProvider>
    )
}
