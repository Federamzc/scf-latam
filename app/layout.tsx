import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SK — Credit Infrastructure',
  description: 'Smart Kapital Finance as a Service for LATAM',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
