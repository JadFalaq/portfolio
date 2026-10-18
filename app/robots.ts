import type { MetadataRoute } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.jadfalaq.online'

export default function robots(): MetadataRoute.Robots {
  const isPreview = process.env.VERCEL_ENV === 'preview'
  return {
    rules: {
      userAgent: '*',
      ...(isPreview ? { disallow: '/' } : { allow: '/' }),
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
