import Image from 'next/image';
import Link from 'next/link';
import { getDictionary } from '@/lib/dictionaries';
import { policySlugs } from '@/lib/policies';
import { site, zaloUrl } from '@/lib/site';
import type { Locale } from '@/lib/types';
import { Newsletter } from './newsletter';

export function Footer({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const h = (p: string) => `/${locale}${p}`;
  return (
    <footer className="mt-24 bg-choc text-cream/85">
      <div className="container-sg grid gap-12 py-16 lg:grid-cols-[1.3fr_1fr_1fr_1.3fr]">
        <div>
          <Image src="/images/brand/logo-light.png" alt="Seagull Helmets" width={916} height={282} className="h-14 w-auto" />
          <p className="mt-5 font-display text-2xl italic text-cream">{t.footer.tagline}</p>
          <address className="mt-6 space-y-1 text-sm not-italic leading-relaxed">
            <p>{site.address.full}</p>
            <p>
              <a href={`tel:${site.phone}`} className="hover:text-brass">{site.phoneDisplay}</a> · <a href={zaloUrl} className="hover:text-brass" target="_blank" rel="noopener noreferrer">Zalo</a>
            </p>
            <p><a href={`mailto:${site.email}`} className="hover:text-brass">{site.email}</a></p>
          </address>
          <p className="label mt-6 text-cream/50">{t.footer.customer} · {site.customerCode}</p>
        </div>

        <div>
          <h2 className="label !font-sans !text-brass">{t.footer.shop}</h2>
          <ul className="mt-5 space-y-2.5 text-sm">
            <li><Link className="hover:text-brass" href={h('/products')}>{t.nav.products}</Link></li>
            <li><Link className="hover:text-brass" href={h('/collections')}>{t.nav.collections}</Link></li>
            <li><Link className="hover:text-brass" href={h('/journal')}>{t.nav.journal}</Link></li>
            <li><Link className="hover:text-brass" href={h('/about')}>{t.nav.about}</Link></li>
            <li><Link className="hover:text-brass" href={h('/stores')}>{t.stores.title}</Link></li>
            <li><Link className="hover:text-brass" href={h('/track')}>{t.nav.track}</Link></li>
          </ul>
        </div>

        <div>
          <h2 className="label !font-sans !text-brass">{t.footer.support}</h2>
          <ul className="mt-5 space-y-2.5 text-sm">
            {policySlugs.map((s) => (
              <li key={s}><Link className="hover:text-brass" href={h(`/policies/${s}`)}>{t.policies.list[s]}</Link></li>
            ))}
          </ul>
          <h2 className="label mt-8 !font-sans !text-brass">{t.footer.follow}</h2>
          <ul className="mt-4 flex gap-5 text-sm">
            <li><a className="hover:text-brass" href={site.facebookUrl} target="_blank" rel="noopener noreferrer">Facebook</a></li>
            <li><a className="hover:text-brass" href={zaloUrl} target="_blank" rel="noopener noreferrer">Zalo</a></li>
            <li><a className="hover:text-brass" href={site.instagramUrl} target="_blank" rel="noopener noreferrer">Instagram</a></li>
          </ul>
        </div>

        <div>
          <h2 className="label !font-sans !text-brass">{t.footer.newsletter.title}</h2>
          <p className="mt-5 text-sm leading-relaxed">{t.footer.newsletter.text}</p>
          <Newsletter />
        </div>
      </div>
      <div className="border-t border-cream/15">
        <div className="container-sg flex flex-col items-center justify-between gap-2 py-6 text-xs text-cream/55 sm:flex-row">
          <p>© {new Date().getFullYear()} Seagull Helmets Việt Nam. {t.footer.rights}</p>
          <p className="label">68 Út Tịch · TP.HCM</p>
        </div>
      </div>
    </footer>
  );
}
