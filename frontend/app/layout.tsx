import { Inter } from 'next/font/google'
import './globals.css'
import Providers from '@/components/Providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
    title: 'GenomicAI Insights | Clinical SNP Pathogenicity Predictor',
    description: 'AI-based Missense SNP Pathogenicity Predictor designed for clinical genomics workflows.',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={`${inter.className} min-h-screen bg-slate-50 flex flex-col`}>
                <Providers>
                    <header className="border-b bg-white">
                        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                            <h1 className="text-xl font-semibold text-primary">GenomicAI Insights</h1>
                            <nav className="space-x-4 text-sm font-medium">
                                <a href="/" className="text-slate-600 hover:text-primary">Dashboard</a>
                                <a href="/batch" className="text-slate-600 hover:text-primary">Batch Analysis</a>
                                <a href="/model" className="text-slate-600 hover:text-primary">Model Transparency</a>
                            </nav>
                        </div>
                    </header>
                    <main className="flex-1 container mx-auto px-4 py-8">
                        {children}
                    </main>
                    <footer className="border-t bg-white py-6">
                        <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
                            &copy; {new Date().getFullYear()} GenomicAI Insights. For research use only. Not for clinical diagnostic use without proper validation.
                        </div>
                    </footer>
                </Providers>
            </body>
        </html>
    )
}
