'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { CartLine } from '@/lib/types';

const KEY = 'sg_cart_v1';
const lineKey = (l: Pick<CartLine, 'slug' | 'color' | 'size'>) => `${l.slug}|${l.color}|${l.size}`;

type CartCtx = {
  lines: CartLine[];
  ready: boolean;
  count: number;
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (line: CartLine, openDrawer?: boolean) => void;
  setQty: (line: CartLine, qty: number) => void;
  remove: (line: CartLine) => void;
  clear: () => void;
};

const Ctx = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setLines(parsed.filter((l) => l && typeof l.slug === 'string' && l.qty > 0));
      }
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(lines));
    } catch {}
  }, [lines, ready]);

  // keep several tabs in sync
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY && e.newValue) {
        try {
          setLines(JSON.parse(e.newValue));
        } catch {}
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const add = useCallback((line: CartLine, openDrawer = true) => {
    setLines((prev) => {
      const i = prev.findIndex((l) => lineKey(l) === lineKey(line));
      if (i === -1) return [...prev, line];
      const next = [...prev];
      next[i] = { ...next[i], qty: Math.min(20, next[i].qty + line.qty) };
      return next;
    });
    if (openDrawer) setOpen(true);
  }, []);

  const setQty = useCallback((line: CartLine, qty: number) => {
    setLines((prev) =>
      qty <= 0 ? prev.filter((l) => lineKey(l) !== lineKey(line)) : prev.map((l) => (lineKey(l) === lineKey(line) ? { ...l, qty: Math.min(20, qty) } : l)),
    );
  }, []);

  const remove = useCallback((line: CartLine) => setLines((prev) => prev.filter((l) => lineKey(l) !== lineKey(line))), []);
  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartCtx>(
    () => ({ lines, ready, count: lines.reduce((n, l) => n + l.qty, 0), open, setOpen, add, setQty, remove, clear }),
    [lines, ready, open, add, setQty, remove, clear],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useCart must be used inside <CartProvider>');
  return c;
}
