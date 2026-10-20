export type SP = Record<string, string | string[] | undefined>;

export const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

/** Build "?a=1&b=2" from current search params + a patch (undefined removes a key). Always resets paging unless patched. */
export function withParams(sp: SP, patch: Record<string, string | undefined>, keepPage = false) {
  const out = new URLSearchParams();
  for (const [k, v] of Object.entries(sp)) {
    const val = first(v);
    if (val && (keepPage || k !== 'page')) out.set(k, val);
  }
  for (const [k, v] of Object.entries(patch)) {
    if (v === undefined || v === '') out.delete(k);
    else out.set(k, v);
  }
  const s = out.toString();
  return s ? `?${s}` : '';
}
