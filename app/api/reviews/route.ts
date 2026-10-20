import { z } from 'zod';
import { json, parse, trimmed } from '@/lib/api';
import { connectDB } from '@/lib/db';
import { ProductModel, ReviewModel } from '@/lib/models';

const schema = z.object({ productSlug: trimmed(120), rating: z.number().int().min(1).max(5), name: trimmed(60), text: trimmed(1000, 5) });

export async function POST(req: Request) {
  const r = await parse(req, schema, { bucket: 'review', limit: 4, windowMs: 10 * 60_000 });
  if ('error' in r) return r.error;
  try {
    await connectDB();
    if (!(await ProductModel.exists({ slug: r.data.productSlug }))) return json({ error: 'not_found' }, 404);
    // reviews wait for approval in /admin before they show on the product page
    await ReviewModel.create({ ...r.data, approved: false });
    return json({ ok: true }, 201);
  } catch (e) {
    console.error('review failed', e);
    return json({ error: 'server' }, 500);
  }
}
