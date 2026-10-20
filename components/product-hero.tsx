'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { money } from '@/lib/format';
import { site, zaloUrl } from '@/lib/site';
import { pick, type Product } from '@/lib/types';
import { useCart } from './cart-provider';
import { CheckIcon, CloseIcon, MinusIcon, PlusIcon } from './icons';
import { useT } from './locale-provider';

const sizeChart: [string, string][] = [['S', '54 – 55'], ['M', '56 – 57'], ['L', '58 – 59'], ['XL', '60 – 61'], ['XXL', '62 – 63']];

type GalleryItem = { kind: 'color' | 'story'; key: string; src: string; label: string };

function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  const { t } = useT();
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  return (
    <dialog ref={ref} onClose={onClose} onClick={(e) => e.target === ref.current && onClose()} aria-label={title} className="m-auto w-[min(92vw,34rem)] max-w-none bg-cream p-0 text-ink backdrop:bg-ink/55 backdrop:backdrop-blur-[2px]">
      <div className="flex items-center justify-between border-b border-line px-6 py-4">
        <h2 className="font-display text-2xl">{title}</h2>
        <button type="button" onClick={onClose} className="p-1" aria-label={t.common.close}><CloseIcon /></button>
      </div>
      <div className="p-6">{children}</div>
    </dialog>
  );
}

export function ProductHero({ product }: { product: Product }) {
  const { t, locale, href } = useT();
  const router = useRouter();
  const { add } = useCart();

  const items: GalleryItem[] = [
    ...product.colors.map((c) => ({ kind: 'color' as const, key: c.key, src: c.image, label: pick(c.name, locale) })),
    ...(product.story ? [{ kind: 'story' as const, key: 'story', src: product.story.image, label: pick(product.story.text, locale) }] : []),
  ];
  const [index, setIndex] = useState(0);
  const [colorKey, setColorKey] = useState(product.colors[0].key);
  const [size, setSize] = useState('');
  const [qty, setQty] = useState(1);
  const [error, setError] = useState(false);
  const [added, setAdded] = useState(false);
  const [guide, setGuide] = useState(false);
  const [zoom, setZoom] = useState(false);

  const color = product.colors.find((c) => c.key === colorKey) ?? product.colors[0];
  const current = items[index] ?? items[0];
  const needsSize = product.sizes.length > 0;
  const name = pick(product.name, locale);

  const pickColor = (key: string) => {
    setColorKey(key);
    const i = items.findIndex((it) => it.kind === 'color' && it.key === key);
    if (i >= 0) setIndex(i);
  };
  const pickItem = (i: number) => {
    setIndex(i);
    if (items[i].kind === 'color') setColorKey(items[i].key);
  };

  function submit(buyNow: boolean) {
    if (needsSize && !size) {
      setError(true);
      return;
    }
    add({ slug: product.slug, color: colorKey, size: needsSize ? size : '', qty }, !buyNow);
    if (buyNow) router.push(href('/checkout'));
    else {
      setAdded(true);
      setTimeout(() => setAdded(false), 1800);
    }
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
      {/* gallery */}
      <div className="flex flex-col-reverse gap-4 sm:flex-row lg:sticky lg:top-28 lg:self-start">
        <ul className="no-scrollbar flex gap-3 overflow-x-auto sm:max-h-[34rem] sm:flex-col sm:overflow-y-auto" aria-label="Gallery">
          {items.map((it, i) => (
            <li key={it.key} className="shrink-0">
              <button type="button" onClick={() => pickItem(i)} aria-label={it.kind === 'color' ? it.label : 'Story'} aria-current={i === index ? 'true' : undefined} className={`frame block w-16 sm:w-[4.5rem] ${i === index ? '!border-saddle' : 'opacity-80 hover:opacity-100'}`}>
                <span className="relative block aspect-square bg-paper">
                  <Image src={it.src} alt="" fill sizes="80px" className={it.kind === 'color' ? 'object-contain scale-125 mix-blend-multiply' : 'object-cover'} />
                </span>
              </button>
            </li>
          ))}
        </ul>
        <div className="frame min-w-0 flex-1">
          <button type="button" onClick={() => setZoom(true)} className="frame-in relative block aspect-square w-full cursor-zoom-in bg-paper" aria-label={t.product.zoom}>
            <Image key={current.src} src={current.src} alt={`${name} – ${current.kind === 'color' ? current.label : ''}`} fill loading="eager" sizes="(min-width:1024px) 50vw, 100vw" className={current.kind === 'color' ? 'object-contain mix-blend-multiply animate-fade' : 'object-cover animate-fade'} />
            <span className="label absolute bottom-3 right-3 bg-paper/90 px-2 py-1 text-choc">{t.product.zoom} +</span>
          </button>
        </div>
      </div>

      {/* buy box */}
      <div>
        <p className="label text-saddle">{t.product.code} {product.code}</p>
        <h1 className="mt-2 text-4xl sm:text-5xl">{name}</h1>
        <div className="mt-5 flex items-baseline gap-4">
          <p className="font-display text-3xl text-choc tabular-nums">{money(product.price)}</p>
          {product.comparePrice && <p className="text-lg text-ink/45 line-through tabular-nums">{money(product.comparePrice)}</p>}
        </div>
        <p className="mt-5 leading-relaxed text-ink/80">{pick(product.summary, locale)}</p>
        <hr className="rule my-7" />

        <div>
          <p className="label text-choc">{t.common.color}: <span className="ml-1 font-sans normal-case tracking-normal text-ink/70">{pick(color.name, locale)}</span></p>
          <div className="mt-3 flex flex-wrap gap-3" role="radiogroup" aria-label={t.common.color}>
            {product.colors.map((c) => (
              <button key={c.key} type="button" role="radio" aria-checked={c.key === colorKey} title={pick(c.name, locale)} aria-label={pick(c.name, locale)} onClick={() => pickColor(c.key)}
                className={`relative grid h-10 w-10 place-items-center rounded-full border-2 transition ${c.key === colorKey ? 'border-saddle ring-2 ring-saddle/30 ring-offset-2 ring-offset-cream' : 'border-choc/25 hover:border-saddle'}`}>
                <span className="h-7 w-7 rounded-full border border-black/10" style={{ background: c.hex }} />
              </button>
            ))}
          </div>
        </div>

        {needsSize && (
          <div className="mt-7">
            <div className="flex items-center justify-between">
              <p className="label text-choc">{t.common.size}</p>
              <button type="button" onClick={() => setGuide(true)} className="label border-b border-choc pb-0.5 text-choc hover:text-saddle">{t.common.sizeGuide}</button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2.5" role="radiogroup" aria-label={t.common.size}>
              {product.sizes.map((s) => (
                <button key={s} type="button" role="radio" aria-checked={s === size} onClick={() => { setSize(s); setError(false); }}
                  className={`label min-w-14 border px-4 py-3 transition ${s === size ? 'border-saddle bg-saddle text-paper' : 'border-choc/30 text-choc hover:border-saddle'}`}>{s}</button>
              ))}
            </div>
            {error && <p className="mt-2 text-sm text-[#a8261f]" role="alert">{t.common.chooseColorSize}</p>}
          </div>
        )}

        <div className="mt-7 flex items-center gap-4">
          <p className="label text-choc">{t.common.qty}</p>
          <div className="inline-flex items-center border border-choc/30">
            <button type="button" className="p-3" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="−"><MinusIcon width={16} height={16} /></button>
            <span className="w-10 text-center tabular-nums" aria-live="polite">{qty}</span>
            <button type="button" className="p-3" onClick={() => setQty((q) => Math.min(20, q + 1))} aria-label="+"><PlusIcon width={16} height={16} /></button>
          </div>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <button type="button" onClick={() => submit(false)} className="btn btn-primary">
            {added ? <><CheckIcon width={16} height={16} /> {t.common.added}</> : t.common.addToCart}
          </button>
          <button type="button" onClick={() => submit(true)} className="btn btn-ghost">{t.common.buyNow}</button>
        </div>
        <a href={zaloUrl} target="_blank" rel="noopener noreferrer" className="mt-3 flex items-center justify-center gap-2 border border-dashed border-saddle/60 py-3 text-sm text-saddle transition hover:bg-paper">
          <span className="grid h-6 w-6 place-items-center rounded-full bg-[#0068ff] text-[0.55rem] font-bold text-white">Zalo</span>
          {t.common.askSize} · {site.phoneDisplay}
        </a>
        <p className="label mt-5 text-center text-choc/60">{t.product.shippingNote}</p>
      </div>

      <Modal open={guide} onClose={() => setGuide(false)} title={t.product.sizeTitle}>
        <p className="text-sm text-ink/75">{t.product.sizeHelp}</p>
        <table className="mt-5 w-full text-left text-sm">
          <thead><tr className="label border-b border-choc text-choc"><th className="py-2">{t.common.size}</th><th className="py-2">{t.product.sizeHead}</th></tr></thead>
          <tbody>
            {sizeChart.map(([s, cm]) => (
              <tr key={s} className={`border-b border-line ${product.sizes.includes(s) ? '' : 'opacity-45'}`}>
                <td className="py-2.5 font-display text-lg">{s}</td><td className="py-2.5 tabular-nums">{cm} cm</td>
              </tr>
            ))}
          </tbody>
        </table>
        <a href={zaloUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost mt-6 w-full">{t.common.askSize}</a>
      </Modal>

      <Modal open={zoom} onClose={() => setZoom(false)} title={name}>
        <div className="relative aspect-square bg-paper">
          <Image src={current.src} alt={name} fill sizes="90vw" className={current.kind === 'color' ? 'object-contain mix-blend-multiply' : 'object-cover'} />
        </div>
      </Modal>
    </div>
  );
}
