
import { MetadataRoute } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://fitcv.in';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/editor/', '/settings', '/login', '/signup', '/forgot-password'],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
