import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://drivestack.io';
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/overview/', '/settings/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
