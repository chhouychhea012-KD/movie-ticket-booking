import type { Metadata, Viewport } from 'next'
import './globals.css'
import RootContent from '@/components/root-content'
import { AppProvider } from '@/context/AppContext'

const siteUrl = 'https://movie-ticket-booking.online'
const siteName = 'CinemaHub'
const siteDescription = 'Book movie tickets online, browse showtimes, choose cinema seats, pay securely, and save digital tickets for local cinemas in Cambodia.'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'CinemaHub - Movie Ticket Booking Online',
    template: '%s | CinemaHub',
  },
  description: siteDescription,
  keywords: [
    'movie ticket booking',
    'cinema tickets',
    'book movie tickets online',
    'movie showtimes',
    'cinema seat booking',
    'Cambodia cinema',
    'Phnom Penh cinema',
    'digital movie tickets',
  ],
  authors: [{ name: 'CinemaHub' }],
  creator: 'CinemaHub',
  publisher: 'CinemaHub',
  category: 'entertainment',
  manifest: '/manifest.webmanifest',
  applicationName: siteName,
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: siteName,
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/pwa-icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/pwa-icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/pwa-icon-192.png', sizes: '192x192', type: 'image/png' }],
  },
  openGraph: {
    title: 'CinemaHub - Movie Ticket Booking Online',
    description: siteDescription,
    url: '/',
    siteName,
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/pwa-icon-512.png',
        width: 512,
        height: 512,
        alt: 'CinemaHub movie ticket booking',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CinemaHub - Movie Ticket Booking Online',
    description: siteDescription,
    images: ['/pwa-icon-512.png'],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#0b0d10',
  colorScheme: 'dark',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    url: siteUrl,
    description: siteDescription,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}/movies?search={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
    publisher: {
      '@type': 'Organization',
      name: siteName,
      url: siteUrl,
      logo: `${siteUrl}/pwa-icon-512.png`,
    },
  }

  return (
    <html lang="en" className="dark">
      <body className="bg-background text-foreground" suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <AppProvider>
          <RootContent>{children}</RootContent>
        </AppProvider>
      </body>
    </html>
  )
}
