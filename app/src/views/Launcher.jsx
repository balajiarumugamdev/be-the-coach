// Shown when someone opens the site without a ?t=<token> link.
export default function Launcher() {
  return (
    <div className="max-w-xl mx-auto text-center py-20">
      <h1 className="text-3xl font-bold text-slate-900 mb-3">Leaps Up</h1>
      <p className="text-slate-600 mb-2">Welcome to the training platform.</p>
      <p className="text-slate-500">
        Please open the <strong>personal link</strong> your coach shared with you to sign in.
        If you don't have one, reach out to your coach.
      </p>
    </div>
  );
}
