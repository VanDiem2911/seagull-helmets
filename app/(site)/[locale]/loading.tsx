// Shown instantly while a request-time page (products, journal…) is rendered on the server, so a click never feels stuck.
// It also lets <Link> prefetch everything up to this point for those pages.
export default function Loading() {
  return (
    <div className="container-sg pt-24 lg:pt-32" role="status" aria-busy="true">
      <span className="sr-only">Loading…</span>
      <div className="h-3 w-24 animate-pulse bg-line" />
      <div className="mt-5 h-10 w-2/3 max-w-md animate-pulse bg-line/70" />
      <div className="mt-14 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="aspect-square animate-pulse bg-line/50" />
        ))}
      </div>
    </div>
  );
}
