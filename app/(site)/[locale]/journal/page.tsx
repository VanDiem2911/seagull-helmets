import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/ui';
import { getArticles } from '@/lib/catalog';
import { getDictionary } from '@/lib/dictionaries';
import { dateFmt } from '@/lib/format';
import { first, type SP } from '@/lib/qs';
import { pageMeta } from '@/lib/seo';
import { site, zaloUrl } from '@/lib/site';
import { isLocale, pick } from '@/lib/types';

// reads MongoDB, so render at request time (the catalog reads themselves are cached, see lib/catalog.ts)
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);
  return pageMeta(locale, '/journal', t.journal.title, t.journal.subtitle);
}

export default async function JournalPage({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<SP> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  const cat = first((await searchParams).cat);
  const articles = await getArticles(cat);
  const [lead, ...rest] = articles;

  return (
    <>
      <PageHeader kicker="Seagull Journal" title={t.journal.title}>{t.journal.subtitle}</PageHeader>
      <div className="container-sg">
        <nav className="flex flex-wrap gap-x-8 gap-y-2 border-b border-line pb-4" aria-label="Journal">
          {Object.entries(t.journal.categories).map(([k, label]) => {
            const active = (k === 'all' && !cat) || k === cat;
            return (
              <Link key={k} href={`/${locale}/journal${k === 'all' ? '' : `?cat=${k}`}`} aria-current={active ? 'true' : undefined} className={`label pb-1 ${active ? 'border-b border-saddle text-saddle' : 'text-choc/70 hover:text-saddle'}`}>{label}</Link>
            );
          })}
        </nav>

        {lead ? (
          <>
            <Link data-reveal href={`/${locale}/journal/${lead.slug}`} className="group mt-10 grid items-center gap-8 lg:grid-cols-[1.3fr_1fr] lg:gap-14">
              <div className="frame"><div className="frame-in relative aspect-[16/10]"><Image src={lead.cover} alt="" fill loading="eager" fetchPriority="high" quality={80} sizes="(min-width:1280px) 650px, (min-width:1024px) 60vw, 100vw" className="object-cover object-[50%_28%] transition duration-700 group-hover:scale-105" /></div></div>
              <div>
                <p className="label text-saddle">{t.journal.categories[lead.category]} · {dateFmt(lead.publishedAt, locale)}</p>
                <h2 className="mt-3 text-3xl group-hover:text-saddle sm:text-4xl">{pick(lead.title, locale)}</h2>
                <p className="mt-4 text-ink/75">{pick(lead.excerpt, locale)}</p>
                <span className="label mt-6 inline-block border-b border-choc pb-1 text-choc">{t.common.readMore} →</span>
              </div>
            </Link>

            <ul className="mt-16 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((a) => (
                <li key={a.slug} data-reveal>
                  <Link href={`/${locale}/journal/${a.slug}`} className="group block">
                    <div className="frame"><div className="frame-in relative aspect-[4/3]"><Image src={a.cover} alt="" fill sizes="(min-width:1280px) 380px, (min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" className="object-cover object-[50%_28%] transition duration-700 group-hover:scale-105" /></div></div>
                    <p className="label mt-4 text-saddle">{t.journal.categories[a.category]} · {dateFmt(a.publishedAt, locale)}</p>
                    <h2 className="mt-2 text-2xl group-hover:text-saddle">{pick(a.title, locale)}</h2>
                    <p className="mt-2 line-clamp-3 text-sm text-ink/70">{pick(a.excerpt, locale)}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="py-24 text-center text-ink/60">{t.common.noResults}</p>
        )}

        <aside className="mt-24 grid items-center gap-6 border-y border-choc/30 py-12 md:grid-cols-[1fr_auto]">
          <div>
            <h2 className="text-3xl">{t.journal.yours.title}</h2>
            <p className="mt-2 max-w-xl text-ink/75">{t.journal.yours.text}</p>
          </div>
          <a href={zaloUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">{t.journal.yours.cta} · {site.phoneDisplay}</a>
        </aside>
        {locale === 'en' && <p className="mt-6 text-xs text-ink/55">{t.journal.onlyVi}</p>}
      </div>
    </>
  );
}
