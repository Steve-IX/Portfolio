import './globals.css'
import { ThemeProvider } from '@/lib/ThemeContext'

export const metadata = {
  title: 'Stephen Addo - Portfolio',
  description: 'Software Engineer & AI Enthusiast',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
} 