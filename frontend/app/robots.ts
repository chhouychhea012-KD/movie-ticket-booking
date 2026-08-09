import type { MetadataRoute } from 'next'

const siteUrl = 'https://cambocine.online'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/movies',
          '/about',
          '/contact',
          '/help',
          '/faqs',
          '/gift-cards',
          '/partners',
          '/press',
          '/careers',
          '/favicon-192x192.png',
          '/favicon-32x32.png',
          '/pwa-icon-192.png',
          '/pwa-icon-512.png',
          '/logo.png',
          '/logo-nav.png',
        ],
        disallow: [
          '/admin',
          '/admin/',
          '/api/',
          '/auth/',
          '/booking',
          '/bookings',
          '/payment',
          '/profile',
          '/tickets',
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  }
}
