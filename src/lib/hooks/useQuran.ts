import { useEffect, useState } from "react";

type QuranApiResponse = {
  data?: {
    ayahs?: Array<{
      numberInSurah: number;
      text: string;
    }>;
  };
};

const cache = new Map<string, QuranApiResponse>();

export function useQuranData(surahId: number) {
  const [data, setData] = useState<QuranApiResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const key = `surah-${surahId}`;
    const cached = cache.get(key);
    if (cached) {
      setData(cached);
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
