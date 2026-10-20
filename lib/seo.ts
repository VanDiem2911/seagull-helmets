import type { Metadata } from 'next';
import { site } from './site';
import type { Locale } from './types';

/** Canonical + hreflang alternates for a locale-less path like "/products/foo". */
export function alternatesFor(locale: Locale, path = ''): Metadata['alternates'] {
  return {
    canonical: `/${locale}${path}`,
    languages: { vi: `/vi${path}`, en: `/en${path}`, 'x-default': `/vi${path}` },
  };
}

export function pageMeta(locale: Locale, path: string, title: string, description: string, image?: string): Metadata {
  return {
    title,
    description,
    alternates: alternatesFor(locale, path),
    openGraph: {
      title,
      description,
      url: `/${locale}${path}`,
      siteName: site.name,
      locale: locale === 'vi' ? 'vi_VN' : 'en_US',
      type: 'website',
      images: [{ url: image ?? '/images/og.jpg' }],
    },
  };
}
