'use client';

import { useEffect, useRef, useState } from 'react';

/** Muted looping clip that only plays while on screen. Adapts to portrait (reel) or landscape footage. */
export function ReelPlayer({ src, poster }: { src: string; poster?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [portrait, setPortrait] = useState(true);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.35 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <div className={`relative mx-auto overflow-hidden bg-choc ${portrait ? 'aspect-[9/16] max-h-[80svh] max-w-sm' : 'aspect-video max-w-5xl'}`}>
      <video
        ref={ref}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden
        onLoadedMetadata={(e) => setPortrait(e.currentTarget.videoHeight > e.currentTarget.videoWidth)}
        className="h-full w-full object-cover"
      />
    </div>
  );
}
