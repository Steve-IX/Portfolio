import './globals.css'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/lib/ThemeContext'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
})

export const metadata = {
  title: 'Stephen Addo - Portfolio',
  description: 'Software Engineer & AI Enthusiast',
  keywords: 'Stephen Addo, Software Engineer, AI, Quantum Computing, React, JavaScript, Python',
  authors: [{ name: 'Stephen Addo' }],
  creator: 'Stephen Addo',
  publisher: 'Stephen Addo',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://stephen-addo.vercel.app'),
  openGraph: {
    title: 'Stephen Addo - Portfolio',
    description: 'Software Engineer & AI Enthusiast',
    url: 'https://stephen-addo.vercel.app',
    siteName: 'Stephen Addo Portfolio',
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Performance optimization meta tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        
        {/* Resource hints for better performance */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Preload critical resources */}
        <link 
          rel="preload" 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" 
          as="style" 
          onLoad="this.onload=null;this.rel='stylesheet'" 
        />
        
        {/* Critical CSS for immediate rendering */}
        <style dangerouslySetInnerHTML={{
          __html: `
            .hero-content { opacity: 1 !important; transform: none !important; }
            .lcp-optimized { opacity: 1 !important; visibility: visible !important; }
            .typing-animation { opacity: 1; width: 100%; }
            body { margin: 0; padding: 0; }
            * { box-sizing: border-box; }
          `
        }} />
        
        {/* Performance hints */}
        <meta name="theme-color" content="#00d2ff" />
        <meta name="color-scheme" content="dark light" />
        
        {/* Optimize for mobile performance */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        
        {/* Prevent unnecessary prefetching on mobile */}
        <meta httpEquiv="x-dns-prefetch-control" content="on" />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
} 