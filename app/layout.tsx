import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'
import { SupabaseInitializer } from '@/components/supabase-initializer'
import { StructuredData } from '@/components/structured-data'

export const metadata: Metadata = {
  title: 'Fresh Delivery Hub (FDH) | Premium Fresh Meat Delivery',
  description: 'FDH represents premium fresh meat and seafood delivery. Sourced fresh daily, hygienically processed, and delivered in vacuum sealed packages at your chosen schedule.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#2d2218' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background scroll-smooth">
      <head>
        <StructuredData />
      </head>
      <body className="font-sans antialiased bg-background text-foreground">
        <SupabaseInitializer />
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
