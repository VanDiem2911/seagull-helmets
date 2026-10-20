import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { PageHeader } from '@/components/ui';
import { connectDB } from '@/lib/db';
import { getDictionary } from '@/lib/dictionaries';
import { OrderModel } from '@/lib/models';
import { first, type SP } from '@/lib/qs';
import { isLocale } from '@/lib/types';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return { title: getDictionary(locale).order.trackTitle, robots: { index: false } };
}

const digits = (s: string) => s.replace(/\D/g, '').slice(-9);

export default async function TrackPage({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<SP> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const sp = await searchParams;
  const t = getDictionary(locale);
  const code = (first(sp.code) ?? '').trim().toUpperCase();
  const phone = first(sp.phone) ?? '';
  let notFoundMsg = false;

  if (code && phone) {
    await connectDB();
    const o = await OrderModel.findOne({ code }).select('code customer.phone').lean<{ code: string; customer: { phone: string } }>();
    if (o && digits(o.customer.phone) === digits(phone)) redirect(`/${locale}/order/${o.code}`);
    notFoundMsg = true;
  }

  return (
    <>
      <PageHeader title={t.order.trackTitle}>{t.order.trackText}</PageHeader>
      <div className="container-sg">
        <form className="grid max-w-xl gap-5" action="" method="get">
          <div>
            <label htmlFor="tr-code" className="label mb-1.5 block text-choc">{t.order.code}</label>
            <input id="tr-code" name="code" required defaultValue={code} placeholder="SG261020-ABC123" className="field uppercase" />
          </div>
          <div>
            <label htmlFor="tr-phone" className="label mb-1.5 block text-choc">{t.common.phone}</label>
            <input id="tr-phone" name="phone" type="tel" required defaultValue={phone} className="field" />
          </div>
          {notFoundMsg && <p className="text-sm text-[#a8261f]" role="alert">{t.order.notFound}</p>}
          <button type="submit" className="btn btn-primary w-max">{t.order.trackBtn}</button>
        </form>
      </div>
    </>
  );
}
