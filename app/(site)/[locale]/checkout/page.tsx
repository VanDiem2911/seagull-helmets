import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CheckoutForm } from '@/components/checkout-form';
import { PageHeader } from '@/components/ui';
import { getDictionary } from '@/lib/dictionaries';
import { isLocale } from '@/lib/types';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return { title: getDictionary(locale).checkout.title, robots: { index: false, follow: false } };
}

export default async function CheckoutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  return (
    <>
      <PageHeader title={t.checkout.title} />
      <div className="container-sg"><CheckoutForm /></div>
    </>
  );
}
