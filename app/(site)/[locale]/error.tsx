'use client';

import { useT } from '@/components/locale-provider';

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  const { t } = useT();
  return (
    <div className="container-sg py-32 text-center">
      <h1 className="text-4xl italic">{t.errors.title}</h1>
      <button type="button" onClick={reset} className="btn btn-primary mt-8">{t.errors.retry}</button>
    </div>
  );
}
