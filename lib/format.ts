const vnd = new Intl.NumberFormat('vi-VN');

/** 3350000 -> "3.350.000₫" (VND for both languages). */
export const money = (n: number) => `${vnd.format(Math.round(n))}₫`;

export const cx = (...a: Array<string | false | null | undefined>) => a.filter(Boolean).join(' ');

export const dateFmt = (d: string | Date, locale: 'vi' | 'en') =>
  new Date(d).toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

export const pad2 = (n: number) => String(n).padStart(2, '0');
