'use client';

import { useId, useState } from 'react';

export function Tabs({ tabs }: { tabs: { id: string; label: string; content: React.ReactNode }[] }) {
  const [active, setActive] = useState(tabs[0].id);
  const uid = useId();
  return (
    <div>
      <div role="tablist" className="no-scrollbar flex gap-8 overflow-x-auto border-b border-choc/30">
        {tabs.map((tab) => (
          <button key={tab.id} role="tab" id={`${uid}-${tab.id}`} aria-selected={active === tab.id} aria-controls={`${uid}-p-${tab.id}`} type="button" onClick={() => setActive(tab.id)}
            className={`label -mb-px shrink-0 border-b-2 pb-4 pt-2 transition ${active === tab.id ? 'border-saddle text-saddle' : 'border-transparent text-choc/65 hover:text-choc'}`}>
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.map((tab) => (
        <div key={tab.id} role="tabpanel" id={`${uid}-p-${tab.id}`} aria-labelledby={`${uid}-${tab.id}`} hidden={active !== tab.id} className="pt-8">
          {tab.content}
        </div>
      ))}
    </div>
  );
}
