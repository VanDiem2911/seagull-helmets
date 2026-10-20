import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/ui';
import { getDictionary } from '@/lib/dictionaries';
import { getPolicy, policySlugs } from '@/lib/policies';
import { pageMeta } from '@/lib/seo';
import { isLocale } from '@/lib/types';

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return (['vi', 'en'] as const).flatMap((locale) => policySlugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale) || !getPolicy(slug, locale)) return {};
  const t = getDictionary(locale);
  const title = t.policies.list[slug as keyof typeof t.policies.list];
  return pageMeta(locale, `/policies/${slug}`, title, getPolicy(slug, locale)![0].p[0]);
}

export default async function PolicyPage({ params }: Props) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const sections = getPolicy(slug, locale);
  if (!sections) notFound();
  const t = getDictionary(locale);
  const title = t.policies.list[slug as keyof typeof t.policies.list];

  return (
    <div className="container-sg grid gap-12 pt-12 lg:grid-cols-[16rem_1fr] lg:gap-20 lg:pt-16">
      <nav aria-label={t.policies.title} className="lg:sticky lg:top-28 lg:self-start">
        <p className="label mb-4 text-saddle">{t.policies.title}</p>
        <ul className="space-y-1 border-l border-line">
          {policySlugs.map((s) => (
            <li key={s}><Link href={`/${locale}/policies/${s}`} aria-current={s === slug ? 'page' : undefined} className={`-ml-px block border-l py-2 pl-4 text-sm ${s === slug ? 'border-saddle font-medium text-saddle' : 'border-transparent text-ink/70 hover:text-saddle'}`}>{t.policies.list[s]}</Link></li>
          ))}
        </ul>
      </nav>
      <article className="max-w-2xl pb-8">
        <Breadcrumb items={[{ label: t.nav.home, href: `/${locale}` }, { label: t.policies.title }, { label: title }]} />
        <h1 className="mt-5 text-4xl sm:text-5xl">{title}</h1>
        <div className="mt-10 space-y-10">
          {sections.map((s) => (
            <section key={s.h}>
              <h2 className="text-2xl">{s.h}</h2>
              {s.p.map((p) => <p key={p} className="mt-3 leading-relaxed text-ink/80">{p}</p>)}
            </section>
          ))}
        </div>
      </article>
    </div>
  );
}
