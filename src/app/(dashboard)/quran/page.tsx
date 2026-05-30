"use client";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import QuranReader from "@/components/quran/QuranReader";
import QuranNav from "@/components/quran/QuranNav";
import Loading from "@/components/shared/Loading";

function QuranPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedSurah, setSelectedSurah] = useState(1);

  useEffect(() => {
    const surahParam = Number(searchParams.get("surah"));
    if (Number.isInteger(surahParam) && surahParam >= 1 && surahParam <= 114) {
      setSelectedSurah(surahParam);
    }
  }, [searchParams]);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <header className="card-premium p-5 sm:p-6">
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-gold">Lecture du Coran</p>
        <h1 className="mt-2 text-3xl font-heading font-bold text-slate-950 dark:text-white">Mushaf numérique accompagné</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">
          Texte arabe uthmani, traduction française, translittération et audio. Pour la correction précise de récitation, privilégiez toujours un enseignant qualifié.
        </p>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <QuranNav
            activeSurah={selectedSurah}
            onSelect={(id) => {
              setSelectedSurah(id);
              router.replace(`/quran?surah=${id}`, { scroll: false });
            }}
          />
        </div>
        <div className="lg:col-span-2">
          <QuranReader surahId={selectedSurah} />
        </div>
      </div>
    </div>
  );
}

export default function QuranPage() {
  return (
    <Suspense fallback={<Loading />}>
      <QuranPageContent />
    </Suspense>
  );
}
