import { z } from 'zod';
import { cartLineSchema, json, localeSchema, parse } from '@/lib/api';
import { quoteCart } from '@/lib/pricing';

const schema = z.object({ lines: z.array(cartLineSchema).max(30), coupon: z.string().max(40).optional(), locale: localeSchema });

export async function POST(req: Request) {
  const r = await parse(req, schema, { bucket: 'quote', limit: 120 });
  if ('error' in r) return r.error;
  try {
    return json(await quoteCart(r.data.lines, r.data.locale, r.data.coupon));
  } catch (e) {
    console.error('quote failed', e);
    return json({ error: 'server' }, 500);
  }
}
