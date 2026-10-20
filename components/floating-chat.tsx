import { getDictionary } from '@/lib/dictionaries';
import { site, zaloUrl } from '@/lib/site';
import type { Locale } from '@/lib/types';
import { MessengerIcon } from './icons';

export function FloatingChat({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const common = 'group relative grid h-12 w-12 place-items-center rounded-full text-white shadow-lg ring-2 ring-paper transition hover:-translate-y-0.5';
  return (
    <div className="fixed bottom-5 right-4 z-30 flex flex-col gap-3 sm:right-6">
      <a href={zaloUrl} target="_blank" rel="noopener noreferrer" aria-label={t.chat.zalo} className={`${common} bg-[#0068ff]`}>
        <span className="text-[0.8rem] font-bold tracking-tight">Zalo</span>
        <span className="pointer-events-none absolute right-14 hidden whitespace-nowrap rounded bg-choc px-2.5 py-1 text-xs text-cream opacity-0 transition group-hover:opacity-100 sm:block">{t.chat.zalo}</span>
      </a>
      <a href={site.messengerUrl} target="_blank" rel="noopener noreferrer" aria-label={t.chat.messenger} className={`${common} bg-[#0084ff]`}>
        <MessengerIcon width={24} height={24} />
        <span className="pointer-events-none absolute right-14 hidden whitespace-nowrap rounded bg-choc px-2.5 py-1 text-xs text-cream opacity-0 transition group-hover:opacity-100 sm:block">{t.chat.messenger}</span>
      </a>
    </div>
  );
}
