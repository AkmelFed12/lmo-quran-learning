"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { toast } from "sonner";
import { Archive, AlertTriangle, CheckCircle2, Clock3, Eye, FileText, Loader2, Plus, Save, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/hooks/useAuth";
import { requestConfirmation } from "@/lib/confirm-action";
import {
  contentStatusClasses,
  contentStatusLabels,
  contentStatuses,
  contentTypeLabels,
  seedLearningContents,
  type AdminContentItem,
  type AdminContentStatus,
  type AdminContentType,
} from "@/lib/content-workflow";

const emptyContent: AdminContentItem = {
  id: "",
  slug: "",
  title: "",
  excerpt: "",
  body: "",
  type: "lesson",
  status: "draft",
  level: "Débutant",
  module: "Arabe",
  qualityNotes: "",
};

function makeContentId(slug: string) {
  return slug.trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "") || `contenu-${Date.now()}`;
}

function formatDate(value: unknown) {
  if (!value) return "-";
  if (typeof value === "object" && value !== null && "toDate" in value && typeof value.toDate === "function") {
    return value.toDate().toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" });
  }
  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" });
}

function getContentQualityIssues(item: AdminContentItem) {
  const issues: string[] = [];
  if (!item.title.trim()) issues.push("Ajouter un titre clair.");
  if (!item.slug.trim()) issues.push("Ajouter un slug propre.");
  if (item.excerpt.trim().length < 30) issues.push("Rédiger un extrait d'au moins 30 caractères.");
  if (item.body.trim().length < 80) issues.push("Compléter le corps du contenu.");
  if (item.qualityNotes.trim().length < 20) issues.push("Ajouter une note de relecture ou de source.");
  return issues;
}

export default function AdminContentPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<AdminContentItem[]>([]);
  const [editItem, setEditItem] = useState<AdminContentItem | null>(null);
  const [previewItem, setPreviewItem] = useState<AdminContentItem | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<AdminContentStatus | "all">("all");

  const writeHistory = useCallback(async (contentId: string, action: string, summary: string, metadata?: Record<string, unknown>) => {
    await addDoc(collection(db, "adminContentHistory"), {
      contentId,
      action,
      summary,
      actorEmail: user?.email || "administrateur",
      actorId: user?.uid || "unknown",
      metadata: metadata || {},
      createdAt: serverTimestamp(),
    });

    await addDoc(collection(db, "adminAuditLogs"), {
      action,
      targetType: "content",
      targetId: contentId,
      summary,
      actorEmail: user?.email || "administrateur",
      actorId: user?.uid || "unknown",
      metadata: metadata || {},
      createdAt: serverTimestamp(),
    });
  }, [user?.email, user?.uid]);

  const loadContent = useCallback(async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(query(collection(db, "adminContents"), orderBy("updatedAt", "desc")));
      if (snapshot.empty) {
        await Promise.all(
          seedLearningContents.map((item) =>
            setDoc(doc(db, "adminContents", item.id), {
              ...item,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
              updatedBy: user?.email || "initialisation",
            })
          )
        );
        await writeHistory("adminContents", "content.seeded", "Initialisation de la base de contenus pédagogiques.");
      }

      const nextSnapshot = snapshot.empty ? await getDocs(query(collection(db, "adminContents"), orderBy("updatedAt", "desc"))) : snapshot;
      setItems(nextSnapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() } as AdminContentItem)).filter((item) => item.archived !== true));

      const historySnapshot = await getDocs(query(collection(db, "adminContentHistory"), orderBy("createdAt", "desc")));
      setHistory(historySnapshot.docs.slice(0, 12).map((entry) => ({ id: entry.id, ...entry.data() })));
    } catch (error) {
      console.error(error);
      toast.error("Impossible de charger les contenus.");
    } finally {
      setLoading(false);
    }
  }, [user?.email, writeHistory]);

  useEffect(() => {
    void loadContent();
  }, [loadContent]);

  const saveContent = async () => {
    if (!editItem) return;
    if (!editItem.title.trim() || !editItem.slug.trim()) {
      toast.error("Titre et slug sont obligatoires.");
      return;
    }
    const qualityIssues = getContentQualityIssues(editItem);
    if (editItem.status === "published" && qualityIssues.length > 0) {
      toast.error("Publication bloquée : complétez le contrôle qualité.");
      return;
    }

    const contentId = editItem.id || makeContentId(editItem.slug);
    const exists = items.some((item) => item.id === contentId);

    try {
      const payload = {
        ...editItem,
        id: contentId,
        updatedAt: serverTimestamp(),
        updatedBy: user?.email || "administrateur",
        ...(exists ? {} : { createdAt: serverTimestamp() }),
      };
      await setDoc(
        doc(db, "adminContents", contentId),
        payload,
        { merge: true }
      );
      await writeHistory(
        contentId,
        exists ? "content.updated" : "content.created",
        `${exists ? "Modification" : "Création"} du contenu : ${editItem.title}.`,
        { status: editItem.status, type: editItem.type }
      );
      toast.success("Contenu sauvegardé.");
      setEditItem(null);
      setPreviewItem(null);
      void loadContent();
    } catch (error) {
      console.error(error);
      toast.error("Sauvegarde impossible.");
    }
  };

  const changeStatus = async (item: AdminContentItem, nextStatus: AdminContentStatus) => {
    if (item.status === nextStatus) return;
    const qualityIssues = getContentQualityIssues(item);
    if (nextStatus === "published" && qualityIssues.length > 0) {
      toast.error("Publication bloquée : contenu incomplet ou non relu.");
      setPreviewItem(item);
      return;
    }
    const previousStatus = item.status;
    setItems((current) => current.map((entry) => (entry.id === item.id ? { ...entry, status: nextStatus } : entry)));

    try {
      await setDoc(
        doc(db, "adminContents", item.id),
        {
          status: nextStatus,
          updatedAt: serverTimestamp(),
          updatedBy: user?.email || "administrateur",
        },
        { merge: true }
      );
      await writeHistory(
        item.id,
        "content.status_changed",
        `${item.title} : ${contentStatusLabels[previousStatus]} vers ${contentStatusLabels[nextStatus]}.`,
        { previousStatus, nextStatus }
      );
      toast.success("Statut mis à jour.");
      void loadContent();
    } catch (error) {
      console.error(error);
      setItems((current) => current.map((entry) => (entry.id === item.id ? { ...entry, status: previousStatus } : entry)));
      toast.error("Statut non sauvegardé.");
    }
  };

  const removeContent = async (item: AdminContentItem) => {
    await setDoc(
      doc(db, "adminContents", item.id),
      {
        archived: true,
        archivedAt: serverTimestamp(),
        archivedBy: user?.email || "administrateur",
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
    await writeHistory(item.id, "content.archived", `Archivage du contenu : ${item.title}.`);
    toast.success("Contenu archivé sans suppression.");
    void loadContent();
  };

  const requestArchiveContent = (item: AdminContentItem) => {
    requestConfirmation({
      title: "Archiver ce contenu ?",
      description: "Il restera conservé en base et pourra être retrouvé dans l'historique.",
      confirmLabel: "Archiver",
      onConfirm: () => removeContent(item),
    });
  };

  const statusCount = (status: AdminContentStatus) => items.filter((item) => item.status === status).length;
  const qualityReady = items.filter((item) => item.title && item.excerpt && item.body && item.qualityNotes && item.status === "published").length;
  const qualityScore = items.length ? Math.round((qualityReady / items.length) * 100) : 0;
  const priorityItems = items.filter((item) => item.status === "fix" || getContentQualityIssues(item).length > 0).slice(0, 5);
  const filteredItems = useMemo(
    () => (filterStatus === "all" ? items : items.filter((item) => item.status === filterStatus)),
    [filterStatus, items]
  );

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 rounded-[2rem] bg-slate-950 p-6 text-white lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-gold">Contenu</p>
          <h1 className="mt-2 text-3xl font-heading font-bold">Workflow éditorial</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
            Articles, leçons, règles de tajwid, quiz et sources avec validation, notes qualité et historique par contenu.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => setEditItem({ ...emptyContent })} className="min-h-12">
            <Plus className="mr-2 h-4 w-4" /> Nouveau contenu
          </Button>
          <Button variant="outline" onClick={() => void loadContent()} className="min-h-12 border-white/20 text-white hover:bg-white/10">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Actualiser
          </Button>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-4">
        {contentStatuses.map((status) => (
          <Card key={status}>
            <CardHeader><CardTitle>{contentStatusLabels[status]}</CardTitle></CardHeader>
            <CardContent><p className="text-3xl font-bold">{statusCount(status)}</p></CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-emerald-600" /> Qualité éditoriale</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{qualityScore}%</p>
            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">Prêt lorsque le contenu est publié, complet et accompagné d'une note de relecture.</p>
            <div className="mt-4 h-2 rounded-full bg-emerald-100 dark:bg-emerald-950/50">
              <div className="h-full rounded-full bg-gradient-to-r from-emerald-700 to-gold" style={{ width: `${qualityScore}%` }} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Clock3 className="h-5 w-5 text-gold" /> Historique récent</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {history.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">Aucune modification enregistrée.</p>
            ) : (
              history.slice(0, 5).map((log) => (
                <div key={log.id} className="rounded-2xl border border-slate-100 p-3 text-sm dark:border-slate-800">
                  <p className="font-semibold">{log.summary}</p>
                  <p className="mt-1 text-xs text-slate-500">{log.actorEmail || "administrateur"}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardContent className="flex flex-wrap gap-2 p-4">
          <Button size="sm" variant={filterStatus === "all" ? "default" : "outline"} onClick={() => setFilterStatus("all")}>Tous</Button>
          {contentStatuses.map((status) => (
            <Button key={status} size="sm" variant={filterStatus === status ? "default" : "outline"} onClick={() => setFilterStatus(status)}>
              {contentStatusLabels[status]}
            </Button>
          ))}
        </CardContent>
      </Card>

      {editItem && (
        <Card>
            <CardHeader><CardTitle>{editItem.id ? "Modifier le contenu" : "Nouveau contenu"}</CardTitle></CardHeader>
            <CardContent className="grid gap-3">
            {getContentQualityIssues(editItem).length > 0 && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950 dark:border-amber-900/60 dark:bg-amber-950/25 dark:text-amber-100">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                  <div>
                    <p className="font-bold">À compléter avant publication</p>
                    <div className="mt-2 grid gap-1">
                      {getContentQualityIssues(editItem).map((issue) => (
                        <p key={issue}>{issue}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="grid gap-3 md:grid-cols-4">
              <input placeholder="Slug" value={editItem.slug} onChange={(event) => setEditItem({ ...editItem, slug: event.target.value })} className="rounded-lg border px-3 py-2 dark:border-slate-800 dark:bg-slate-950" />
              <select value={editItem.type} onChange={(event) => setEditItem({ ...editItem, type: event.target.value as AdminContentType })} className="rounded-lg border px-3 py-2 dark:border-slate-800 dark:bg-slate-950">
                {Object.entries(contentTypeLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
              <select value={editItem.status} onChange={(event) => setEditItem({ ...editItem, status: event.target.value as AdminContentStatus })} className="rounded-lg border px-3 py-2 dark:border-slate-800 dark:bg-slate-950">
                {contentStatuses.map((status) => <option key={status} value={status}>{contentStatusLabels[status]}</option>)}
              </select>
              <select value={editItem.level} onChange={(event) => setEditItem({ ...editItem, level: event.target.value as AdminContentItem["level"] })} className="rounded-lg border px-3 py-2 dark:border-slate-800 dark:bg-slate-950">
                <option value="Débutant">Débutant</option>
                <option value="Intermédiaire">Intermédiaire</option>
                <option value="Avancé">Avancé</option>
                <option value="Tous niveaux">Tous niveaux</option>
              </select>
            </div>
            <input placeholder="Module" value={editItem.module} onChange={(event) => setEditItem({ ...editItem, module: event.target.value })} className="rounded-lg border px-3 py-2 dark:border-slate-800 dark:bg-slate-950" />
            <input placeholder="Titre" value={editItem.title} onChange={(event) => setEditItem({ ...editItem, title: event.target.value })} className="rounded-lg border px-3 py-2 dark:border-slate-800 dark:bg-slate-950" />
            <input placeholder="Extrait" value={editItem.excerpt} onChange={(event) => setEditItem({ ...editItem, excerpt: event.target.value })} className="rounded-lg border px-3 py-2 dark:border-slate-800 dark:bg-slate-950" />
            <textarea rows={6} placeholder="Contenu" value={editItem.body} onChange={(event) => setEditItem({ ...editItem, body: event.target.value })} className="rounded-lg border px-3 py-2 dark:border-slate-800 dark:bg-slate-950" />
            <textarea rows={3} placeholder="Notes de qualité, corrections, sources à vérifier" value={editItem.qualityNotes} onChange={(event) => setEditItem({ ...editItem, qualityNotes: event.target.value })} className="rounded-lg border px-3 py-2 dark:border-slate-800 dark:bg-slate-950" />
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => void saveContent()}><Save className="mr-2 h-4 w-4" /> Enregistrer</Button>
              <Button variant="outline" onClick={() => setPreviewItem({ ...editItem })}><Eye className="mr-2 h-4 w-4" /> Prévisualiser</Button>
              <Button variant="outline" onClick={() => setEditItem(null)}>Annuler</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {previewItem && (
        <Card className="border-emerald-900/10 dark:border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-emerald-700 dark:text-gold" />
              Prévisualisation éditoriale
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 lg:grid-cols-[1fr_0.8fr]">
            <article className="rounded-[1.6rem] border border-emerald-900/10 bg-ivory/70 p-5 dark:border-white/10 dark:bg-white/[0.04]">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">{previewItem.module} · {previewItem.level}</p>
              <h2 className="mt-3 text-2xl font-heading font-bold text-slate-950 dark:text-white">{previewItem.title || "Titre non renseigné"}</h2>
              <p className="mt-3 text-sm font-semibold leading-6 text-emerald-800 dark:text-gold">{previewItem.excerpt || "Extrait non renseigné"}</p>
              <div className="mt-5 whitespace-pre-line rounded-2xl bg-white p-4 text-sm leading-7 text-slate-700 dark:bg-slate-950 dark:text-slate-200">
                {previewItem.body || "Corps de contenu non renseigné."}
              </div>
            </article>
            <aside className="rounded-[1.6rem] border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-slate-950">
              <h3 className="font-bold text-slate-950 dark:text-white">Contrôle avant publication</h3>
              <div className="mt-4 grid gap-2">
                {getContentQualityIssues(previewItem).length === 0 ? (
                  <p className="flex gap-2 rounded-2xl bg-emerald-50 p-3 text-sm leading-6 text-emerald-950 dark:bg-emerald-950/30 dark:text-emerald-100">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                    Le contenu respecte les critères minimums de publication.
                  </p>
                ) : (
                  getContentQualityIssues(previewItem).map((issue) => (
                    <p key={issue} className="flex gap-2 rounded-2xl bg-amber-50 p-3 text-sm leading-6 text-amber-950 dark:bg-amber-950/25 dark:text-amber-100">
                      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                      {issue}
                    </p>
                  ))
                )}
              </div>
              <p className="mt-4 rounded-2xl border border-slate-100 p-3 text-xs leading-5 text-slate-500 dark:border-slate-800 dark:text-slate-400">
                Note interne : {previewItem.qualityNotes || "aucune note renseignée"}
              </p>
            </aside>
          </CardContent>
        </Card>
      )}

      {priorityItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              À traiter en priorité
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {priorityItems.map((item) => (
              <div key={item.id} className="flex flex-col gap-3 rounded-2xl border border-slate-100 p-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-slate-950 dark:text-white">{item.title}</p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{getContentQualityIssues(item)[0] || "Contenu marqué à corriger."}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setPreviewItem(item)}>Prévisualiser</Button>
                  <Button size="sm" onClick={() => setEditItem({ ...item })}>Corriger</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {filteredItems.map((item) => (
          <Card key={item.id}>
            <CardContent className="grid gap-4 p-4 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <FileText className="h-4 w-4 text-emerald-700" />
                  <h3 className="font-semibold">{item.title}</h3>
                  <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-900">{contentTypeLabels[item.type]}</span>
                  <span className={`rounded-full px-2 py-1 text-xs font-semibold ${contentStatusClasses[item.status]}`}>{contentStatusLabels[item.status]}</span>
                </div>
                <p className="mt-2 text-sm text-slate-500">{item.excerpt}</p>
                <p className="mt-2 text-xs text-slate-400">{item.module} · {item.level} · {formatDate(item.updatedAt)}</p>
                {item.qualityNotes && (
                  <p className="mt-2 flex gap-2 text-xs text-slate-500"><CheckCircle2 className="h-4 w-4 text-emerald-600" />{item.qualityNotes}</p>
                )}
                {getContentQualityIssues(item).length > 0 && (
                  <p className="mt-2 flex gap-2 text-xs text-amber-700 dark:text-amber-300"><AlertTriangle className="h-4 w-4" />{getContentQualityIssues(item).length} point(s) qualité à compléter</p>
                )}
              </div>
              <div className="flex flex-wrap gap-2 md:justify-end">
                {contentStatuses.map((status) => (
                  <Button key={status} size="sm" variant={item.status === status ? "default" : "outline"} onClick={() => void changeStatus(item, status)}>
                    {contentStatusLabels[status]}
                  </Button>
                ))}
                <Button size="sm" variant="outline" onClick={() => setEditItem({ ...item })}>Modifier</Button>
                <Button size="sm" variant="outline" onClick={() => setPreviewItem(item)}>Prévisualiser</Button>
                <Button size="sm" variant="outline" onClick={() => requestArchiveContent(item)} className="text-amber-700">
                  <Archive className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
