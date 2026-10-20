import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ContactForm } from '@/components/contact-form';
import { PhoneIcon, PinIcon, ChatIcon } from '@/components/icons';
import { PageHeader } from '@/components/ui';
import { getDictionary } from '@/lib/dictionaries';
import { pageMeta } from '@/lib/seo';
import { mapsDirectionsUrl, mapsEmbedUrl, site, zaloUrl } from '@/lib/site';
import { isLocale } from '@/lib/types';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);
  return pageMeta(locale, '/stores', t.stores.title, `${site.address.full} · ${site.phoneDisplay}`);
}

export default async function StoresPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  return (
    <>
      <PageHeader kicker="Seagull Helmets" title={t.stores.title}>{t.home.visit.text}</PageHeader>
      <div className="container-sg grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
        <div>
          <dl className="space-y-7">
            <div className="flex gap-4"><PinIcon className="mt-1 shrink-0 text-saddle" /><div><dt className="label text-choc">{t.stores.address}</dt><dd className="mt-1.5 text-lg">{site.address.full}</dd></div></div>
            <div className="flex gap-4"><ChatIcon className="mt-1 shrink-0 text-saddle" /><div><dt className="label text-choc">{t.stores.hours}</dt><dd className="mt-1.5 text-lg">{site.hours[locale]}</dd></div></div>
            <div className="flex gap-4"><PhoneIcon className="mt-1 shrink-0 text-saddle" /><div><dt className="label text-choc">{t.stores.contact}</dt>
              <dd className="mt-1.5 space-y-1 text-lg">
                <p><a href={`tel:${site.phone}`} className="hover:text-saddle">{site.phoneDisplay}</a> · <a href={zaloUrl} target="_blank" rel="noopener noreferrer" className="hover:text-saddle">Zalo</a></p>
                <p className="text-base"><a href={site.facebookUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-saddle">Facebook</a></p>
              </dd></div></div>
          </dl>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={mapsDirectionsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary"><PinIcon width={16} height={16} /> {t.common.directions}</a>
            <a href={`tel:${site.phone}`} className="btn btn-ghost"><PhoneIcon width={16} height={16} /> {t.common.call}</a>
          </div>
        </div>
        <div className="frame">
          <iframe title="Google Maps – Seagull Helmets" src={mapsEmbedUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="block aspect-[4/3] w-full border-0 sepia-[.35]" allowFullScreen />
        </div>
      </div>

      <section className="container-sg mt-24 grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
        <h2 className="text-3xl sm:text-4xl">{t.stores.form.title}</h2>
        <ContactForm />
      </section>
    </>
  );
}
