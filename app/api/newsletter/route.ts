import { z } from 'zod';
import { json, localeSchema, parse } from '@/lib/api';
import { connectDB } from '@/lib/db';
import { CouponModel, SubscriberModel } from '@/lib/models';

const schema = z.object({ email: z.email().max(120), locale: localeSchema });

export async function POST(req: Request) {
  const r = await parse(req, schema, { bucket: 'newsletter', limit: 5 });
  if ('error' in r) return r.error;
  try {
    await connectDB();
    await SubscriberModel.updateOne({ email: r.data.email.toLowerCase() }, { $setOnInsert: { email: r.data.email.toLowerCase(), locale: r.data.locale } }, { upsert: true });
    const coupon = await CouponModel.exists({ code: 'WELCOME10', active: true });
    return json({ ok: true, coupon: coupon ? 'WELCOME10' : null });
  } catch (e) {
    console.error('newsletter failed', e);
    return json({ error: 'server' }, 500);
  }
}
