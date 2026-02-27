
import { MetadataRoute } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:9002';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/editor/', '/api/'],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
