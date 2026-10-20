'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useCart } from './cart-provider';
import { useT } from './locale-provider';
import { BagIcon, CloseIcon, GlobeIcon, MenuIcon, SearchIcon } from './icons';
import type { Locale } from '@/lib/types';

export function HeaderShell({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  const pathname = usePathname();
  const home = pathname === `/${locale}`;
  const [top, setTop] = useState(true);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const on = () => {
      setTop(window.scrollY < 24);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  const transparent = home && top;
  return (
    <header data-transparent={transparent} className={`site-header sticky top-0 z-40 border-b transition-colors duration-300 ${home ? '-mb-14 lg:-mb-[4.25rem]' : ''} ${transparent ? 'border-transparent bg-transparent' : 'border-choc bg-choc'}`}>
      {children}
      <div className="pointer-events-none absolute inset-x-0 bottom-[-1px] h-[2px] origin-left bg-brass" style={{ transform: `scaleX(${progress})` }} aria-hidden />
    </header>
  );
}

/** Nav link: underlines the current section; clicking the page you are already on scrolls smoothly back to the top. */
export function NavLink({ href, className, children }: { href: string; className?: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const { locale } = useT();
  const home = `/${locale}`;
  const active = pathname === href || (href !== home && pathname.startsWith(href + '/'));
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      onClick={(e) => {
        if (pathname === href) {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }}
      className={className}
    >
      {children}
    </Link>
  );
}

export function CartButton() {
  const { count, setOpen, ready } = useCart();
  const { t } = useT();
  return (
    <button type="button" onClick={() => setOpen(true)} className="nav-ink relative p-2" aria-label={`${t.nav.cart} (${count})`}>
      <BagIcon />
      {ready && count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 grid h-[1.15rem] min-w-[1.15rem] place-items-center rounded-full bg-brass px-1 text-[0.625rem] font-semibold text-ink">{count}</span>
      )}
    </button>
  );
}

export function LangSwitch({ className = '' }: { className?: string }) {
  const { locale } = useT();
  const pathname = usePathname();
  const router = useRouter();
  const other: Locale = locale === 'vi' ? 'en' : 'vi';
  const switchTo = () => {
    document.cookie = `sg_locale=${other}; path=/; max-age=31536000; samesite=lax`;
    const next = pathname.replace(/^\/(vi|en)(?=\/|$)/, `/${other}`);
    router.push(next + window.location.search);
  };
  return (
    <button type="button" onClick={switchTo} className={`label inline-flex items-center gap-1.5 p-2 text-choc hover:text-saddle ${className}`} aria-label={`Switch to ${other === 'en' ? 'English' : 'Tiếng Việt'}`} lang={other}>
      <GlobeIcon width={16} height={16} />
      <span className={locale === 'vi' ? 'font-semibold' : 'opacity-60'}>VI</span>
      <span className="opacity-40">/</span>
      <span className={locale === 'en' ? 'font-semibold' : 'opacity-60'}>EN</span>
    </button>
  );
}

export function SearchBox() {
  const { t, href } = useT();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (open) ref.current?.focus();
  }, [open]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  return (
    <>
      <button type="button" onClick={() => setOpen((v) => !v)} className="nav-ink p-2" aria-label={t.nav.search} aria-expanded={open}>
        <SearchIcon />
      </button>
      {open && (
        <div className="absolute inset-x-0 top-full z-40 border-b border-line bg-paper animate-fade">
          <form
            role="search"
            className="container-sg flex items-center gap-3 py-4"
            onSubmit={(e) => {
              e.preventDefault();
              const q = ref.current?.value.trim();
              setOpen(false);
              router.push(q ? `${href('/products')}?q=${encodeURIComponent(q)}` : href('/products'));
            }}
          >
            <SearchIcon className="shrink-0 text-saddle" />
            <input ref={ref} type="search" className="w-full bg-transparent py-1 font-display text-xl text-choc placeholder:text-choc/40 focus:outline-none" placeholder={t.search.placeholder} aria-label={t.nav.search} />
            <button type="button" onClick={() => setOpen(false)} className="p-1 text-choc" aria-label={t.common.close}><CloseIcon /></button>
          </form>
        </div>
      )}
    </>
  );
}

export function MobileNav({ links }: { links: { href: string; label: string }[] }) {
  const { t } = useT();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);
  return (
    <div className="lg:hidden">
      <button type="button" onClick={() => setOpen(true)} className="nav-ink p-2" aria-label={t.nav.menu} aria-expanded={open}>
        <MenuIcon />
      </button>
      {open && (
        <div className="fixed inset-0 z-50 bg-cream animate-fade" role="dialog" aria-modal="true" aria-label={t.nav.menu}>
          <div className="container-sg flex h-16 items-center justify-between">
            <span className="label text-choc/70">{t.nav.menu}</span>
            <button type="button" onClick={() => setOpen(false)} className="p-2 text-choc" aria-label={t.common.close}><CloseIcon /></button>
          </div>
          <nav className="container-sg mt-6 flex flex-col">
            {links.map((l, i) => (
              <Link key={l.href} href={l.href} className="flex items-baseline gap-4 border-b border-line py-5 font-display text-3xl text-choc">
                <span className="label text-saddle">No. {String(i + 1).padStart(2, '0')}</span>
                {l.label}
              </Link>
            ))}
            <div className="mt-6"><LangSwitch className="-ml-2" /></div>
          </nav>
        </div>
      )}
    </div>
  );
}
