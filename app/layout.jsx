import './globals.css'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/lib/ThemeContext'

// Import performance monitor for client-side monitoring
if (typeof window !== 'undefined') {
  import('@/lib/performanceMonitor');
}

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  fallback: ['system-ui', 'arial'],
})

export const metadata = {
  title: 'Stephen Addo - Portfolio',
  description: 'Software Engineer & AI Enthusiast',
  other: {
    'X-UA-Compatible': 'IE=edge',
    'format-detection': 'telephone=no',
  }
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f0f5fa' },
    { media: '(prefers-color-scheme: dark)', color: '#011627' }
  ],
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* DNS prefetch for performance - removed manual font preloads since Next.js handles Google Fonts */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        
        {/* Performance optimizations */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="format-detection" content="telephone=no" />
        
        {/* Preload critical CSS */}
        <link rel="preload" as="style" href="/globals.css" />
      </head>
      <body className={`${inter.className} font-sans antialiased`}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
} 