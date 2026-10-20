import Link from 'next/link';
import type { ReactNode } from 'react';
import { ArrowIcon } from './icons';

export function SectionHeading({ kicker, title, href, hrefLabel, align = 'left', light = false }: { kicker?: string; title: string; href?: string; hrefLabel?: string; align?: 'left' | 'center'; light?: boolean }) {
  return (
    <div data-reveal className={`mb-10 flex flex-wrap items-end justify-between gap-4 ${align === 'center' ? 'flex-col items-center text-center' : ''}`}>
      <div>
        <h2 className={`text-3xl sm:text-4xl lg:text-[2.6rem] ${light ? '!text-cream' : ''}`}>{title}</h2>
      </div>
      {href && hrefLabel && (
        <Link href={href} className={`label group inline-flex items-center gap-2 border-b pb-1 ${light ? 'border-cream/60 text-cream' : 'border-choc text-choc'}`}>
          {hrefLabel}
          <ArrowIcon width={16} height={16} className="transition-transform group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
}

/** Round "genuine" stamp with text on a circle, like a shop's rubber stamp. */
export function Stamp({ top = 'SEAGULL HELMETS', bottom = 'GENUINE · TAIWAN', center = 'S', className = '' }: { top?: string; bottom?: string; center?: string; className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} role="img" aria-label={`${top} ${bottom}`}>
      <defs>
        <path id="stamp-top" d="M 15 60 A 45 45 0 0 1 105 60" />
        <path id="stamp-bot" d="M 11 60 A 49 49 0 0 0 109 60" />
      </defs>
      <circle cx="60" cy="60" r="57" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <text fontSize="9.5" letterSpacing="2.6" fill="currentColor" fontFamily="var(--font-sans)" fontWeight="500">
        <textPath href="#stamp-top" startOffset="50%" textAnchor="middle">{top}</textPath>
      </text>
      <text fontSize="9.5" letterSpacing="2.6" fill="currentColor" fontFamily="var(--font-sans)" fontWeight="500">
        <textPath href="#stamp-bot" startOffset="50%" textAnchor="middle" dominantBaseline="hanging">{bottom}</textPath>
      </text>
      <text x="60" y="73" textAnchor="middle" fontSize="38" fill="currentColor" fontFamily="var(--font-display)" fontStyle="italic">{center}</text>
    </svg>
  );
}

export function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="label flex flex-wrap items-center gap-2 text-choc/60">
      {items.map((it, i) => (
        <span key={i} className="flex items-center gap-2">
          {it.href ? <Link href={it.href} className="hover:text-saddle">{it.label}</Link> : <span className="text-choc" aria-current="page">{it.label}</span>}
          {i < items.length - 1 && <span aria-hidden>/</span>}
        </span>
      ))}
    </nav>
  );
}

export function PageHeader({ kicker, title, children }: { kicker?: string; title: string; children?: ReactNode }) {
  return (
    <div className="container-sg pb-10 pt-12 lg:pt-16">
      <h1 className="max-w-3xl text-4xl sm:text-5xl lg:text-6xl">{title}</h1>
      {children && <div className="mt-5 max-w-2xl text-lg leading-relaxed text-ink/75">{children}</div>}
    </div>
  );
}
