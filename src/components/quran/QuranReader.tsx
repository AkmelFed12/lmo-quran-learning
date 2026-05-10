"use client";
import { useEffect, useState } from "react";
import { BookOpen } from "lucide-react";

interface Ayah {
  numberInSurah: number;
  text: string;
  translation?: string;
  transliteration?: string;
}

// Nettoie les diacritiques arabes (tashkeel) pour une comparaison fiable
function removeDiacritics(arabic: string): string {
  return arabic.replace(/[\u064B-\u0652\u0670]/g, "");
}

// Vérifie si un texte commence par la Basmala et la retire
function extractBasmala(text: string): { basmala: string | null; cleanText: string } {
  const basmalaPattern = "بسم الله الرحمن الرحيم";
  const normalizedText = removeDiacritics(text).trim();
  const normalizedBasmala = removeDiacritics(basmalaPattern);

  if (normalizedText.startsWith(normalizedBasmala)) {
    // On retire la Basmala (longueur exacte en tenant compte des éventuels diacritiques)
    const basmalaLength = text.indexOf("الرَّحِيمِ") + "الرَّحِيمِ".length;
    const afterBasmala = text.substring(basmalaLength).trim();
    return { basmala: text.substring(0, basmalaLength).trim(), cleanText: afterBasmala };
  }

  // Essai avec une variante sans certains diacritiques
  if (normalizedText.startsWith("بسم الله الرحمن الرحيم")) {
    const basmalaLength = "بسم الله الرحمن الرحيم".length;
    const afterBasmala = text.substring(basmalaLength).trim();
    return { basmala: text.substring(0, basmalaLength).trim(), cleanText: afterBasmala };
  }

  return { basmala: null, cleanText: text };
}

export default function QuranReader({ surahId }: { surahId: number }) {
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [surahInfo, setSurahInfo] = useState<any>(null);
  const [basmala, setBasmala] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setBasmala(null);
    setAyahs([]);

    const loadSurah = async () => {
      try {
        const [arRes, frRes, translitRes, metaRes] = await Promise.all([
          fetch(`https://api.alquran.cloud/v1/surah/${surahId}/ar.uthmani`),
          fetch(`https://api.alquran.cloud/v1/surah/${surahId}/fr.hamidullah`),
          fetch(`https://api.alquran.cloud/v1/surah/${surahId}/en.transliteration`),
          fetch(`https://api.alquran.cloud/v1/surah/${surahId}`),
        ]);

        const arData = await arRes.json();
        const frData = await frRes.json();
        const translitData = await translitRes.json();
        const metaData = await metaRes.json();

        const arAyahs = arData?.data?.ayahs;
        if (!arAyahs || !Array.isArray(arAyahs)) {
          console.error("Format arabe inattendu :", arData);
          return;
        }

        const frAyahs = frData?.data?.ayahs || [];
        const translitAyahs = translitData?.data?.ayahs || [];
        setSurahInfo(metaData?.data || null);

        let extractedBasmala: string | null = null;
        let ayahsToProcess = [...arAyahs];

        // Sourate 1 (Al-Fatiha) : la Basmala est le verset 1, on la laisse tel quel
        // Sourate 9 (At-Tawbah) : pas de Basmala du tout
        if (surahId !== 1 && surahId !== 9 && ayahsToProcess.length > 0) {
          const first = ayahsToProcess[0];
          const { basmala: basmalaExtracted, cleanText } = extractBasmala(first.text || "");
          if (basmalaExtracted) {
            extractedBasmala = basmalaExtracted;
            ayahsToProcess[0] = { ...first, text: cleanText };
          }
        }

        const combined = ayahsToProcess.map((ayah: any, i: number) => ({
          numberInSurah: ayah.numberInSurah || i + 1,
          text: ayah.text || "",
          translation: frAyahs[i]?.text || "",
          transliteration: translitAyahs[i]?.text || "",
        }));

        setBasmala(extractedBasmala);
        setAyahs(combined);
      } catch (err) {
        console.error("Erreur chargement sourate :", err);
      } finally {
        setLoading(false);
      }
    };

    loadSurah();
  }, [surahId]);

  if (loading) {
    return (
      <div className="card-premium p-6 text-center">
        <BookOpen className="animate-pulse w-8 h-8 mx-auto mb-4 text-emerald-600" />
        <p>Chargement du Coran...</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-emerald-100 dark:border-emerald-900/50 shadow-lg overflow-hidden">
      {/* En-tête de la sourate */}
      <div className="bg-gradient-to-r from-emerald-700 to-emerald-800 dark:from-emerald-900 dark:to-emerald-950 p-6 text-center text-white">
        <div className="mb-2 text-sm opacity-80">Sourate</div>
        <h2 className="text-3xl font-arabic mb-1">{surahInfo?.name || ""}</h2>
        <h3 className="text-xl font-heading">{surahInfo?.englishName || ""}</h3>
        <div className="flex justify-center gap-4 mt-2 text-xs opacity-80">
          <span>{surahInfo?.revelationType === "Meccan" ? "Mecquoise" : "Médinoise"}</span>
          <span>{surahInfo?.numberOfAyahs} versets</span>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Basmala centrée (sauf pour les sourates qui n'en ont pas) */}
        {basmala && (
          <p className="text-2xl font-arabic text-center leading-loose pb-4 border-b border-emerald-100 dark:border-emerald-900/30">
            {basmala}
          </p>
        )}

        {/* Versets */}
        {ayahs.map((ayah) => (
          <div
            key={ayah.numberInSurah}
            className="pb-4 border-b border-emerald-50 dark:border-emerald-900/20 last:border-0"
          >
            <div className="flex gap-3">
              {/* Numéro de verset */}
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-800/50 flex items-center justify-center text-xs font-medium text-emerald-700 dark:text-emerald-300 mt-1">
                {ayah.numberInSurah}
              </div>

              {/* Texte arabe */}
              <p className="text-2xl md:text-3xl font-arabic leading-loose text-right flex-1">
                {ayah.text}
              </p>
            </div>

            {/* Translittération */}
            {ayah.transliteration && (
              <p className="text-sm italic text-slate-500 dark:text-slate-400 mt-2 pr-11">
                {ayah.transliteration}
              </p>
            )}

            {/* Traduction */}
            {ayah.translation && (
              <p className="text-sm text-slate-700 dark:text-slate-300 mt-1 pr-11">
                {ayah.translation}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}