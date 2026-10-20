import { randomBytes } from 'node:crypto';
import { z } from 'zod';
import { cartLineSchema, json, localeSchema, parse, phoneSchema, trimmed } from '@/lib/api';
import { connectDB } from '@/lib/db';
import { CouponModel, OrderModel } from '@/lib/models';
import { quoteCart } from '@/lib/pricing';

const schema = z.object({
  lines: z.array(cartLineSchema).min(1).max(30),
  coupon: z.string().max(40).optional(),
  locale: localeSchema,
  paymentMethod: z.enum(['cod', 'bank']),
  customer: z.object({
    name: trimmed(80),
    phone: phoneSchema,
    email: z.union([z.literal(''), z.email().max(120)]).optional(),
    address: trimmed(200),
    ward: trimmed(80, 0).optional(),
    district: trimmed(80, 0).optional(),
    city: trimmed(80),
    note: trimmed(500, 0).optional(),
  }),
});

const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
function orderCode() {
  const d = new Date();
  const ymd = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
  const rand = Array.from(randomBytes(6), (b) => ALPHABET[b % ALPHABET.length]).join('');
  return `SG${ymd}-${rand}`;
}

export async function POST(req: Request) {
  const r = await parse(req, schema, { bucket: 'order', limit: 6, windowMs: 10 * 60_000 });
  if ('error' in r) return r.error;
  const { lines, coupon, locale, paymentMethod, customer } = r.data;

  try {
    await connectDB();
    // Always re-price on the server; never trust amounts coming from the browser.
    const quote = await quoteCart(lines, locale, coupon);
    if (quote.items.length === 0 || quote.dropped.length > 0) return json({ error: 'unavailable', dropped: quote.dropped }, 409);
    if (coupon && quote.couponError) return json({ error: 'coupon' }, 400);

    if (quote.coupon) {
      // reserve a use atomically so maxUses can't be exceeded by concurrent orders
      const reserved = await CouponModel.findOneAndUpdate(
        { code: quote.coupon.code, active: true, $or: [{ maxUses: null }, { maxUses: { $exists: false } }, { $expr: { $lt: ['$usedCount', '$maxUses'] } }] },
        { $inc: { usedCount: 1 } },
      );
      if (!reserved) return json({ error: 'coupon' }, 400);
    }

    let code = orderCode();
    for (let i = 0; i < 3 && (await OrderModel.exists({ code })); i++) code = orderCode();

    await OrderModel.create({
      code,
      items: quote.items.map(({ lineTotal: _l, ...it }) => it),
      customer,
      subtotal: quote.subtotal,
      shippingFee: quote.shipping,
      discount: quote.discount,
      couponCode: quote.coupon?.code,
      total: quote.total,
      paymentMethod,
      locale,
    });
    return json({ code, total: quote.total }, 201);
  } catch (e) {
    console.error('order failed', e);
    return json({ error: 'server' }, 500);
  }
}
