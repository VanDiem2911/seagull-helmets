import Link from 'next/link';
import { getDictionary } from '@/lib/dictionaries';
import { first, withParams, type SP } from '@/lib/qs';
import { colorFamilies, helmetTypes, ridingStyles, type Locale } from '@/lib/types';
import { FilterIcon } from './icons';

const swatch: Record<string, string> = {
  black: '#1e1a17', white: '#f4f1ea', grey: '#8e9196', red: '#b3302a', blue: '#25406e', green: '#5f6a52',
  pink: '#e5a3b4', brown: '#5a3a2c', yellow: '#c99a2e', purple: '#7b5ca8', beige: '#d9c9a9',
};
const sizeList = ['S', 'M', 'L', 'XL'];
const priceKeys = ['0-1500000', '1500000-3000000', '3000000-99999999'] as const;

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="border-t border-line py-5 first:border-t-0 first:pt-0">
      <legend className="label mb-3 text-choc">{title}</legend>
      {children}
    </fieldset>
  );
}

function Option({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link href={href} scroll={false} aria-current={active ? 'true' : undefined} className={`flex items-center justify-between py-1.5 text-sm transition ${active ? 'font-semibold text-saddle' : 'text-ink/80 hover:text-saddle'}`}>
      <span className="flex items-center gap-2">
        <span className={`grid h-3.5 w-3.5 place-items-center border ${active ? 'border-saddle bg-saddle' : 'border-choc/40'}`} aria-hidden>
          {active && <span className="h-1.5 w-1.5 bg-paper" />}
        </span>
        {children}
      </span>
    </Link>
  );
}

function Panel({ locale, sp }: { locale: Locale; sp: SP }) {
  const t = getDictionary(locale);
  const base = `/${locale}/products`;
  const cur = (k: string) => first(sp[k]);
  const toggle = (k: string, v: string) => `${base}${withParams(sp, { [k]: cur(k) === v ? undefined : v })}`;
  const hasFilters = ['type', 'style', 'color', 'size', 'price', 'q'].some((k) => cur(k));
  return (
    <div>
      <Group title={t.products.filters.type}>
        {helmetTypes.map((v) => <Option key={v} href={toggle('type', v)} active={cur('type') === v}>{t.types[v]}</Option>)}
      </Group>
      <Group title={t.products.filters.style}>
        {ridingStyles.map((v) => <Option key={v} href={toggle('style', v)} active={cur('style') === v}>{t.styles[v]}</Option>)}
      </Group>
      <Group title={t.products.filters.color}>
        <div className="flex flex-wrap gap-2.5">
          {colorFamilies.map((v) => (
            <Link key={v} href={toggle('color', v)} scroll={false} title={t.products.colors[v]} aria-label={t.products.colors[v]} aria-current={cur('color') === v ? 'true' : undefined}
              className={`h-7 w-7 rounded-full border-2 ${cur('color') === v ? 'border-saddle ring-2 ring-saddle/30 ring-offset-2 ring-offset-cream' : 'border-choc/25'}`} style={{ background: swatch[v] }} />
          ))}
        </div>
      </Group>
      <Group title={t.products.filters.size}>
        <div className="flex flex-wrap gap-2">
          {sizeList.map((v) => (
            <Link key={v} href={toggle('size', v)} scroll={false} aria-current={cur('size') === v ? 'true' : undefined}
              className={`label border px-3.5 py-2 ${cur('size') === v ? 'border-saddle bg-saddle text-paper' : 'border-choc/30 text-choc hover:border-saddle'}`}>{v}</Link>
          ))}
        </div>
      </Group>
      <Group title={t.products.filters.price}>
        {priceKeys.map((v) => <Option key={v} href={toggle('price', v)} active={cur('price') === v}>{t.products.priceRanges[v]}</Option>)}
      </Group>
      {hasFilters && <Link href={base} className="label mt-2 inline-block border-b border-choc pb-0.5 text-choc">{t.common.clear}</Link>}
    </div>
  );
}

export function ProductFilters({ locale, sp }: { locale: Locale; sp: SP }) {
  const t = getDictionary(locale);
  return (
    <>
      {/* mobile: native <details> works without JS */}
      <details className="group mb-6 border border-line bg-paper lg:hidden">
        <summary className="label flex cursor-pointer list-none items-center gap-2 px-4 py-3.5 text-choc [&::-webkit-details-marker]:hidden">
          <FilterIcon width={18} height={18} /> {t.common.filter}
        </summary>
        <div className="border-t border-line p-4"><Panel locale={locale} sp={sp} /></div>
      </details>
      <aside className="sticky top-28 hidden self-start lg:block" aria-label={t.common.filter}>
        <Panel locale={locale} sp={sp} />
      </aside>
    </>
  );
}
