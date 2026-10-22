import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ProductCard } from '@/components/product-card';
import { ProductFilters } from '@/components/product-filters';
import { Breadcrumb } from '@/components/ui';
import { getProducts } from '@/lib/catalog';
import { getDictionary } from '@/lib/dictionaries';
import { first, withParams, type SP } from '@/lib/qs';
import { pageMeta } from '@/lib/seo';
import { helmetTypes, isLocale, ridingStyles, type HelmetType, type RidingStyle } from '@/lib/types';

// reads MongoDB, so render at request time (the catalog reads themselves are cached, see lib/catalog.ts)
export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<SP> };

const typeBanner: Record<HelmetType, string> = {
  fullface: '/images/photo/river-1.webp',
  'three-quarter': '/images/hero-v2.webp',
  half: '/images/hero-v2.webp',
  classic: '/images/hero-v2.webp',
  accessory: '/images/hero-v2.webp',
};
const styleBanner: Record<RidingStyle, string> = { city: '/images/hero-v2.webp', touring: '/images/photo/river-1.webp', vintage: '/images/hero-v2.webp' };

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const sp = await searchParams;
  const t = getDictionary(locale);
  const type = first(sp.type) as HelmetType | undefined;
  const title = type && helmetTypes.includes(type) ? `${t.products.title} – ${t.types[type]}` : t.products.title;
  const meta = pageMeta(locale, '/products', title, t.products.intro);
  // filtered/sorted/paged views are not separate pages for search engines
  if (Object.keys(sp).length) meta.robots = { index: false, follow: true };
  return meta;
}

export default async function ProductsPage({ params, searchParams }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const sp = await searchParams;
  const t = getDictionary(locale);
  const page = Math.max(1, Number(first(sp.page)) || 1);
  const sort = first(sp.sort) ?? 'newest';
  const q = first(sp.q);
  const perPage = 9;

  const { items, total, pages } = await getProducts({
    type: first(sp.type), style: first(sp.style), color: first(sp.color), size: first(sp.size), price: first(sp.price), sort, q, page, perPage,
  });

  const type = first(sp.type) as HelmetType | undefined;
  const style = first(sp.style) as RidingStyle | undefined;
  const validType = type && helmetTypes.includes(type) ? type : undefined;
  const validStyle = style && ridingStyles.includes(style) ? style : undefined;
  const banner = validType ? typeBanner[validType] : validStyle ? styleBanner[validStyle] : '/images/hero-v2.webp';
  const heading = q ? `${t.products.searchResults} “${q}”` : validType ? t.types[validType] : validStyle ? t.styles[validStyle] : t.products.title;
  const blurb = validType ? t.typeBlurb[validType] : validStyle ? t.styleBlurb[validStyle] : t.products.intro;
  const href = (patch: Record<string, string | undefined>, keepPage = false) => `/${locale}/products${withParams(sp, patch, keepPage)}`;

  return (
    <>
      <section>
        <div className="relative h-44 w-full bg-choc sm:h-64 lg:h-80">
          <Image src={banner} alt="" fill loading="eager" fetchPriority="high" quality={80} sizes="100vw" className="object-cover object-[50%_62%]" />
        </div>
        <div className="container-sg pt-10 lg:pt-14">
          <Breadcrumb items={[{ label: t.nav.home, href: `/${locale}` }, { label: t.products.title, href: heading !== t.products.title ? `/${locale}/products` : undefined }, ...(heading !== t.products.title ? [{ label: heading }] : [])]} />
          <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl">{heading}</h1>
          <p className="mt-3 max-w-xl text-ink/75">{blurb}</p>
        </div>
      </section>

      <div className="container-sg mt-10 grid gap-x-12 lg:grid-cols-[14rem_1fr]">
        <ProductFilters locale={locale} sp={sp} />

        <div>
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4">
            <p className="label text-choc/70">{total} {t.common.items}</p>
            <nav aria-label={t.common.sort} className="flex flex-wrap items-center gap-x-5 gap-y-2">
              {Object.entries(t.products.sorts).map(([k, label]) => (
                <Link key={k} href={href({ sort: k === 'newest' ? undefined : k })} scroll={false} aria-current={sort === k ? 'true' : undefined} className={`label pb-1 ${sort === k ? 'border-b border-saddle text-saddle' : 'text-choc/70 hover:text-saddle'}`}>
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {items.length === 0 ? (
            <div className="py-24 text-center">
              <p className="font-display text-2xl text-choc">{t.common.noResults}</p>
              <Link href={`/${locale}/products`} className="btn btn-ghost mt-6">{t.common.clear}</Link>
            </div>
          ) : (
            <div data-reveal-stagger className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 xl:grid-cols-3">
              {items.map((p, i) => <ProductCard key={p.slug} product={p} locale={locale} priority={i < 3} sizes="(min-width:1280px) 300px, (min-width:1024px) calc(50vw - 190px), 50vw" />)}
              {items.length === perPage && (
                <Link href={`/${locale}/journal`} className="group relative isolate col-span-full block aspect-[16/7] overflow-hidden bg-choc">
                  <Image src="/images/rider.webp" alt="" fill sizes="(min-width:1280px) 930px, (min-width:1024px) calc(100vw - 350px), 100vw" className="-z-20 object-cover object-[50%_35%] transition duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 -z-10 bg-gradient-to-r from-choc/85 to-transparent" />
                  <div className="flex h-full flex-col justify-center p-8 sm:p-12">
                    <p className="label text-brass">Journal</p>
                    <p className="mt-2 text-3xl italic text-cream sm:text-5xl">{t.products.lifestyleTitle}</p>
                    <span className="label mt-5 inline-block w-max border-b border-cream/60 pb-1 text-cream">{t.products.lifestyleCta}</span>
                  </div>
                </Link>
              )}
            </div>
          )}

          {pages > 1 && (
            <nav className="mt-14 flex items-center justify-center gap-2" aria-label="Pagination">
              {page > 1 && <Link href={href({ page: String(page - 1) }, true)} className="label px-3 py-2 text-choc hover:text-saddle">← {t.common.prev}</Link>}
              {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
                <Link key={n} href={href({ page: n === 1 ? undefined : String(n) }, true)} aria-current={n === page ? 'page' : undefined} className={`label grid h-10 w-10 place-items-center border ${n === page ? 'border-saddle bg-saddle text-paper' : 'border-line text-choc hover:border-saddle'}`}>{n}</Link>
              ))}
              {page < pages && <Link href={href({ page: String(page + 1) }, true)} className="label px-3 py-2 text-choc hover:text-saddle">{t.common.next} →</Link>}
            </nav>
          )}
        </div>
      </div>
    </>
  );
}
