"use client";

import { useEffect, useMemo, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import Link from "next/link";
import { AlertCircle, ArrowRight, ClipboardCheck, FileWarning, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/firebase";
import { contentStatusClasses, contentStatusLabels, type AdminContentItem } from "@/lib/content-workflow";
import { contentQualityItems, type QualityItem, type QualityStatus } from "@/lib/quality-content";

type QualityReviewItem = QualityItem & { status: QualityStatus; note?: string; updatedBy?: string };

export default function AdminReviewPage() {
  const [contents, setContents] = useState<AdminContentItem[]>([]);
  const [qualityItems, setQualityItems] = useState<QualityReviewItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReviewItems = async () => {
      setLoading(true);
      try {
        const [contentSnapshot, qualitySnapshot] = await Promise.all([
          getDocs(query(collection(db, "adminContents"), orderBy("updatedAt", "desc"))),
          getDocs(collection(db, "adminQuality")),
        ]);

        setContents(
          contentSnapshot.docs
            .map((entry) => ({ id: entry.id, ...entry.data() } as AdminContentItem))
            .filter((item) => item.status === "review" || item.status === "fix")
        );

        const savedQuality = new Map(qualitySnapshot.docs.map((entry) => [entry.id, entry.data() as Partial<QualityReviewItem>]));
        setQualityItems(
          contentQualityItems
            .map((item) => ({ ...item, ...savedQuality.get(item.id), status: (savedQuality.get(item.id)?.status || item.status) as QualityStatus }))
            .filter((item) => item.status === "review")
        );
      } finally {
        setLoading(false);
      }
    };

    void loadReviewItems();
  }, []);

  const total = contents.length + qualityItems.length;
  const fixCount = contents.filter((item) => item.status === "fix").length;
  const reviewCount = contents.filter((item) => item.status === "review").length + qualityItems.length;

  const groupedContents = useMemo(() => {
    return contents.reduce<Record<string, AdminContentItem[]>>((acc, item) => {
      acc[item.module] = [...(acc[item.module] || []), item];
      return acc;
    }, {});
  }, [contents]);

  return (
    <div className="space-y-6">
      <header className="rounded-[2rem] bg-slate-950 p-6 text-white">
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-gold">À relire</p>
        <h1 className="mt-2 text-3xl font-heading font-bold">Tableau de relecture</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
          Tout ce qui doit être vérifié avant publication large : contenus en revue, contenus à corriger et points qualité sensibles.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><ClipboardCheck className="h-5 w-5 text-emerald-600" /> Total</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">{total}</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><FileWarning className="h-5 w-5 text-amber-600" /> En revue</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">{reviewCount}</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><AlertCircle className="h-5 w-5 text-red-600" /> À corriger</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">{fixCount}</p></CardContent>
        </Card>
      </section>

      {loading ? (
        <Card><CardContent className="p-6 text-sm text-slate-500">Chargement...</CardContent></Card>
      ) : total === 0 ? (
        <Card><CardContent className="p-6 text-sm text-slate-500">Aucun élément à relire pour le moment.</CardContent></Card>
      ) : (
        <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="space-y-4">
            {Object.entries(groupedContents).map(([module, items]) => (
              <Card key={module}>
                <CardHeader>
                  <CardTitle>{module}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h2 className="font-semibold">{item.title}</h2>
                          <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">{item.excerpt}</p>
                        </div>
                        <span className={`rounded-full px-3 py-1 text-xs font-bold ${contentStatusClasses[item.status]}`}>
                          {contentStatusLabels[item.status]}
                        </span>
                      </div>
                      {item.qualityNotes && <p className="mt-3 text-xs leading-5 text-slate-500">{item.qualityNotes}</p>}
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
            <Link href="/admin/content" className="inline-flex items-center gap-2 rounded-full bg-emerald-800 px-5 py-3 text-sm font-semibold text-white">
              Ouvrir la gestion du contenu
              <ArrowRight className="h-4 w-4" />
            </Link>
          </section>

          <aside className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-emerald-600" /> Points qualité</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {qualityItems.map((item) => (
                  <div key={item.id} className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-100">
                    <p className="font-semibold">{item.title}</p>
                    <p className="mt-1 leading-6">{item.description}</p>
                    {item.note && <p className="mt-2 text-xs opacity-80">{item.note}</p>}
                  </div>
                ))}
              </CardContent>
            </Card>
          </aside>
        </div>
      )}
    </div>
  );
}
