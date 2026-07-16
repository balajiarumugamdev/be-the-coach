import { useEffect } from "react";
import { ROLE_LABELS } from "./data/courses.js";
import { loadBootstrap } from "./lib/dataLayer.js";
import { useAsync } from "./lib/useAsync.js";
import TopBar from "./components/TopBar.jsx";
import Loading from "./components/Loading.jsx";
import Launcher from "./views/Launcher.jsx";
import AccessDenied from "./views/AccessDenied.jsx";
import TraineeHome from "./views/TraineeHome.jsx";
import CoachView from "./views/CoachView.jsx";
import ManagerDashboard from "./views/ManagerDashboard.jsx";

function getToken() {
  return new URLSearchParams(window.location.search).get("t");
}

// #3 — session cache: show the last-known bootstrap instantly on re-open,
// while a fresh copy is fetched in the background (stale-while-revalidate).
const CACHE_PREFIX = "leapsup_boot_";
function readCache(token) {
  try { return JSON.parse(sessionStorage.getItem(CACHE_PREFIX + token)); } catch { return null; }
}
function writeCache(token, data) {
  try { sessionStorage.setItem(CACHE_PREFIX + token, JSON.stringify(data)); } catch { /* ignore */ }
}

export default function App() {
  const token = getToken();

  const { data, loading, reload } = useAsync(
    () => (token ? loadBootstrap(token) : Promise.resolve({ user: null })),
    [token]
  );

  const cached = token ? readCache(token) : null;
  const boot = data || cached; // instant from cache, then replaced by fresh data

  useEffect(() => {
    if (token && data && data.user) writeCache(token, data);
  }, [token, data]);

  let inner;
  let user = null;
  if (!token) {
    inner = <Launcher />;
  } else if (!boot && loading) {
    inner = <Loading label="Signing you in…" />;
  } else if (!boot || !boot.user) {
    inner = <AccessDenied />;
  } else {
    user = boot.user;
    if (user.role === "coach") inner = <CoachView />;
    else if (user.role === "manager") inner = <ManagerDashboard />;
    else inner = <TraineeHome user={{ ...user, token }} boot={boot} reload={reload} />;
  }

  return (
    <div className="min-h-full flex flex-col">
      <TopBar user={user} roleLabel={user ? ROLE_LABELS[user.role] : null} />
      <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-8 pb-10">{inner}</main>
    </div>
  );
}
