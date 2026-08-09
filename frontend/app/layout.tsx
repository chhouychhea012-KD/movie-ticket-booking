import type { Metadata, Viewport } from 'next'
import './globals.css'
import RootContent from '@/components/root-content'
import { AppProvider } from '@/context/AppContext'

const siteUrl = 'https://cambocine.online'
const siteName = 'CamboCine'
const siteDescription = 'CamboCine is a modern Cambodia movie ticket booking platform for browsing cinema showtimes, watching trailers, choosing seats, paying securely, and saving digital tickets.'
const siteIcon = '/favicon-192x192.png'
const siteLogo = `${siteUrl}${siteIcon}`

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'CamboCine Official Site - Cambodia Movie Ticket Booking',
    template: '%s | CamboCine',
  },
  description: siteDescription,
  keywords: [
    'CamboCine',
    'Cambo Cine',
    'CamboCine online',
    'CamboCine movie booking',
    'Cambodia movie ticket booking',
    'movie ticket booking',
    'cinema tickets',
    'book movie tickets online',
    'movie showtimes',
    'watch movie trailers online',
    'cinema seat booking',
    'Cambodia cinema',
    'Phnom Penh cinema',
    'Phnom Penh movie tickets',
    'Siem Reap cinema',
    'Battambang cinema',
    'online cinema booking Cambodia',
    'digital movie tickets',
    'movie booking app Cambodia',
  ],
  authors: [{ name: 'CamboCine' }],
  creator: 'CamboCine',
  publisher: 'CamboCine',
  category: 'entertainment',
  classification: 'Movie ticket booking, cinema showtimes, entertainment',
  referrer: 'origin-when-cross-origin',
  manifest: '/manifest.webmanifest',
  applicationName: siteName,
  alternates: {
    canonical: '/',
    languages: {
      en: '/',
      'en-KH': '/',
    },
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
      { url: siteIcon, sizes: '192x192', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/pwa-icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/pwa-icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: [siteIcon],
    apple: [{ url: siteIcon, sizes: '192x192', type: 'image/png' }],
  },
  openGraph: {
    title: 'CamboCine Official Site - Cambodia Movie Ticket Booking',
    description: siteDescription,
    url: '/',
    siteName,
    type: 'website',
    locale: 'en_KH',
    images: [
      {
        url: '/pwa-icon-512.png',
        width: 512,
        height: 512,
        alt: 'CamboCine movie ticket booking',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CamboCine Official Site - Cambodia Movie Ticket Booking',
    description: siteDescription,
    images: ['/pwa-icon-512.png'],
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-title': siteName,
    'application-name': siteName,
    'msapplication-TileColor': '#0b0d10',
    'geo.region': 'KH',
    'geo.placename': 'Phnom Penh, Cambodia',
    'ICBM': '11.5564,104.9282',
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
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${siteUrl}/#organization`,
        name: siteName,
        alternateName: ['Cambo Cine', 'CamboCine Movie Time'],
        url: siteUrl,
        logo: {
          '@type': 'ImageObject',
          url: siteLogo,
          width: 192,
          height: 192,
        },
        image: siteLogo,
        email: 'support@cambocine.online',
        sameAs: [siteUrl],
      },
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        name: siteName,
        alternateName: ['Cambo Cine', 'CamboCine Movie Time', 'CamboCine Movie Booking'],
        url: siteUrl,
        description: siteDescription,
        inLanguage: 'en-KH',
        publisher: {
          '@id': `${siteUrl}/#organization`,
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: `${siteUrl}/movies?search={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'EntertainmentBusiness',
        '@id': `${siteUrl}/#cinema-booking`,
        name: siteName,
        url: siteUrl,
        image: `${siteUrl}/pwa-icon-512.png`,
        description: siteDescription,
        areaServed: {
          '@type': 'Country',
          name: 'Cambodia',
        },
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Phnom Penh',
          addressCountry: 'KH',
        },
        parentOrganization: {
          '@id': `${siteUrl}/#organization`,
        },
      },
    ],
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
