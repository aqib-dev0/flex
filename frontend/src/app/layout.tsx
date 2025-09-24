import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'

// Initialize the Inter font
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Flex Living Review System',
  description: 'A comprehensive review management system for Flex Living properties',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body className="min-h-screen">
        <div className="flex flex-col min-h-screen">
          <header className="bg-flex-green shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16 items-center">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Link href="/" className="text-white hover:text-secondary-50">
                      <span className="font-light text-xl"><span className="font-bold">the</span> flex.</span>
                    </Link>
                  </div>
                  <nav className="ml-6 flex space-x-4">
                    <Link href="http://localhost:3002/dashboard" className="text-white hover:text-secondary-50 px-3 py-2 rounded-md text-sm font-medium">Dashboard</Link>
                    <Link href="/properties" className="text-white hover:text-secondary-50 px-3 py-2 rounded-md text-sm font-medium">Properties</Link>
                    <Link href="/reviews" className="text-white hover:text-secondary-50 px-3 py-2 rounded-md text-sm font-medium">Reviews</Link>
                  </nav>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-white">Admin Dashboard</span>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>

          <footer className="bg-flex-beige border-t border-secondary-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="py-6">
                <p className="text-sm text-secondary-500">
                  © {new Date().getFullYear()} Flex Living. All rights reserved.
                </p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
