import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CheckIcon } from '@/components/icons';
import { connectDB, plain } from '@/lib/db';
import { getDictionary } from '@/lib/dictionaries';
import { dateFmt, money } from '@/lib/format';
import { OrderModel } from '@/lib/models';
import { bank, site, zaloUrl } from '@/lib/site';
import { isLocale, orderStatuses } from '@/lib/types';

// a customer's own order: always rendered fresh, never cached
export const dynamic = 'force-dynamic';

type Order = {
  code: string;
  items: { slug: string; code: string; name: string; colorName: string; size: string; qty: number; price: number; image: string }[];
  customer: { name: string; phone: string; address: string; ward?: string; district?: string; city: string };
  subtotal: number; shippingFee: number; discount: number; couponCode?: string; total: number;
  paymentMethod: 'cod' | 'bank'; paymentStatus: 'unpaid' | 'paid'; status: (typeof orderStatuses)[number]; createdAt: string;
};

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function OrderPage({ params }: { params: Promise<{ locale: string; code: string }> }) {
  const { locale, code } = await params;
  if (!isLocale(locale)) notFound();
  if (!/^SG\d{6}-[A-Z0-9]{6}$/.test(code)) notFound();
  await connectDB();
  const doc = await OrderModel.findOne({ code }).lean();
  if (!doc) notFound();
  const o = plain<Order>(doc);
  const t = getDictionary(locale);
  const steps = orderStatuses.filter((s) => s !== 'cancelled');
  const stepIndex = steps.indexOf(o.status as (typeof steps)[number]);
  const qr = o.paymentMethod === 'bank' && bank.id && bank.account
    ? `https://img.vietqr.io/image/${bank.id}-${bank.account}-compact2.png?amount=${o.total}&addInfo=${encodeURIComponent(o.code)}&accountName=${encodeURIComponent(bank.name)}`
    : null;
  const addr = [o.customer.address, o.customer.ward, o.customer.district, o.customer.city].filter(Boolean).join(', ');

  return (
    <div className="container-sg max-w-4xl pb-8 pt-14 lg:pt-20">
      <div className="text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-saddle text-saddle"><CheckIcon width={30} height={30} /></span>
        <h1 className="mt-6 text-4xl sm:text-5xl">{t.order.thanks}</h1>
        <p className="mt-3 text-ink/75">{t.order.thanksText}</p>
        <p className="label mt-6 text-saddle">{t.order.code}</p>
        <p className="font-display text-3xl tracking-wide text-choc">{o.code}</p>
        <p className="mt-1 text-xs text-ink/55">{dateFmt(o.createdAt, locale)}</p>
      </div>

      <section className="mt-12" aria-label={t.order.status}>
        {o.status === 'cancelled' ? (
          <p className="border border-line bg-paper p-4 text-center text-sm">{t.order.statuses.cancelled}</p>
        ) : (
          <ol className="grid grid-cols-4 gap-2">
            {steps.map((s, i) => (
              <li key={s} aria-current={i === stepIndex ? 'step' : undefined} className="text-center">
                <div className={`h-1 ${i <= stepIndex ? 'bg-saddle' : 'bg-line'}`} />
                <p className={`label mt-2 ${i <= stepIndex ? 'text-saddle' : 'text-choc/45'}`}>{t.order.statuses[s]}</p>
              </li>
            ))}
          </ol>
        )}
      </section>

      {o.paymentMethod === 'bank' && (
        <section className="mt-10 border border-saddle bg-paper p-6 sm:p-8">
          <h2 className="font-display text-2xl">{t.order.payBank}</h2>
          <p className="mt-2 text-sm text-ink/75">{t.order.payBankText}</p>
          {qr ? (
            <div className="mt-6 grid items-center gap-6 sm:grid-cols-[14rem_1fr]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qr} alt="VietQR" width={224} height={224} className="mx-auto border border-line bg-white" />
              <dl className="space-y-2 text-sm">
                <div className="flex gap-3"><dt className="label w-32 text-choc">{t.order.bankName}</dt><dd>{bank.id}</dd></div>
                <div className="flex gap-3"><dt className="label w-32 text-choc">{t.order.account}</dt><dd className="font-medium">{bank.account}</dd></div>
                <div className="flex gap-3"><dt className="label w-32 text-choc">{t.order.holder}</dt><dd>{bank.name}</dd></div>
                <div className="flex gap-3"><dt className="label w-32 text-choc">{t.order.amount}</dt><dd className="font-medium">{money(o.total)}</dd></div>
                <div className="flex gap-3"><dt className="label w-32 text-choc">{t.order.content}</dt><dd className="font-medium">{o.code}</dd></div>
              </dl>
            </div>
          ) : (
            <p className="mt-4 text-sm font-medium text-saddle">{t.order.bankMissing}</p>
          )}
        </section>
      )}

      <section className="mt-10 grid gap-8 border-t border-line pt-10 md:grid-cols-[1.4fr_1fr]">
        <div>
          <h2 className="label text-choc">{t.order.items}</h2>
          <ul className="mt-4 divide-y divide-line">
            {o.items.map((it) => (
              <li key={`${it.slug}${it.colorName}${it.size}`} className="flex items-center gap-4 py-4">
                <span className="relative h-16 w-16 shrink-0 border border-line bg-paper"><Image src={it.image} alt={it.name} fill sizes="64px" className="object-contain scale-125 mix-blend-multiply" /></span>
                <div className="min-w-0 flex-1"><p className="font-display leading-tight text-choc">{it.name}</p><p className="text-xs text-ink/65">{it.colorName}{it.size && ` · ${it.size}`} · ×{it.qty}</p></div>
                <p className="text-sm tabular-nums">{money(it.price * it.qty)}</p>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
            <div className="flex justify-between"><dt>{t.common.subtotal}</dt><dd className="tabular-nums">{money(o.subtotal)}</dd></div>
            {o.discount > 0 && <div className="flex justify-between text-sage"><dt>{t.common.discount} {o.couponCode && `(${o.couponCode})`}</dt><dd className="tabular-nums">−{money(o.discount)}</dd></div>}
            <div className="flex justify-between"><dt>{t.common.shipping}</dt><dd className="tabular-nums">{o.shippingFee ? money(o.shippingFee) : t.common.free}</dd></div>
            <div className="flex items-baseline justify-between border-t border-choc/40 pt-3"><dt className="label text-choc">{t.common.total}</dt><dd className="font-display text-2xl tabular-nums">{money(o.total)}</dd></div>
          </dl>
        </div>
        <div className="space-y-6 text-sm">
          <div><h2 className="label text-choc">{t.order.shipTo}</h2><p className="mt-2 leading-relaxed">{o.customer.name}<br />{o.customer.phone}<br />{addr}</p></div>
          <div><h2 className="label text-choc">{t.order.payment}</h2><p className="mt-2">{o.paymentMethod === 'cod' ? t.checkout.cod : t.checkout.bank}</p></div>
        </div>
      </section>

      <div className="mt-12 flex flex-wrap justify-center gap-3">
        <a href={zaloUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">{t.order.zaloShop} · {site.phoneDisplay}</a>
        <Link href={`/${locale}/track`} className="btn btn-ghost">{t.order.track}</Link>
        <Link href={`/${locale}/products`} className="btn btn-ghost">{t.cart.continue}</Link>
      </div>
    </div>
  );
}
