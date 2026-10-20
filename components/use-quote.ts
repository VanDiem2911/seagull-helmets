'use client';

import { useEffect, useState } from 'react';
import type { Quote } from '@/lib/pricing';
import type { CartLine } from '@/lib/types';
import { useCart } from './cart-provider';
import { useLocale } from './locale-provider';

/** Asks the server to price the cart (the server is the only source of truth for prices, discounts and shipping). */
export function useQuote(lines: CartLine[], coupon = '', enabled = true) {
  const locale = useLocale();
  const { remove } = useCart();
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const key = JSON.stringify([lines, coupon, locale]);

  useEffect(() => {
    if (!enabled) return;
    if (!lines.length) {
      setQuote(null);
      return;
    }
    const ctrl = new AbortController();
    setLoading(true);
    const id = setTimeout(async () => {
      try {
        const res = await fetch('/api/cart/quote', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ lines, coupon, locale }), signal: ctrl.signal });
        if (!res.ok) throw new Error();
        const q: Quote = await res.json();
        setQuote(q);
        setFailed(false);
        // silently drop lines for products that no longer exist
        q.dropped.forEach((k) => {
          const [slug, color, size] = k.split('|');
          remove({ slug, color, size, qty: 1 });
        });
      } catch (e) {
        if ((e as Error).name !== 'AbortError') setFailed(true);
      } finally {
        if (!ctrl.signal.aborted) setLoading(false);
      }
    }, 120);
    return () => {
      clearTimeout(id);
      ctrl.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, enabled]);

  return { quote, loading, failed };
}
