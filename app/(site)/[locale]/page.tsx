import fs from 'node:fs';
import path from 'node:path';
import { notFound } from 'next/navigation';
import { ReelPlayer } from '@/components/reel';
import { ByStyle, ByType, Hero, Lookbook, Story, Visit } from '@/components/home';
import { ProductCard } from '@/components/product-card';
import { SectionHeading } from '@/components/ui';
import { getFeatured } from '@/lib/catalog';
import { getDictionary } from '@/lib/dictionaries';
import { isLocale } from '@/lib/types';

// reads MongoDB, so render at request time (the catalog reads themselves are cached, see lib/catalog.ts)
export const dynamic = 'force-dynamic';

// the brand clip is optional: it shows up once `npm run video` has produced public/videos/reel.mp4 (checked once per server start)
const hasReel = fs.existsSync(path.join(process.cwd(), 'public', 'videos', 'reel.mp4'));
const hasPoster = fs.existsSync(path.join(process.cwd(), 'public', 'videos', 'reel-poster.jpg'));

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  const featured = await getFeatured(8).catch(() => []);

  return (
    <>
      <Hero locale={locale} />

      {hasReel && (
        <section className="container-sg pt-16 lg:pt-24" aria-label="Video">
          <div data-reveal="zoom">
            <ReelPlayer src="/videos/reel.mp4" poster={hasPoster ? '/videos/reel-poster.jpg' : undefined} />
          </div>
        </section>
      )}

      <section className="container-sg pt-20 lg:pt-28" aria-labelledby="by-type">
        <SectionHeading kicker={t.home.byType.kicker} title={t.home.byType.title} href={`/${locale}/products`} hrefLabel={t.common.viewAll} />
        <ByType locale={locale} />
      </section>

      {featured.length > 0 && (
        <section className="container-sg pt-24 lg:pt-32" aria-labelledby="selection">
          <SectionHeading kicker={t.home.selection.kicker} title={t.home.selection.title} href={`/${locale}/products`} hrefLabel={t.common.viewAll} />
          <div data-reveal-stagger className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
            {featured.map((p, i) => (
              <ProductCard key={p.slug} product={p} locale={locale} priority={i < 4} />
            ))}
          </div>
        </section>
      )}

      <section className="container-sg pt-24 lg:pt-32">
        <SectionHeading kicker={t.home.byStyle.kicker} title={t.home.byStyle.title} />
        <ByStyle locale={locale} />
      </section>

      <section className="container-sg pt-28 lg:pt-36">
        <Story locale={locale} />
      </section>

      <section className="container-sg pt-28 lg:pt-36">
        <SectionHeading kicker={t.home.lookbook.kicker} title={t.home.lookbook.title} />
        <Lookbook />
      </section>

      <section className="container-sg pt-24 lg:pt-32">
        <Visit locale={locale} />
      </section>
    </>
  );
}
