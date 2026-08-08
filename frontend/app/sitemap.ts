import type { MetadataRoute } from 'next'

const siteUrl = 'https://movie-ticket-booking.online'

const routes: Array<{
  path: string
  priority: number
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']
}> = [
  { path: '/', priority: 1, changeFrequency: 'daily' },
  { path: '/movies', priority: 0.95, changeFrequency: 'daily' },
  { path: '/about', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/contact', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/help', priority: 0.55, changeFrequency: 'monthly' },
  { path: '/faqs', priority: 0.55, changeFrequency: 'monthly' },
  { path: '/gift-cards', priority: 0.5, changeFrequency: 'weekly' },
  { path: '/partners', priority: 0.45, changeFrequency: 'monthly' },
  { path: '/press', priority: 0.45, changeFrequency: 'monthly' },
  { path: '/careers', priority: 0.35, changeFrequency: 'monthly' },
  { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/terms', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/refunds', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/cookies', priority: 0.25, changeFrequency: 'yearly' },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return routes.map((route) => ({
    url: `${siteUrl}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }))
}
