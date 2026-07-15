export default function AccessDenied() {
  return (
    <div className="text-center py-16">
      <h2 className="text-2xl font-bold text-red-600 mb-2">Access denied</h2>
      <p className="text-slate-500 mb-6">
        This link isn't recognised. Ask your coach for your personal link.
      </p>
      <a
        href="?"
        className="inline-block px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 no-underline hover:border-blue-400"
      >
        Back to demo launcher
      </a>
    </div>
  );
}
