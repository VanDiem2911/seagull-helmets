import 'server-only';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { clientIp, rateLimit } from './rate-limit';

export const json = (data: unknown, status = 200) => NextResponse.json(data, { status });

/** Parse + validate a JSON body and apply a per-IP rate limit. Returns either the data or a ready error response. */
export async function parse<S extends z.ZodType>(req: Request, schema: S, opts: { bucket: string; limit?: number; windowMs?: number }) {
  if (!rateLimit(`${opts.bucket}:${clientIp(req)}`, opts.limit ?? 20, opts.windowMs ?? 60_000)) {
    return { error: json({ error: 'rate_limited' }, 429) } as const;
  }
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return { error: json({ error: 'bad_json' }, 400) } as const;
  }
  const result = schema.safeParse(body);
  if (!result.success) return { error: json({ error: 'invalid', issues: result.error.issues.map((i) => i.path.join('.')) }, 400) } as const;
  return { data: result.data as z.infer<S> } as const;
}

export const cartLineSchema = z.object({
  slug: z.string().min(1).max(120),
  color: z.string().min(1).max(60),
  size: z.string().max(8),
  qty: z.number().int().min(1).max(20),
});

export const localeSchema = z.enum(['vi', 'en']).default('vi');

const phone = z
  .string()
  .transform((s) => s.replace(/[\s.\-()]/g, ''))
  .refine((s) => /^(0|\+?84)\d{9}$/.test(s), 'phone')
  .transform((s) => (s.startsWith('+84') ? `0${s.slice(3)}` : s.startsWith('84') ? `0${s.slice(2)}` : s));

export const phoneSchema = phone;

export const trimmed = (max: number, min = 1) => z.string().trim().min(min).max(max);
