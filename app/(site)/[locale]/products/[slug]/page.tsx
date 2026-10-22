import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ProductCard } from '@/components/product-card';
import { ProductHero } from '@/components/product-hero';
import { ReviewForm } from '@/components/review-form';
import { StarIcon } from '@/components/icons';
import { Tabs } from '@/components/tabs';
import { Breadcrumb, SectionHeading } from '@/components/ui';
import { getAccessories, getProduct, getRelated, getReviews } from '@/lib/catalog';
import { getDictionary } from '@/lib/dictionaries';
import { dateFmt } from '@/lib/format';
import { pageMeta } from '@/lib/seo';
import { site } from '@/lib/site';
import { isLocale, pick } from '@/lib/types';

// reads MongoDB, so render at request time (the catalog reads themselves are cached, see lib/catalog.ts)
export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const p = await getProduct(slug).catch(() => null);
  if (!p) return {};
  const name = pick(p.name, locale);
  return pageMeta(locale, `/products/${slug}`, `${name} (${p.code})`, pick(p.summary, locale), p.colors[0].image);
}

export default async function ProductPage({ params }: Props) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const product = await getProduct(slug);
  if (!product) notFound();
  const t = getDictionary(locale);
  const [reviews, related, accessories] = await Promise.all([getReviews(slug), getRelated(product, 4), getAccessories(3)]);
  const pairWith = product.type === 'accessory' ? [] : accessories;
  const name = pick(product.name, locale);
  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
  const features = locale === 'en' && product.features.en?.length ? product.features.en : product.features.vi;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    sku: product.code,
    description: pick(product.summary, locale),
    image: product.colors.map((c) => `${site.url}${c.image}`),
    brand: { '@type': 'Brand', name: 'Seagull' },
    offers: { '@type': 'Offer', priceCurrency: 'VND', price: product.price, availability: 'https://schema.org/InStock', url: `${site.url}/${locale}/products/${slug}` },
    ...(reviews.length ? { aggregateRating: { '@type': 'AggregateRating', ratingValue: avg.toFixed(1), reviewCount: reviews.length } } : {}),
  };

  return (
    <>
      <div className="container-sg pt-8">
        <Breadcrumb items={[{ label: t.nav.home, href: `/${locale}` }, { label: t.products.title, href: `/${locale}/products` }, { label: t.types[product.type], href: `/${locale}/products?type=${product.type}` }, { label: name }]} />
      </div>

      <section className="container-sg pt-8 lg:pt-10">
        <ProductHero product={product} />
      </section>

      <section data-reveal className="container-sg mt-20 lg:mt-28">
        <Tabs
          tabs={[
            {
              id: 'desc',
              label: t.product.tabs.description,
              content: (
                <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
                  <p className="max-w-prose text-lg leading-relaxed text-ink/80">{pick(product.summary, locale)}</p>
                  <ul className="space-y-3">
                    {features.map((f) => (
                      <li key={f} className="flex gap-3 border-b border-line pb-3 text-sm"><span className="mt-2 h-1.5 w-1.5 shrink-0 rotate-45 bg-brass" />{f}</li>
                    ))}
                  </ul>
                </div>
              ),
            },
            {
              id: 'specs',
              label: t.product.tabs.specs,
              content: (
                <dl className="max-w-2xl divide-y divide-line border-y border-line text-sm">
                  <div className="grid grid-cols-[10rem_1fr] gap-4 py-3"><dt className="label text-choc">{t.product.code}</dt><dd>{product.code}</dd></div>
                  {product.specs.map((s) => (
                    <div key={s.label.vi} className="grid grid-cols-[10rem_1fr] gap-4 py-3"><dt className="label text-choc">{pick(s.label, locale)}</dt><dd>{pick(s.value, locale)}</dd></div>
                  ))}
                  <div className="grid grid-cols-[10rem_1fr] gap-4 py-3"><dt className="label text-choc">{t.common.color}</dt><dd>{product.colors.map((c) => pick(c.name, locale)).join(' · ')}</dd></div>
                  {product.sizes.length > 0 && <div className="grid grid-cols-[10rem_1fr] gap-4 py-3"><dt className="label text-choc">{t.common.size}</dt><dd>{product.sizes.join(' · ')}</dd></div>}
                </dl>
              ),
            },
            { id: 'safety', label: t.product.tabs.safety, content: <p className="max-w-prose leading-relaxed text-ink/80">{t.product.safetyText}</p> },
            { id: 'care', label: t.product.tabs.care, content: <p className="max-w-prose leading-relaxed text-ink/80">{t.product.careText}</p> },
          ]}
        />
      </section>

      {product.story && (
        <section data-reveal className="container-sg mt-24 lg:mt-32">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
            <div className="frame"><div className="frame-in relative aspect-[4/3]"><Image src={product.story.image} alt={name} fill sizes="(min-width:1280px) 560px, (min-width:1024px) 50vw, 100vw" className="object-cover" /></div></div>
            <div>
              <p className="label mb-4 text-saddle">No. {product.code}</p>
              <h2 className="text-3xl sm:text-4xl">{t.product.story}</h2>
              <p className="mt-5 max-w-md text-lg leading-relaxed text-ink/80">{pick(product.story.text, locale)}</p>
            </div>
          </div>
        </section>
      )}

      <section data-reveal className="container-sg mt-24 lg:mt-32" aria-labelledby="reviews">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          <div>
            <SectionHeading title={t.product.reviews} />
            {reviews.length === 0 ? (
              <p className="text-ink/70">{t.product.noReviews}</p>
            ) : (
              <ul className="divide-y divide-line">
                {reviews.map((r) => (
                  <li key={r._id} className="py-5">
                    <div className="flex items-center gap-3">
                      <span className="flex text-brass" aria-label={`${r.rating}/5`}>{[1, 2, 3, 4, 5].map((n) => <StarIcon key={n} filled={n <= r.rating} width={16} height={16} />)}</span>
                      <span className="label text-choc">{r.name}</span>
                      <span className="text-xs text-ink/50">{dateFmt(r.createdAt, locale)}</span>
                    </div>
                    <p className="mt-2 max-w-prose text-ink/80">{r.text}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <ReviewForm productSlug={product.slug} />
        </div>
      </section>

      {pairWith.length > 0 && (
        <section className="container-sg mt-24 lg:mt-32">
          <SectionHeading title={t.product.pairWith} />
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
            {pairWith.map((p) => <ProductCard key={p.slug} product={p} locale={locale} />)}
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="container-sg mt-24 lg:mt-32">
          <SectionHeading title={t.product.related} />
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
            {related.map((p) => <ProductCard key={p.slug} product={p} locale={locale} />)}
          </div>
        </section>
      )}

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
