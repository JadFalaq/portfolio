import type { MetadataRoute } from 'next'
import { caseStudySlugs } from '../data/content'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.jadfalaq.online'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    ...caseStudySlugs.map((slug) => ({
      url: `${siteUrl}/projects/${slug}/`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]
}
