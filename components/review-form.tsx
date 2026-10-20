'use client';

import { useState } from 'react';
import { StarIcon } from './icons';
import { useT } from './locale-provider';

export function ReviewForm({ productSlug }: { productSlug: string }) {
  const { t } = useT();
  const [rating, setRating] = useState(5);
  const [state, setState] = useState<'idle' | 'busy' | 'done' | 'error'>('idle');

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setState('busy');
    try {
      const res = await fetch('/api/reviews', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ productSlug, rating, name: f.get('name'), text: f.get('text') }) });
      if (!res.ok) throw new Error();
      setState('done');
    } catch {
      setState('error');
    }
  }

  if (state === 'done') return <p className="border border-line bg-paper p-5 text-sm" role="status">{t.product.reviewThanks}</p>;

  return (
    <form onSubmit={submit} className="space-y-4 border border-line bg-paper p-6">
      <h3 className="font-display text-xl">{t.product.writeReview}</h3>
      <fieldset>
        <legend className="label mb-2 text-choc">{t.product.rating}</legend>
        <div className="flex gap-1 text-brass">
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} type="button" onClick={() => setRating(n)} aria-label={`${n}/5`} aria-pressed={n <= rating} className="p-0.5"><StarIcon filled={n <= rating} width={24} height={24} /></button>
          ))}
        </div>
      </fieldset>
      <div>
        <label className="label mb-1.5 block text-choc" htmlFor="rv-name">{t.common.name}</label>
        <input id="rv-name" name="name" required maxLength={60} autoComplete="name" className="field" />
      </div>
      <div>
        <label className="label mb-1.5 block text-choc" htmlFor="rv-text">{t.product.yourReview}</label>
        <textarea id="rv-text" name="text" required minLength={5} maxLength={1000} rows={4} className="field" />
      </div>
      {state === 'error' && <p className="text-sm text-[#a8261f]" role="alert">{t.common.error}</p>}
      <button type="submit" disabled={state === 'busy'} className="btn btn-primary">{state === 'busy' ? t.common.sending : t.common.send}</button>
    </form>
  );
}
