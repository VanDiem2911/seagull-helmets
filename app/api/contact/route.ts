import { z } from 'zod';
import { json, parse, phoneSchema, trimmed } from '@/lib/api';
import { connectDB } from '@/lib/db';
import { ContactModel } from '@/lib/models';

const schema = z.object({ name: trimmed(80), phone: phoneSchema, topic: z.enum(['size', 'order', 'partner']), message: trimmed(2000) });

export async function POST(req: Request) {
  const r = await parse(req, schema, { bucket: 'contact', limit: 5, windowMs: 10 * 60_000 });
  if ('error' in r) return r.error;
  try {
    await connectDB();
    await ContactModel.create(r.data);
    return json({ ok: true }, 201);
  } catch (e) {
    console.error('contact failed', e);
    return json({ error: 'server' }, 500);
  }
}
