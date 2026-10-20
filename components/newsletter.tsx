'use client';

import { useState } from 'react';
import { useT } from './locale-provider';

export function Newsletter() {
  const { t, locale } = useT();
  const [state, setState] = useState<'idle' | 'busy' | 'done' | 'error'>('idle');
  const [code, setCode] = useState('');

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = new FormData(e.currentTarget).get('email');
    setState('busy');
    try {
      const res = await fetch('/api/newsletter', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email, locale }) });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setCode(data.coupon ?? '');
      setState('done');
    } catch {
      setState('error');
    }
  }

  if (state === 'done')
    return (
      <p className="mt-5 text-sm" role="status">
        {t.footer.newsletter.done}{' '}
        <strong className="label ml-1 inline-block border border-brass px-2 py-1 text-brass">{code}</strong>
      </p>
    );

  return (
    <form onSubmit={submit} className="mt-5">
      <div className="flex border border-cream/40 focus-within:border-brass">
        <label className="sr-only" htmlFor="nl-email">{t.common.email}</label>
        <input id="nl-email" name="email" type="email" required autoComplete="email" placeholder={t.footer.newsletter.placeholder} className="w-full min-w-0 bg-transparent px-4 py-3 text-sm text-cream placeholder:text-cream/45 focus:outline-none" />
        <button type="submit" disabled={state === 'busy'} className="label shrink-0 bg-brass px-5 text-ink transition hover:bg-cream disabled:opacity-60">
          {t.footer.newsletter.cta}
        </button>
      </div>
      {state === 'error' && <p className="mt-2 text-xs text-[#f0b9a8]" role="alert">{t.common.error}</p>}
    </form>
  );
}
