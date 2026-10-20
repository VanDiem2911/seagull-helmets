import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ByStyle, ByType } from '@/components/home';
import { PageHeader, SectionHeading } from '@/components/ui';
import { getDictionary } from '@/lib/dictionaries';
import { pageMeta } from '@/lib/seo';
import { isLocale } from '@/lib/types';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);
  return pageMeta(locale, '/collections', t.collections.title, t.collections.subtitle);
}

export default async function CollectionsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  return (
    <>
      <PageHeader kicker={t.home.byStyle.kicker} title={t.collections.title}>{t.collections.subtitle}</PageHeader>
      <section className="container-sg"><ByStyle locale={locale} /></section>
      <section className="container-sg mt-24">
        <SectionHeading kicker={t.home.byType.kicker} title={t.home.byType.title} />
        <ByType locale={locale} />
      </section>
    </>
  );
}
