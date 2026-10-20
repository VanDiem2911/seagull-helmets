'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { money } from '@/lib/format';
import { shippingRules } from '@/lib/site';
import { useCart } from './cart-provider';
import { CloseIcon, MinusIcon, PlusIcon } from './icons';
import { useT } from './locale-provider';
import { useQuote } from './use-quote';

export function CartDrawer() {
  const { lines, open, setOpen, setQty, remove } = useCart();
  const { t, href } = useT();
  const { quote, loading } = useQuote(lines, '', open);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open, setOpen]);

  if (!open) return null;
  const subtotal = quote?.subtotal ?? 0;
  const left = Math.max(0, shippingRules.freeOver - subtotal);
  const progress = Math.min(100, (subtotal / shippingRules.freeOver) * 100);

  return (
    <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-label={t.cart.title}>
      <button type="button" className="absolute inset-0 cursor-default bg-ink/45 animate-fade" onClick={() => setOpen(false)} aria-label={t.common.close} tabIndex={-1} />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-cream shadow-2xl animate-drawer">
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <h2 className="font-display text-2xl">{t.cart.title} <span className="label ml-1 text-saddle">({lines.reduce((n, l) => n + l.qty, 0)})</span></h2>
          <button ref={closeRef} type="button" onClick={() => setOpen(false)} className="p-1 text-choc" aria-label={t.common.close}><CloseIcon /></button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
            <p className="font-display text-2xl text-choc">{t.cart.empty}</p>
            <Link href={href('/products')} onClick={() => setOpen(false)} className="btn btn-primary">{t.cart.continue}</Link>
          </div>
        ) : (
          <>
            <div className="border-b border-line px-6 py-4">
              <p className="text-xs text-choc/80">{left > 0 ? t.cart.freeShipLeft(money(left)) : t.cart.freeShipDone}</p>
              <div className="mt-2 h-1 bg-line"><div className="h-full bg-saddle transition-all" style={{ width: `${progress}%` }} /></div>
            </div>
            <ul className={`flex-1 divide-y divide-line overflow-y-auto px-6 ${loading ? 'opacity-70' : ''}`}>
              {(quote?.items ?? []).map((it) => {
                const line = { slug: it.slug, color: it.color, size: it.size, qty: it.qty };
                return (
                  <li key={`${it.slug}|${it.color}|${it.size}`} className="flex gap-4 py-5">
                    <Link href={href(`/products/${it.slug}`)} onClick={() => setOpen(false)} className="frame block w-24 shrink-0">
                      <span className="frame-in block aspect-square bg-paper"><Image src={it.image} alt={it.name} width={200} height={200} className="h-full w-full object-contain mix-blend-multiply" /></span>
                    </Link>
                    <div className="min-w-0 flex-1">
                      <p className="label text-saddle">No. {it.code}</p>
                      <p className="font-display text-lg leading-tight text-choc">{it.name}</p>
                      <p className="mt-1 text-xs text-choc/70">{it.colorName}{it.size && ` · ${t.common.size} ${it.size}`}</p>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="inline-flex items-center border border-line">
                          <button type="button" className="p-2" onClick={() => setQty(line, it.qty - 1)} aria-label="−"><MinusIcon width={14} height={14} /></button>
                          <span className="w-7 text-center text-sm tabular-nums" aria-live="polite">{it.qty}</span>
                          <button type="button" className="p-2" onClick={() => setQty(line, it.qty + 1)} aria-label="+"><PlusIcon width={14} height={14} /></button>
                        </div>
                        <span className="text-sm font-medium tabular-nums text-choc">{money(it.lineTotal)}</span>
                      </div>
                      <button type="button" onClick={() => remove(line)} className="mt-2 text-xs text-saddle underline underline-offset-4">{t.common.remove}</button>
                    </div>
                  </li>
                );
              })}
              {!quote && <li className="py-10 text-center text-sm text-choc/60">…</li>}
            </ul>
            <div className="border-t border-line bg-paper px-6 py-5">
              <div className="flex items-baseline justify-between">
                <span className="label text-choc">{t.common.subtotal}</span>
                <span className="font-display text-2xl text-choc tabular-nums">{money(subtotal)}</span>
              </div>
              <p className="mt-1 text-xs text-choc/60">{t.cart.shippingCalc}</p>
              <Link href={href('/checkout')} onClick={() => setOpen(false)} className="btn btn-primary mt-4 w-full">{t.cart.checkout}</Link>
              <button type="button" onClick={() => setOpen(false)} className="mt-3 w-full text-center text-xs text-saddle underline underline-offset-4">{t.cart.continue}</button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
