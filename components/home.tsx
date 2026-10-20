import Image from 'next/image';
import Link from 'next/link';
import { getDictionary } from '@/lib/dictionaries';
import { site, mapsDirectionsUrl, zaloUrl } from '@/lib/site';
import { pad2 } from '@/lib/format';
import { helmetTypes, ridingStyles, type Locale } from '@/lib/types';
import { ArrowIcon, ChatIcon, PhoneIcon, PinIcon, ShieldIcon, SwapIcon, TagIcon } from './icons';

export function Hero({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  // The photo is shown untouched (no dimming overlay). The empty wall on its left holds the copy on large screens;
  // on phones the copy sits right under the photo instead.
  return (
    <section className="relative isolate bg-cream lg:max-h-[100svh] lg:min-h-[34rem] lg:overflow-hidden" aria-labelledby="hero-title">
      <div className="relative aspect-[4/3] w-full sm:aspect-[16/9] lg:aspect-[1920/1000] lg:max-h-[100svh]">
        <Image src="/images/hero-v2.webp" alt="Seagull Flying Tigers helmets" fill loading="eager" fetchPriority="high" quality={90} sizes="100vw" className="animate-hero object-cover object-[68%_center]" />
      </div>
      <div className="px-5 py-10 sm:px-8 lg:absolute lg:inset-0 lg:flex lg:items-center lg:p-0">
        {/* on large screens the copy stays inside the empty wall at the left of the photo, clear of the helmets */}
        <div className="lg:ml-[3vw] lg:w-[19vw]" data-reveal>
          <h1 id="hero-title" className="whitespace-pre-line text-[3rem] italic leading-[1.04] sm:text-6xl lg:text-[clamp(1.9rem,3.1vw,4.2rem)] lg:!text-cream lg:[text-shadow:0_2px_28px_rgba(0,0,0,.75)]">{t.hero.title}</h1>
          <p className="mt-5 max-w-sm text-base text-ink/80 lg:mt-[1.4vw] lg:text-[clamp(.78rem,1.05vw,1.1rem)] lg:leading-snug lg:text-cream lg:[text-shadow:0_1px_16px_rgba(0,0,0,.9)]">{t.hero.subtitle}</p>
        </div>
      </div>
    </section>
  );
}

// Real photos from the shop's shoot. Accessories stay reachable from the shop filters, not from this row.
const byType: { type: 'fullface' | 'three-quarter' | 'half' | 'classic'; image: string; pos: string }[] = [
  { type: 'fullface', image: '/images/photo/street-1.webp', pos: 'object-[50%_22%]' },
  { type: 'three-quarter', image: '/images/photo/store-4.webp', pos: 'object-[50%_30%]' },
  { type: 'half', image: '/images/photo/store-2.webp', pos: 'object-[50%_28%]' },
  { type: 'classic', image: '/images/photo/vespa-3.webp', pos: 'object-[50%_22%]' },
];

export function ByType({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  return (
    <ul data-reveal-stagger className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
      {byType.map(({ type, image, pos }) => (
        <li key={type} data-reveal>
          <Link href={`/${locale}/products?type=${type}`} className="group relative isolate block aspect-[4/5] overflow-hidden bg-choc">
            <Image src={image} alt="" fill sizes="(min-width:1024px) 25vw, 50vw" quality={90} className={`-z-20 object-cover transition duration-700 group-hover:scale-105 ${pos}`} />
            <div className="absolute inset-x-0 bottom-0 -z-10 h-1/3 bg-gradient-to-t from-choc/70 via-choc/25 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-4 text-cream sm:p-6">
              <h3 className="text-3xl italic !text-cream sm:text-4xl">{t.types[type]}</h3>
              <span className="mt-3 block h-px w-10 bg-brass transition-all duration-300 group-hover:w-20" />
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}

const styleImage: Record<(typeof ridingStyles)[number], { src: string; pos: string }> = {
  city: { src: '/images/photo/street-2.webp', pos: 'object-[50%_35%]' },
  touring: { src: '/images/photo/cafe-1.webp', pos: 'object-[50%_30%]' },
  vintage: { src: '/images/photo/vespa-1.webp', pos: 'object-[50%_40%]' },
};

export function ByStyle({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  return (
    <div data-reveal-stagger className="grid gap-5 lg:grid-cols-3">
      {ridingStyles.map((s, i) => (
        <Link key={s} data-reveal href={`/${locale}/products?style=${s}`} className="group relative isolate block aspect-[4/3] overflow-hidden bg-choc lg:aspect-[3/4]">
          <Image src={styleImage[s].src} alt="" fill sizes="(min-width:1024px) 33vw, 100vw" quality={90} className={`-z-20 object-cover transition duration-700 group-hover:scale-105 ${styleImage[s].pos}`} />
          <div className="absolute inset-x-0 bottom-0 -z-10 h-2/5 bg-gradient-to-t from-choc/75 via-choc/25 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-7 text-cream">
            <h3 className="text-4xl italic !text-cream">{t.styles[s]}</h3>
            <p className="mt-2 max-w-xs text-sm text-cream/80">{t.styleBlurb[s]}</p>
            <span className="label mt-5 inline-flex items-center gap-2 border-b border-cream/60 pb-1">{t.collections.shop} <ArrowIcon width={16} height={16} className="transition-transform group-hover:translate-x-1" /></span>
          </div>
        </Link>
      ))}
    </div>
  );
}

export function Story({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  return (
    <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-20">
      <div data-reveal="left" className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden lg:max-w-none">
        <Image src="/images/photo/vespa-2.webp" alt="Seagull Helmets" fill quality={90} sizes="(min-width:1024px) 50vw, 100vw" className="object-cover object-[50%_45%]" />
      </div>
      <div data-reveal="right">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl">{t.home.story.title}</h2>
        <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink/80">{t.home.story.text}</p>
        <Link href={`/${locale}/about`} className="btn btn-ghost mt-8">{t.common.readMore}</Link>
      </div>
    </div>
  );
}

const lookbook: { src: string; cap: string; pos: string }[] = [
  { src: '/images/photo/river-1.webp', cap: 'Riverside · Fullface', pos: 'object-[50%_35%]' },
  { src: '/images/photo/store-5.webp', cap: 'In store · Half helmet', pos: 'object-[50%_30%]' },
  { src: '/images/photo/cafe-3.webp', cap: 'Café racer', pos: 'object-[50%_30%]' },
  { src: '/images/photo/street-3.webp', cap: 'City · White full-face', pos: 'object-[50%_25%]' },
  { src: '/images/photo/store-1.webp', cap: 'In store · Vintage visor', pos: 'object-[50%_28%]' },
  { src: '/images/photo/cafe-4.webp', cap: 'Ride together', pos: 'object-[50%_30%]' },
  { src: '/images/photo/river-3.webp', cap: 'On the road', pos: 'object-[50%_28%]' },
  { src: '/images/photo/dark-1.webp', cap: 'Low key', pos: 'object-[68%_center]' },
];

// Two big photos per row, staggered up/down and tilted a little, like prints pinned to a wall.
const tilt = ['-1.4deg', '1.2deg', '1deg', '-1.5deg', '-1.1deg', '1.5deg', '1.3deg', '-1deg'];

export function Lookbook() {
  return (
    <ul className="grid grid-cols-1 gap-x-8 gap-y-10 pb-16 sm:grid-cols-2 md:gap-x-14 md:gap-y-14 lg:gap-x-20">
      {lookbook.map((l, i) => {
        const rightColumn = i % 2 === 1;
        const row = Math.floor(i / 2);
        const lower = rightColumn === (row % 2 === 0); // alternate which side sits lower each row
        return (
          <li key={l.src} data-reveal="zoom" className={lower ? 'sm:mt-20' : ''}>
            <div
              className="relative aspect-[4/5] overflow-hidden bg-choc shadow-[0_22px_44px_-22px_rgba(74,52,38,.55)] transition-transform duration-500 md:[transform:rotate(var(--r))] md:hover:[transform:rotate(0deg)_scale(1.02)]"
              style={{ '--r': tilt[i % tilt.length] } as React.CSSProperties}
            >
              <Image src={l.src} alt={l.cap} fill sizes="(min-width:640px) 50vw, 100vw" quality={90} className={`object-cover ${l.pos}`} />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

const promiseIcons = [TagIcon, ShieldIcon, SwapIcon, ChatIcon];

export function Promises({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  return (
    <div className="border-y border-choc/30 py-10">
      <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-line">
        {t.home.promises.items.map((it, i) => {
          const Icon = promiseIcons[i];
          return (
            <li key={it.t} className="flex gap-4 lg:px-8 lg:first:pl-0">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-choc/40 text-saddle"><Icon width={22} height={22} /></span>
              <div>
                <h3 className="font-display text-xl">{it.t}</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink/70">{it.d}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function Visit({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  return (
    <div data-reveal className="grid overflow-hidden bg-choc text-cream lg:grid-cols-2">
      <div className="relative min-h-[22rem] lg:min-h-[30rem]">
        <Image src="/images/photo/store-3.webp" alt="Seagull Helmets store" fill quality={90} sizes="(min-width:1024px) 50vw, 100vw" className="object-cover object-[50%_30%]" />
      </div>
      <div className="p-8 sm:p-12 lg:p-16">
        <h2 className="text-3xl !text-cream sm:text-4xl">{t.home.visit.title}</h2>
        <p className="mt-4 max-w-md text-cream/80">{t.home.visit.text}</p>
        <dl className="mt-8 space-y-4 text-sm">
          <div className="flex gap-3"><PinIcon className="mt-0.5 shrink-0 text-brass" /><div><dt className="sr-only">{t.stores.address}</dt><dd>{site.address.full}</dd></div></div>
          <div className="flex gap-3"><ChatIcon className="mt-0.5 shrink-0 text-brass" /><div><dt className="sr-only">{t.stores.hours}</dt><dd>{site.hours[locale]}</dd></div></div>
        </dl>
        <div className="mt-9 flex flex-wrap gap-3">
          <a href={mapsDirectionsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-light"><PinIcon width={16} height={16} /> {t.common.directions}</a>
          <a href={`tel:${site.phone}`} className="btn border-cream/60 text-cream hover:bg-cream hover:text-choc"><PhoneIcon width={16} height={16} /> {site.phoneDisplay}</a>
          <a href={zaloUrl} target="_blank" rel="noopener noreferrer" className="btn border-cream/60 text-cream hover:bg-cream hover:text-choc">Zalo</a>
        </div>
      </div>
    </div>
  );
}
