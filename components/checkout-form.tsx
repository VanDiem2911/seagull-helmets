'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { money } from '@/lib/format';
import { shippingRules } from '@/lib/site';
import { useCart } from './cart-provider';
import { CheckIcon } from './icons';
import { useT } from './locale-provider';
import { useQuote } from './use-quote';
import type { PaymentMethod } from '@/lib/types';

function Field({ label, id, children, required = true }: { label: string; id: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div>
      <label htmlFor={id} className="label mb-1.5 block text-choc">{label}{required && <span className="text-saddle"> *</span>}</label>
      {children}
    </div>
  );
}

export function CheckoutForm() {
  const { t, locale, href } = useT();
  const router = useRouter();
  const { lines, ready, clear } = useCart();
  const [couponInput, setCouponInput] = useState('');
  const [coupon, setCoupon] = useState('');
  const { quote, loading } = useQuote(lines, coupon);
  const [payment, setPayment] = useState<PaymentMethod>('cod');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  if (!ready) return <div className="py-32 text-center text-choc/60">…</div>;
  if (lines.length === 0)
    return (
      <div className="py-24 text-center">
        <p className="font-display text-3xl text-choc">{t.checkout.emptyCart}</p>
        <Link href={href('/products')} className="btn btn-primary mt-8">{t.cart.continue}</Link>
      </div>
    );

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    const f = new FormData(e.currentTarget);
    setBusy(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          lines, coupon: quote?.coupon?.code, locale, paymentMethod: payment,
          customer: Object.fromEntries(['name', 'phone', 'email', 'address', 'ward', 'district', 'city', 'note'].map((k) => [k, String(f.get(k) ?? '')])),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error === 'invalid' ? `${t.common.error} (${(data.issues ?? []).join(', ')})` : data.error === 'coupon' ? t.checkout.couponInvalid : t.common.error);
        return;
      }
      clear();
      router.push(href(`/order/${data.code}`));
    } catch {
      setError(t.common.error);
    } finally {
      setBusy(false);
    }
  }

  const shippingLabel = !quote ? '…' : quote.shipping === 0 ? t.common.free : money(quote.shipping);

  return (
    <form onSubmit={submit} className="grid gap-12 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
      <div className="space-y-12">
        <section aria-labelledby="co-contact">
          <h2 id="co-contact" className="font-display text-2xl">{t.checkout.contact}</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <Field label={t.common.name} id="co-name"><input id="co-name" name="name" required maxLength={80} autoComplete="name" className="field" /></Field>
            <Field label={t.common.phone} id="co-phone"><input id="co-phone" name="phone" type="tel" required inputMode="tel" autoComplete="tel" pattern="[0-9+\s.\-()]{9,16}" placeholder="09xx xxx xxx" className="field" /></Field>
            <div className="sm:col-span-2"><Field label={t.common.email} id="co-email" required={false}><input id="co-email" name="email" type="email" autoComplete="email" className="field" /></Field></div>
            <div className="sm:col-span-2"><Field label={t.checkout.address} id="co-address"><input id="co-address" name="address" required maxLength={200} autoComplete="address-line1" className="field" /></Field></div>
            <Field label={t.checkout.ward} id="co-ward" required={false}><input id="co-ward" name="ward" maxLength={80} className="field" /></Field>
            <Field label={t.checkout.district} id="co-district" required={false}><input id="co-district" name="district" maxLength={80} className="field" /></Field>
            <div className="sm:col-span-2"><Field label={t.checkout.city} id="co-city"><input id="co-city" name="city" required maxLength={80} defaultValue="TP. Hồ Chí Minh" autoComplete="address-level1" className="field" /></Field></div>
            <div className="sm:col-span-2"><Field label={t.common.note} id="co-note" required={false}><textarea id="co-note" name="note" rows={2} maxLength={500} className="field" /></Field></div>
          </div>
        </section>

        <section aria-labelledby="co-delivery">
          <h2 id="co-delivery" className="font-display text-2xl">{t.checkout.delivery}</h2>
          <label className="mt-6 flex cursor-pointer items-center justify-between gap-4 border border-saddle bg-paper p-4">
            <span className="flex items-center gap-3"><input type="radio" checked readOnly className="accent-saddle" /> <span><span className="block text-sm font-medium">{t.checkout.standard}</span><span className="text-xs text-ink/65">{t.checkout.eta}: {shippingRules.etaDays[locale]}</span></span></span>
            <span className="text-sm tabular-nums">{shippingLabel}</span>
          </label>
        </section>

        <section aria-labelledby="co-payment">
          <h2 id="co-payment" className="font-display text-2xl">{t.checkout.payment}</h2>
          <div className="mt-6 space-y-3" role="radiogroup" aria-labelledby="co-payment">
            {([['cod', t.checkout.cod, t.checkout.codDesc], ['bank', t.checkout.bank, t.checkout.bankDesc]] as const).map(([id, label, desc]) => (
              <label key={id} className={`flex cursor-pointer items-start gap-3 border p-4 transition ${payment === id ? 'border-saddle bg-paper' : 'border-line hover:border-saddle/60'}`}>
                <input type="radio" name="payment" value={id} checked={payment === id} onChange={() => setPayment(id)} className="mt-1 accent-saddle" />
                <span><span className="block text-sm font-medium">{label}</span><span className="text-xs text-ink/65">{desc}</span></span>
              </label>
            ))}
            <div className="flex items-start gap-3 border border-dashed border-line p-4 opacity-60" aria-disabled>
              <input type="radio" disabled className="mt-1" />
              <span><span className="block text-sm font-medium">{t.checkout.ewallet}</span><span className="label text-saddle">{t.checkout.soon}</span></span>
            </div>
          </div>
        </section>
      </div>

      {/* summary */}
      <aside className="lg:sticky lg:top-28 lg:self-start" aria-labelledby="co-summary">
        <div className="border border-line bg-paper p-6 sm:p-8">
          <h2 id="co-summary" className="font-display text-2xl">{t.checkout.summary}</h2>
          <ul className={`mt-6 divide-y divide-line ${loading ? 'opacity-70' : ''}`}>
            {(quote?.items ?? []).map((it) => (
              <li key={`${it.slug}|${it.color}|${it.size}`} className="flex gap-4 py-4">
                <span className="relative block h-20 w-20 shrink-0 border border-line bg-cream">
                  <Image src={it.image} alt={it.name} fill sizes="80px" className="object-contain scale-125 mix-blend-multiply" />
                  <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-choc px-1 text-[0.65rem] text-cream">{it.qty}</span>
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-display leading-tight text-choc">{it.name}</p>
                  <p className="mt-1 text-xs text-ink/65">{it.colorName}{it.size && ` · ${t.common.size} ${it.size}`}</p>
                </div>
                <p className="text-sm tabular-nums">{money(it.lineTotal)}</p>
              </li>
            ))}
          </ul>

          <div className="mt-6">
            <label htmlFor="co-coupon" className="label mb-1.5 block text-choc">{t.checkout.coupon}</label>
            <div className="flex gap-2">
              <input id="co-coupon" value={couponInput} onChange={(e) => setCouponInput(e.target.value)} placeholder={t.checkout.couponPlaceholder} className="field uppercase" onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); setCoupon(couponInput.trim()); } }} />
              <button type="button" onClick={() => setCoupon(couponInput.trim())} className="btn btn-ghost !px-5">{t.common.apply}</button>
            </div>
            {quote?.coupon && <p className="mt-2 flex items-center gap-1.5 text-sm text-sage" role="status"><CheckIcon width={16} height={16} /> {t.checkout.couponApplied} <strong>{quote.coupon.code}</strong>{quote.coupon.description && ` – ${quote.coupon.description}`}</p>}
            {quote?.couponError && coupon && <p className="mt-2 text-sm text-[#a8261f]" role="alert">{t.checkout.couponInvalid}</p>}
          </div>

          <dl className="mt-6 space-y-2.5 border-t border-line pt-5 text-sm">
            <div className="flex justify-between"><dt>{t.common.subtotal}</dt><dd className="tabular-nums">{quote ? money(quote.subtotal) : '…'}</dd></div>
            {!!quote?.discount && <div className="flex justify-between text-sage"><dt>{t.common.discount}</dt><dd className="tabular-nums">−{money(quote.discount)}</dd></div>}
            <div className="flex justify-between"><dt>{t.common.shipping}</dt><dd className="tabular-nums">{shippingLabel}</dd></div>
            <div className="flex items-baseline justify-between border-t border-choc/40 pt-4"><dt className="label text-choc">{t.common.total}</dt><dd className="font-display text-3xl text-choc tabular-nums">{quote ? money(quote.total) : '…'}</dd></div>
          </dl>

          {error && <p className="mt-4 text-sm text-[#a8261f]" role="alert">{error}</p>}
          <button type="submit" disabled={busy || !quote || quote.items.length === 0} className="btn btn-primary mt-6 w-full">{busy ? t.checkout.placing : t.checkout.place}</button>
          <p className="mt-4 text-xs leading-relaxed text-ink/60">{t.checkout.terms}</p>
        </div>
      </aside>
    </form>
  );
}
