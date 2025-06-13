import './globals.css'

export const metadata = {
  title: 'Stephen Addo - Portfolio',
  description: 'Software Engineer & AI Enthusiast',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
} 