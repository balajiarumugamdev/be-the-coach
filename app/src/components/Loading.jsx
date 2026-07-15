export default function Loading({ label = "Loading…" }) {
  return (
    <div className="flex items-center justify-center py-16 text-slate-400 text-sm">
      <span className="animate-pulse">{label}</span>
    </div>
  );
}
