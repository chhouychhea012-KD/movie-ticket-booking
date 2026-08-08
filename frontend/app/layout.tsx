import type { Metadata, Viewport } from 'next'
import './globals.css'
import RootContent from '@/components/root-content'
import { AppProvider } from '@/context/AppContext'

export const metadata: Metadata = {
  metadataBase: new URL('https://movie-ticket-booking.online'),
  title: 'CinemaHub - Book Your Movie Tickets',
  description: 'Book movie tickets, choose seats, pay securely, and keep digital tickets on your device.',
  generator: 'v0.app',
  manifest: '/manifest.webmanifest',
  applicationName: 'CinemaHub',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'CinemaHub',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/pwa-icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/pwa-icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  openGraph: {
    title: 'CinemaHub Movie Ticket Booking',
    description: 'Book movie tickets, choose seats, pay securely, and keep digital tickets on your device.',
    type: 'website',
    images: ['/pwa-icon-512.png'],
  },
  twitter: {
    card: 'summary',
    title: 'CinemaHub Movie Ticket Booking',
    description: 'Book movie tickets, choose seats, pay securely, and keep digital tickets on your device.',
    images: ['/pwa-icon-512.png'],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
  themeColor: '#0b0d10',
  colorScheme: 'dark',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-foreground" suppressHydrationWarning>
        <AppProvider>
          <RootContent>{children}</RootContent>
        </AppProvider>
      </body>
    </html>
  )
}
