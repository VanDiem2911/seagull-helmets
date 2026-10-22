import 'server-only';
import { connectDB } from './db';
import { CouponModel, ProductModel } from './models';
import { shippingFor } from './site';
import type { CartLine, Locale } from './types';
import { pick } from './types';

export type QuotedLine = {
  slug: string;
  code: string;
  name: string;
  color: string;
  colorName: string;
  size: string;
  qty: number;
  price: number;
  image: string;
  lineTotal: number;
};

export type Quote = {
  items: QuotedLine[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  coupon?: { code: string; description: string };
  couponError?: 'invalid';
  dropped: string[]; // "slug|color|size" keys of lines that are no longer available
};

/** Server-authoritative price calculation. The client only ever sends slug / colour / size / qty. */
export async function quoteCart(lines: CartLine[], locale: Locale, couponCode?: string): Promise<Quote> {
  await connectDB();
  const slugs = [...new Set(lines.map((l) => l.slug))];
  const products = await ProductModel.find({ slug: { $in: slugs }, active: true }).select('slug code name colors sizes price').lean<any[]>();
  const bySlug = new Map(products.map((p) => [p.slug as string, p]));

  const items: QuotedLine[] = [];
  const dropped: string[] = [];
  for (const l of lines) {
    const p = bySlug.get(l.slug);
    const color = p?.colors.find((c: any) => c.key === l.color);
    const sizeOk = p && (p.sizes.length === 0 ? l.size === '' : p.sizes.includes(l.size));
    if (!p || !color || !sizeOk) {
      dropped.push(`${l.slug}|${l.color}|${l.size}`);
      continue;
    }
    const qty = Math.min(Math.max(1, Math.floor(l.qty)), 20);
    items.push({
      slug: p.slug,
      code: p.code,
      name: pick(p.name, locale),
      color: color.key,
      colorName: pick(color.name, locale),
      size: l.size,
      qty,
      price: p.price,
      image: color.image,
      lineTotal: p.price * qty,
    });
  }

  const subtotal = items.reduce((s, i) => s + i.lineTotal, 0);
  let discount = 0;
  let coupon: Quote['coupon'];
  let couponError: Quote['couponError'];
  const code = couponCode?.trim().toUpperCase();
  if (code && items.length) {
    const c = await CouponModel.findOne({ code, active: true }).lean<any>();
    const valid =
      c &&
      subtotal >= (c.minSubtotal ?? 0) &&
      (!c.expiresAt || new Date(c.expiresAt) > new Date()) &&
      (c.maxUses == null || c.usedCount < c.maxUses);
    if (valid) {
      discount = c.kind === 'percent' ? Math.floor((subtotal * c.value) / 100) : Math.min(c.value, subtotal);
      coupon = { code: c.code, description: pick(c.description, locale) };
    } else {
      couponError = 'invalid';
    }
  }
  const shipping = shippingFor(subtotal - discount);
  return { items, subtotal, shipping, discount, total: subtotal - discount + shipping, coupon, couponError, dropped };
}
