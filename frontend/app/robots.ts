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
