'use client';

import { useState } from 'react';
import { useT } from './locale-provider';

export function ContactForm() {
  const { t } = useT();
  const [state, setState] = useState<'idle' | 'busy' | 'done' | 'error'>('idle');

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setState('busy');
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(Object.fromEntries(['name', 'phone', 'topic', 'message'].map((k) => [k, String(f.get(k) ?? '')]))) });
      if (!res.ok) throw new Error();
      setState('done');
    } catch {
      setState('error');
    }
  }

  if (state === 'done') return <p className="border border-line bg-paper p-6" role="status">{t.stores.form.thanks}</p>;

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="ct-name" className="label mb-1.5 block text-choc">{t.common.name}</label>
          <input id="ct-name" name="name" required maxLength={80} autoComplete="name" className="field" />
        </div>
        <div>
          <label htmlFor="ct-phone" className="label mb-1.5 block text-choc">{t.common.phone}</label>
          <input id="ct-phone" name="phone" type="tel" required inputMode="tel" autoComplete="tel" className="field" />
        </div>
      </div>
      <div>
        <label htmlFor="ct-topic" className="label mb-1.5 block text-choc">{t.stores.form.topic}</label>
        <select id="ct-topic" name="topic" className="field" defaultValue="size">
          {Object.entries(t.stores.form.topics).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="ct-msg" className="label mb-1.5 block text-choc">{t.stores.form.message}</label>
        <textarea id="ct-msg" name="message" required rows={5} maxLength={2000} className="field" />
      </div>
      {state === 'error' && <p className="text-sm text-[#a8261f]" role="alert">{t.common.error}</p>}
      <button type="submit" disabled={state === 'busy'} className="btn btn-primary">{state === 'busy' ? t.common.sending : t.common.send}</button>
    </form>
  );
}
