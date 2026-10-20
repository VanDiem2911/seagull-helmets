'use client';

import { createContext, useContext, useMemo } from 'react';
import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/types';

const Ctx = createContext<Locale>('vi');

export function LocaleProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return <Ctx.Provider value={locale}>{children}</Ctx.Provider>;
}

export const useLocale = () => useContext(Ctx);

/** Client-side access to the dictionary and a locale-aware href builder. */
export function useT() {
  const locale = useLocale();
  return useMemo(() => ({ locale, t: getDictionary(locale), href: (path = '') => `/${locale}${path}` }), [locale]);
}
