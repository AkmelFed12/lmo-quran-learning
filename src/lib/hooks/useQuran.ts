import { useEffect, useState } from "react";

const cache = new Map<string, any>();

export function useQuranData(surahId: number) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const key = `surah-${surahId}`;
    if (cache.has(key)) {
      setData(cache.get(key));
      setLoading(false);
      return;
    }

    fetch(`https://api.alquran.cloud/v1/surah/${surahId}/ar.uthmani`)
      .then(r => r.json())
      .then(d => {
        cache.set(key, d);
        setData(d);
      })
      .finally(() => setLoading(false));
  }, [surahId]);

  return { data, loading };
}