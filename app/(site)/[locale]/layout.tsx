import type { Metadata, Viewport } from 'next';
import { Be_Vietnam_Pro, Playfair_Display } from 'next/font/google';
import { notFound } from 'next/navigation';
import { CartDrawer } from '@/components/cart-drawer';
import { CartProvider } from '@/components/cart-provider';
import { FloatingChat } from '@/components/floating-chat';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { LocaleProvider } from '@/components/locale-provider';
import { RevealObserver, ScrollTop } from '@/components/motion';
import { getDictionary } from '@/lib/dictionaries';
import { alternatesFor } from '@/lib/seo';
import { site, zaloUrl } from '@/lib/site';
import { isLocale, locales } from '@/lib/types';
import '../../globals.css';

const display = Playfair_Display({ subsets: ['latin', 'vietnamese'], variable: '--font-playfair', weight: ['400', '500', '600'], style: ['normal', 'italic'], display: 'swap' });
const sans = Be_Vietnam_Pro({ subsets: ['latin', 'vietnamese'], variable: '--font-bevn', weight: ['300', '400', '500', '600'], display: 'swap' });

// Content pages (about, stores, policies…) are prerendered at build for both locales. Pages that read MongoDB
// opt into request-time rendering themselves (`dynamic = 'force-dynamic'`), with their data cached in lib/catalog.ts.
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = { themeColor: '#4a3426' };

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);
  return {
    metadataBase: new URL(site.url),
    title: { default: t.meta.title, template: '%s | Seagull Helmets' },
    description: t.meta.description,
    alternates: alternatesFor(locale),
    openGraph: { siteName: site.name, type: 'website', locale: locale === 'vi' ? 'vi_VN' : 'en_US', images: ['/images/og.jpg'] },
    keywords: ['mũ bảo hiểm chính hãng', 'mũ fullface', 'mũ 3/4', 'mũ bảo hiểm cổ điển', 'mũ đi phượt', 'mũ bảo hiểm Tân Bình', 'Seagull helmets'],
  };
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const store = {
    '@context': 'https://schema.org',
    '@type': 'Store',
    name: site.name,
    url: `${site.url}/${locale}`,
    image: `${site.url}/images/og.jpg`,
    telephone: `+84${site.phone.slice(1)}`,
    address: { '@type': 'PostalAddress', streetAddress: site.address.street, addressLocality: site.address.ward, addressRegion: site.address.city, addressCountry: 'VN' },
    geo: { '@type': 'GeoCoordinates', latitude: site.geo.lat, longitude: site.geo.lng },
    sameAs: [site.facebookUrl, site.instagramUrl, zaloUrl],
  };

  return (
    <html lang={locale} className={`${display.variable} ${sans.variable}`} suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <LocaleProvider locale={locale}>
          <CartProvider>
            <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[80] focus:bg-paper focus:px-4 focus:py-2">
              {locale === 'vi' ? 'Bỏ qua đến nội dung' : 'Skip to content'}
            </a>
            <Header locale={locale} />
            <main id="main">{children}</main>
            <Footer locale={locale} />
            <FloatingChat locale={locale} />
            <ScrollTop />
            <RevealObserver />
            <CartDrawer />
          </CartProvider>
        </LocaleProvider>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(store) }} />
      </body>
    </html>
  );
}
