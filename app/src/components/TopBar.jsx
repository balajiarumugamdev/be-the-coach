export default function TopBar({ user, roleLabel }) {
  return (
    <header className="flex items-center justify-between px-6 py-3 bg-white border-b border-slate-200">
      <div className="font-bold text-slate-900 tracking-tight">Leaps&nbsp;Up</div>
      {user && (
        <div className="text-sm text-slate-500 flex items-center gap-2">
          {user.name}
          <span className="inline-block px-2.5 py-0.5 rounded-full text-xs bg-sky-100 text-sky-800">
            {roleLabel}
          </span>
        </div>
      )}
    </header>
  );
}
