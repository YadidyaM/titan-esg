import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Titan ESG Platform',
  description: 'AI-powered ESG management and compliance platform',
  keywords: 'ESG, sustainability, compliance, AI, blockchain, carbon credits',
  authors: [{ name: 'Titan Team' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full`}>
        <Providers>
          <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative">
            {/* Background Pattern */}
            <div className="fixed inset-0 opacity-20">
              <svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <g fill="none" fillRule="evenodd">
                  <g fill="#059669" fillOpacity="0.05">
                    <circle cx="30" cy="30" r="1"/>
                  </g>
                </g>
              </svg>
            </div>
            
            {/* Animated Particles */}
            <div className="particles"></div>
            
            {/* Main Content */}
            {children}
          </div>
          
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </Providers>
      </body>
    </html>
  )
}
