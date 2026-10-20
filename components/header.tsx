import Image from 'next/image';
import Link from 'next/link';
import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/types';
import { CartButton, HeaderShell, LangSwitch, MobileNav, NavLink, SearchBox } from './header-client';
import { PackageIcon } from './icons';

export function Header({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const links = [
    { href: `/${locale}`, label: t.nav.home },
    { href: `/${locale}/products`, label: t.nav.products },
    { href: `/${locale}/collections`, label: t.nav.collections },
    { href: `/${locale}/journal`, label: t.nav.journal },
    { href: `/${locale}/about`, label: t.nav.about },
  ];
  return (
    <HeaderShell locale={locale}>
      <div className="container-sg relative flex h-14 items-center justify-between gap-6 lg:h-[4.25rem]">
        <div className="flex items-center gap-10">
          {/* plain anchor on purpose: clicking the logo does a full reload of the home page */}
          <a href={`/${locale}`} aria-label="Seagull Helmets" className="block shrink-0">
            <Image src="/images/brand/logo-light.png" alt="Seagull Helmets" width={916} height={282} loading="eager" className="h-7 w-auto lg:h-8" />
          </a>
          <nav className="hidden items-center gap-7 lg:flex" aria-label="Main">
            {links.map((l) => (
              <NavLink key={l.href} href={l.href} className="nav-ink label link-underline whitespace-nowrap pb-1 !tracking-[0.15em]">
                {l.label}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="flex items-center">
          <SearchBox />
          <Link href={`/${locale}/track`} className="nav-ink hidden p-2 sm:block" aria-label={t.nav.track}>
            <PackageIcon />
          </Link>
          <LangSwitch className="nav-ink hidden lg:inline-flex" />
          <CartButton />
          <MobileNav links={links} />
        </div>
      </div>
    </HeaderShell>
  );
}
