import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getDictionary } from '@/lib/dictionaries';
import { pageMeta } from '@/lib/seo';
import { isLocale } from '@/lib/types';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);
  return pageMeta(locale, '/about', t.about.title, t.about.storyIntro[0]);
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  const a = t.about;
  return (
    <>
      <section>
        <div className="relative h-72 w-full bg-choc sm:h-96 lg:h-[34rem]">
          <Image src="/images/hero-v2.webp" alt="" fill loading="eager" fetchPriority="high" quality={80} sizes="100vw" className="object-cover object-[50%_60%]" />
        </div>
        <div className="container-sg pt-12 lg:pt-16">
          <h1 className="max-w-3xl text-4xl italic sm:text-5xl lg:text-6xl">{a.heroLine}</h1>
        </div>
      </section>

      <section data-reveal className="container-sg grid gap-10 pt-20 lg:grid-cols-[1fr_1.4fr] lg:gap-20 lg:pt-28">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl">{a.storyTitle}</h2>
        <div className="max-w-2xl space-y-5 text-lg leading-relaxed text-ink/80">
          {a.storyIntro.map((p) => <p key={p}>{p}</p>)}
          <blockquote className="border-l-2 border-brass pl-6 font-display text-2xl italic text-choc sm:text-3xl">“{a.storyQuote}”</blockquote>
        </div>
      </section>

      <section className="container-sg pt-24">
        <h2 className="mb-10 text-3xl sm:text-4xl">{a.timeline.title}</h2>
        <ol className="grid gap-10 border-t border-choc/40 pt-10 sm:grid-cols-3">
          {a.timeline.items.map((it) => (
            <li key={it.y} data-reveal>
              <p className="font-display text-5xl italic text-saddle">{it.y}</p>
              <p className="mt-3 max-w-xs text-ink/75">{it.t}</p>
            </li>
          ))}
        </ol>
        <p className="mt-8 text-xs text-ink/55">{a.timeline.note}</p>
      </section>

      <section className="container-sg pt-24">
        <ol className="grid gap-x-16 gap-y-14 md:grid-cols-2">
          {a.chapters.map((c) => (
            <li key={c.n} data-reveal className="border-t border-choc/40 pt-6">
              <div className="flex items-baseline gap-5">
                <span className="font-display text-5xl italic text-brass">{c.n}</span>
                <h3 className="text-2xl sm:text-3xl">{c.t}</h3>
              </div>
              <div className="mt-5 space-y-4 text-ink/80">
                {c.p.map((p) => <p key={p} className="leading-relaxed">{p}</p>)}
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section data-reveal className="container-sg pt-24 text-center">
        <p className="mx-auto max-w-2xl font-display text-3xl italic text-choc sm:text-4xl">{a.closing.line}</p>
        <p className="label mt-5 text-saddle">{a.closing.tag}</p>
      </section>
    </>
  );
}
