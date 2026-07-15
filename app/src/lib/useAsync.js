import { useState, useEffect, useCallback } from "react";

// Runs an async loader, tracks loading/error, and exposes reload().
export function useAsync(fn, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loader = useCallback(fn, deps);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const d = await loader();
      setData(d);
      setError(null);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [loader]);

  useEffect(() => {
    let live = true;
    setLoading(true);
    Promise.resolve(loader())
      .then((d) => { if (live) { setData(d); setError(null); } })
      .catch((e) => { if (live) setError(e); })
      .finally(() => { if (live) setLoading(false); });
    return () => { live = false; };
  }, [loader]);

  return { data, loading, error, reload };
}
