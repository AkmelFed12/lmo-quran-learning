"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { AlertTriangle, CheckCircle2, ClipboardCheck, FileText, History, Loader2, Search, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/hooks/useAuth";
import {
  contentQualityItems,
  editorialStandards,
  mobileQualityChecklist,
  qualityBacklog,
  type QualityItem,
  type QualityStatus,
} from "@/lib/quality-content";
import {
  adminAuditActionLabels,
  formatAdminAuditDate,
  type AdminAuditAction,
  type AdminAuditLog,
} from "@/lib/admin-audit";

type PersistedQualityItem = {
  status?: QualityStatus;
  note?: string;
  updatedBy?: string;
  updatedAt?: unknown;
};

type QualityViewItem = QualityItem & PersistedQualityItem;

const statusLabels: Record<QualityStatus, string> = {
  stable: "Stable",
  review: "À relire",
  planned: "Prévu",
};

const statusClasses: Record<QualityStatus, string> = {
  stable: "bg-emerald-100 text-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-100",
  review: "bg-amber-100 text-amber-950 dark:bg-amber-950/40 dark:text-amber-100",
  planned: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
};

const statusOptions: QualityStatus[] = ["stable", "review", "planned"];

const priorityClasses = {
  Haute: "bg-red-100 text-red-950 dark:bg-red-950/40 dark:text-red-100",
  Moyenne: "bg-amber-100 text-amber-950 dark:bg-amber-950/40 dark:text-amber-100",
  Basse: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
};

function mergeQualityItems(savedItems: Record<string, PersistedQualityItem>): QualityViewItem[] {
  return contentQualityItems.map((item) => ({
    ...item,
    ...savedItems[item.id],
    status: savedItems[item.id]?.status || item.status,
  }));
}

export default function AdminQualityPage() {
  const { user } = useAuth();
  const [queryText, setQueryText] = useState("");
  const [items, setItems] = useState<QualityViewItem[]>(contentQualityItems);
  const [draftNotes, setDraftNotes] = useState<Record<string, string>>({});
  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  const writeAuditLog = useCallback(
    async (action: AdminAuditAction, targetId: string, summary: string, metadata?: Record<string, unknown>) => {
      await addDoc(collection(db, "adminAuditLogs"), {
        action,
        targetType: "quality",
        targetId,
        summary,
        actorEmail: user?.email || "administrateur",
        actorId: user?.uid || "unknown",
        metadata: metadata || {},
        createdAt: serverTimestamp(),
      });
    },
    [user?.email, user?.uid]
  );

  const loadAuditLogs = useCallback(async () => {
    try {
      const auditQuery = query(collection(db, "adminAuditLogs"), orderBy("createdAt", "desc"), limit(8));
      const auditSnapshot = await getDocs(auditQuery);
      setAuditLogs(auditSnapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() } as AdminAuditLog)));
    } catch {
      setAuditLogs([]);
    }
  }, []);

  const loadQualityItems = useCallback(async () => {
    setLoading(true);
    try {
      const qualitySnapshot = await getDocs(collection(db, "adminQuality"));
      const savedItems: Record<string, PersistedQualityItem> = {};

      qualitySnapshot.forEach((entry) => {
        savedItems[entry.id] = entry.data() as PersistedQualityItem;
      });

      if (qualitySnapshot.empty) {
        await Promise.all(
          contentQualityItems.map((item) =>
            setDoc(doc(db, "adminQuality", item.id), {
              title: item.title,
              description: item.description,
              owner: item.owner,
              status: item.status,
              note: "",
              updatedBy: user?.email || "initialisation",
              updatedAt: serverTimestamp(),
            })
          )
        );
        await writeAuditLog("quality.seeded", "adminQuality", "Initialisation des points de contrôle qualité.");
      }

      const nextItems = mergeQualityItems(savedItems);
      setItems(nextItems);
      setDraftNotes(Object.fromEntries(nextItems.map((item) => [item.id, item.note || ""])));
      await loadAuditLogs();
    } catch (error) {
      console.error(error);
      toast.error("Impossible de charger le centre qualité.");
      setItems(contentQualityItems);
    } finally {
      setLoading(false);
    }
  }, [loadAuditLogs, user?.email, writeAuditLog]);

  useEffect(() => {
    void loadQualityItems();
  }, [loadQualityItems]);

  const updateStatus = async (item: QualityViewItem, nextStatus: QualityStatus) => {
    if (item.status === nextStatus) return;

    setSavingId(item.id);
    const previousStatus = item.status;
    setItems((currentItems) =>
      currentItems.map((currentItem) => (currentItem.id === item.id ? { ...currentItem, status: nextStatus, updatedBy: user?.email || "administrateur" } : currentItem))
    );

    try {
      await setDoc(
        doc(db, "adminQuality", item.id),
        {
          title: item.title,
          description: item.description,
          owner: item.owner,
          status: nextStatus,
          updatedBy: user?.email || "administrateur",
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
      await writeAuditLog(
        "quality.status_changed",
        item.id,
        `${item.title} : ${statusLabels[previousStatus]} vers ${statusLabels[nextStatus]}.`,
        { previousStatus, nextStatus }
      );
      await loadAuditLogs();
      toast.success("Statut sauvegardé.");
    } catch (error) {
      console.error(error);
      setItems((currentItems) => currentItems.map((currentItem) => (currentItem.id === item.id ? { ...currentItem, status: previousStatus } : currentItem)));
      toast.error("Sauvegarde impossible.");
    } finally {
      setSavingId(null);
    }
  };

  const saveNote = async (item: QualityViewItem) => {
    setSavingId(item.id);
    const note = draftNotes[item.id] || "";

    try {
      await setDoc(
        doc(db, "adminQuality", item.id),
        {
          note,
          updatedBy: user?.email || "administrateur",
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
      setItems((currentItems) => currentItems.map((currentItem) => (currentItem.id === item.id ? { ...currentItem, note } : currentItem)));
      await writeAuditLog("quality.note_updated", item.id, `Note qualité mise à jour pour ${item.title}.`);
      await loadAuditLogs();
      toast.success("Note enregistrée.");
    } catch (error) {
      console.error(error);
      toast.error("Impossible d'enregistrer la note.");
    } finally {
      setSavingId(null);
    }
  };

  const exportChecklist = async () => {
    const content = [
      "LMO Quran Learning - Checklist qualite",
      "",
      "Mobile",
      ...mobileQualityChecklist.map((item) => `- ${item}`),
      "",
      "Standards editoriaux",
      ...editorialStandards.map((item) => `- ${item}`),
    ].join("\n");

    const url = URL.createObjectURL(new Blob([content], { type: "text/plain;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "lmo-checklist-qualite.txt";
    link.click();
    URL.revokeObjectURL(url);

    try {
      await writeAuditLog("quality.checklist_exported", "checklist", "Export de la checklist qualité.");
      await loadAuditLogs();
    } catch {
      // L'export local ne doit pas échouer si le journal distant est indisponible.
    }
  };

  const filteredItems = useMemo(() => {
    const normalizedQuery = queryText.trim().toLowerCase();
    if (!normalizedQuery) return items;

    return items.filter((item) =>
      [item.title, item.description, item.owner, item.note || "", statusLabels[item.status]].some((value) =>
        value.toLowerCase().includes(normalizedQuery)
      )
    );
  }, [items, queryText]);

  const reviewCount = items.filter((item) => item.status === "review").length;
  const stableCount = items.filter((item) => item.status === "stable").length;

  return (
    <div className="space-y-6">
      <header className="rounded-[2rem] bg-slate-950 p-6 text-white">
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-gold">Qualité</p>
        <h1 className="mt-2 text-3xl font-heading font-bold">Contrôle éditorial et mobile</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
          Les statuts et notes sont sauvegardés. Chaque modification laisse une trace dans le journal admin.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
              Points stables
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stableCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5 text-amber-600" />
              À relire
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{reviewCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-sky-600" />
              Standards
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{editorialStandards.length}</p>
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            Priorités d'amélioration
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left dark:border-slate-800">
                <th className="py-3 pr-3">Priorité</th>
                <th className="py-3 pr-3">Zone</th>
                <th className="py-3 pr-3">Sujet</th>
                <th className="py-3 pr-3">Action attendue</th>
              </tr>
            </thead>
            <tbody>
              {qualityBacklog.map((item) => (
                <tr key={item.id} className="border-b border-slate-100 dark:border-slate-800">
                  <td className="py-3 pr-3">
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${priorityClasses[item.priority]}`}>{item.priority}</span>
                  </td>
                  <td className="py-3 pr-3 font-semibold text-slate-700 dark:text-slate-200">{item.area}</td>
                  <td className="py-3 pr-3 text-slate-950 dark:text-white">{item.title}</td>
                  <td className="py-3 pr-3 text-slate-600 dark:text-slate-300">{item.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col gap-3 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
          <label className="flex min-h-12 flex-1 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 dark:border-slate-800 dark:bg-slate-950">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              value={queryText}
              onChange={(event) => setQueryText(event.target.value)}
              placeholder="Rechercher un point de contrôle..."
              className="w-full bg-transparent text-sm outline-none"
            />
          </label>
          <Button variant="outline" onClick={() => void loadQualityItems()} className="min-h-12">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Actualiser
          </Button>
        </CardContent>
      </Card>

      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="grid gap-4">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            const isSaving = savingId === item.id;

            return (
              <Card key={item.id}>
                <CardContent className="space-y-4 p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex gap-3">
                      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-emerald-100 text-emerald-900 dark:bg-emerald-950/60 dark:text-gold">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h2 className="font-heading text-lg font-bold text-slate-950 dark:text-white">{item.title}</h2>
                        <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{item.description}</p>
                        <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{item.owner}</p>
                      </div>
                    </div>
                    <span className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${statusClasses[item.status]}`}>
                      {statusLabels[item.status]}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {statusOptions.map((status) => (
                      <Button
                        key={status}
                        size="sm"
                        variant={item.status === status ? "default" : "outline"}
                        disabled={isSaving}
                        onClick={() => void updateStatus(item, status)}
                      >
                        {item.status === status ? <CheckCircle2 className="mr-2 h-4 w-4" /> : null}
                        {statusLabels[status]}
                      </Button>
                    ))}
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
                    <label className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                      Note interne
                    </label>
                    <textarea
                      value={draftNotes[item.id] || ""}
                      onChange={(event) => setDraftNotes((current) => ({ ...current, [item.id]: event.target.value }))}
                      rows={3}
                      placeholder="Ajouter une remarque de relecture, un correctif ou une décision pédagogique..."
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-white p-3 text-sm outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-900"
                    />
                    <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Dernière modification : {item.updatedBy || "non renseignée"}
                      </p>
                      <Button size="sm" disabled={isSaving} onClick={() => void saveNote(item)}>
                        {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Enregistrer la note
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <aside className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Checklist mobile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mobileQualityChecklist.map((item) => (
                <p key={item} className="flex gap-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700 dark:text-gold" />
                  {item}
                </p>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Standards éditoriaux</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {editorialStandards.map((item) => (
                <p key={item} className="flex gap-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700 dark:text-gold" />
                  {item}
                </p>
              ))}
              <Button variant="outline" onClick={() => void exportChecklist()} className="mt-2 w-full">
                Exporter la checklist
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5 text-emerald-600" />
                Dernières actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {auditLogs.length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-slate-400">Aucun journal disponible pour le moment.</p>
              ) : (
                auditLogs.map((log) => (
                  <div key={log.id} className="rounded-2xl border border-slate-200 p-3 dark:border-slate-800">
                    <p className="text-sm font-semibold text-slate-950 dark:text-white">
                      {adminAuditActionLabels[log.action] || log.action}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{log.summary}</p>
                    <p className="mt-2 text-xs text-slate-400">
                      {log.actorEmail} · {formatAdminAuditDate(log.createdAt)}
                    </p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </aside>
      </section>
    </div>
  );
}
