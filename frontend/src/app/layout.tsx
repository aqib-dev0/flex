import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

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
          <header className="bg-white dark:bg-secondary-800 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16 items-center">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <span className="font-bold text-xl text-primary-600">Flex Living</span>
                  </div>
                  <nav className="ml-6 flex space-x-4">
                    <a href="/" className="text-secondary-700 hover:text-secondary-900 dark:text-secondary-200 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium">Dashboard</a>
                    <a href="/properties" className="text-secondary-700 hover:text-secondary-900 dark:text-secondary-200 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium">Properties</a>
                  </nav>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-secondary-500 dark:text-secondary-400">Admin Dashboard</span>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>

          <footer className="bg-white dark:bg-secondary-800 border-t border-secondary-200 dark:border-secondary-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="py-6">
                <p className="text-sm text-secondary-500 dark:text-secondary-400">
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
