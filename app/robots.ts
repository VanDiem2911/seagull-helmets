import type { MetadataRoute } from 'next';
import { site } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/api/', '/vi/checkout', '/en/checkout', '/vi/order/', '/en/order/'] },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
