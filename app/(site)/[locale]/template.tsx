// A template (unlike a layout) is re-created on every navigation, so each page change fades in.
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="animate-page">{children}</div>;
}
