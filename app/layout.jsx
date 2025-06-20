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
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
} 