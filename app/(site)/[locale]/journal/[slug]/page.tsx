import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ProductCard } from '@/components/product-card';
import { Breadcrumb, SectionHeading } from '@/components/ui';
import { getArticle, getArticles, getProductsBySlugs } from '@/lib/catalog';
import { getDictionary } from '@/lib/dictionaries';
import { dateFmt } from '@/lib/format';
import { pageMeta } from '@/lib/seo';
import { site, zaloUrl } from '@/lib/site';
import { isLocale, pick } from '@/lib/types';

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const a = await getArticle(slug).catch(() => null);
  if (!a) return {};
  return pageMeta(locale, `/journal/${slug}`, pick(a.title, locale), pick(a.excerpt, locale), a.cover);
}

export default async function ArticlePage({ params }: Props) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const article = await getArticle(slug);
  if (!article) notFound();
  const t = getDictionary(locale);
  const [products, others] = await Promise.all([getProductsBySlugs(article.productSlugs), getArticles(undefined, 4)]);
  const more = others.filter((a) => a.slug !== slug).slice(0, 3);
  const title = pick(article.title, locale);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    image: `${site.url}${article.cover}`,
    datePublished: article.publishedAt,
    publisher: { '@type': 'Organization', name: site.name },
  };

  return (
    <article>
      <div className="relative h-64 w-full bg-choc sm:h-96 lg:h-[30rem]">
        <Image src={article.cover} alt="" fill loading="eager" sizes="100vw" quality={90} className="object-cover object-[50%_30%]" />
      </div>
      <div className="container-sg pt-10 lg:pt-14">
        <Breadcrumb items={[{ label: t.nav.home, href: `/${locale}` }, { label: t.journal.title, href: `/${locale}/journal` }, { label: t.journal.categories[article.category] }]} />
        <h1 className="mt-6 max-w-3xl text-4xl italic sm:text-5xl lg:text-6xl">{title}</h1>
        <p className="label mt-5 text-saddle">{t.journal.categories[article.category]} · {dateFmt(article.publishedAt, locale)}</p>
      </div>

      <div className="container-sg">
        <div className="prose-sg mx-auto max-w-2xl py-14 text-lg text-ink/85">
          <p className="!mt-0 font-display text-2xl italic text-choc">{pick(article.excerpt, locale)}</p>
          {article.body.map((b, i) => {
            if (b.kind === 'h2') return <h2 key={i}>{(locale === 'en' && b.en) || b.vi}</h2>;
            if (b.kind === 'quote') return <blockquote key={i} className="my-10 border-l-2 border-brass pl-6 font-display text-2xl italic text-choc">{(locale === 'en' && b.en) || b.vi}</blockquote>;
            if (b.kind === 'img' && b.src) return <div key={i} className="frame -mx-0 my-10 sm:-mx-16"><div className="frame-in relative aspect-[16/10]"><Image src={b.src} alt="" fill sizes="(min-width:768px) 48rem, 100vw" className="object-cover" /></div></div>;
            return <p key={i}>{(locale === 'en' && b.en) || b.vi}</p>;
          })}
          {locale === 'en' && !article.title.en && <p className="text-sm text-ink/55">{t.journal.onlyVi}</p>}
        </div>
      </div>

      {products.length > 0 && (
        <section className="container-sg border-t border-line pt-16">
          <SectionHeading title={t.journal.featuredIn} />
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
            {products.map((p) => <ProductCard key={p.slug} product={p} locale={locale} />)}
          </div>
        </section>
      )}

      <section className="container-sg mt-20">
        <div className="grid items-center gap-6 border-y border-choc/30 py-10 md:grid-cols-[1fr_auto]">
          <div><h2 className="text-2xl sm:text-3xl">{t.journal.yours.title}</h2><p className="mt-2 max-w-xl text-ink/75">{t.journal.yours.text}</p></div>
          <a href={zaloUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">{t.journal.yours.cta}</a>
        </div>
      </section>

      {more.length > 0 && (
        <section className="container-sg mt-20">
          <SectionHeading title={t.journal.related} />
          <ul className="grid gap-8 sm:grid-cols-3">
            {more.map((a) => (
              <li key={a.slug}>
                <Link href={`/${locale}/journal/${a.slug}`} className="group block">
                  <div className="frame"><div className="frame-in relative aspect-[4/3]"><Image src={a.cover} alt="" fill sizes="(min-width:640px) 30vw, 100vw" className="object-cover object-[50%_28%] transition duration-700 group-hover:scale-105" /></div></div>
                  <h3 className="mt-3 text-xl group-hover:text-saddle">{pick(a.title, locale)}</h3>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </article>
  );
}
