import Image from 'next/image';
import Link from 'next/link';
import { getDictionary } from '@/lib/dictionaries';
import { money } from '@/lib/format';
import { pick, type Locale, type Product } from '@/lib/types';

export function ProductCard({ product, locale, priority = false, sizes = '(min-width:1024px) 25vw, 50vw' }: { product: Product; locale: Locale; priority?: boolean; sizes?: string }) {
  const t = getDictionary(locale);
  const first = product.colors[0];
  const second = product.colors[1];
  const shown = product.colors.slice(0, 6);
  const name = pick(product.name, locale);
  return (
    <article data-reveal className="group">
      <Link href={`/${locale}/products/${product.slug}`} className="block" aria-label={name}>
        <div className="frame">
          <div className="frame-in relative aspect-square bg-paper">
            <Image src={first.image} alt={`${name} – ${pick(first.name, locale)}`} fill sizes={sizes} loading={priority ? "eager" : undefined} className={`object-contain mix-blend-multiply transition duration-500 ${second ? 'group-hover:opacity-0' : ''}`} />
            {second && <Image src={second.image} alt="" aria-hidden fill sizes={sizes} className="object-contain opacity-0 mix-blend-multiply transition duration-500 group-hover:opacity-100" />}
          </div>
        </div>
        <div className="mt-4 px-1">
          <p className="label text-saddle">No. {product.code}</p>
          <h3 className="mt-1 font-display text-lg leading-snug text-choc group-hover:text-saddle sm:text-xl">{name}</h3>
          <div className="mt-2 flex items-center justify-between gap-3">
            <p className="text-sm font-medium tabular-nums text-ink">{money(product.price)}</p>
            <div className="flex items-center gap-1" aria-label={`${product.colors.length} ${t.products.colorsAvailable}`}>
              {shown.map((c) => (
                <span key={c.key} title={pick(c.name, locale)} className="h-3.5 w-3.5 rounded-full border border-choc/30" style={{ background: c.hex }} />
              ))}
              {product.colors.length > shown.length && <span className="text-[0.65rem] text-choc/60">+{product.colors.length - shown.length}</span>}
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
