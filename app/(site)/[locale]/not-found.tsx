'use client';

import Link from 'next/link';
import { useT } from '@/components/locale-provider';

export default function NotFound() {
  const { t, href } = useT();
  return (
    <div className="container-sg py-32 text-center">
      <p className="label text-saddle">404</p>
      <h1 className="mt-4 text-5xl italic">{t.notFound.title}</h1>
      <p className="mx-auto mt-4 max-w-md text-ink/70">{t.notFound.text}</p>
      <Link href={href()} className="btn btn-primary mt-8">{t.nav.home}</Link>
    </div>
  );
}
