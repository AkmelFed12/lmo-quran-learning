"use client";

import { useEffect, useMemo, useState } from "react";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { Download, History, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/firebase";
import { adminAuditActionLabels, formatAdminAuditDate, type AdminAuditLog } from "@/lib/admin-audit";

export default function AdminAuditPage() {
  const [logs, setLogs] = useState<AdminAuditLog[]>([]);
  const [queryText, setQueryText] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLogs = async () => {
      setLoading(true);
      try {
        const auditQuery = query(collection(db, "adminAuditLogs"), orderBy("createdAt", "desc"), limit(100));
        const snapshot = await getDocs(auditQuery);
        setLogs(snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() } as AdminAuditLog)));
      } catch {
        setLogs([]);
      } finally {
        setLoading(false);
      }
    };

    void loadLogs();
  }, []);

  const filteredLogs = useMemo(() => {
    const normalizedQuery = queryText.trim().toLowerCase();
    if (!normalizedQuery) return logs;

    return logs.filter((log) =>
      [log.action, adminAuditActionLabels[log.action] || "", log.summary, log.actorEmail, log.targetId].some((value) =>
        value.toLowerCase().includes(normalizedQuery)
      )
    );
  }, [logs, queryText]);

  const exportLogs = () => {
    const content = [
      "LMO Quran Learning - Journal admin",
      "",
      ...filteredLogs.map((log) =>
        [
          `[${formatAdminAuditDate(log.createdAt)}] ${adminAuditActionLabels[log.action] || log.action}`,
          `Acteur: ${log.actorEmail}`,
          `Cible: ${log.targetType}/${log.targetId}`,
          `Résumé: ${log.summary}`,
          "",
        ].join("\n")
      ),
    ].join("\n");

    const url = URL.createObjectURL(new Blob([content], { type: "text/plain;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "lmo-journal-admin.txt";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 rounded-[2rem] bg-slate-950 p-6 text-white lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-gold">Audit</p>
          <h1 className="mt-2 text-3xl font-heading font-bold">Journal administrateur</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
            Historique des actions importantes : relecture, statuts qualité, exports et futures validations de contenu.
          </p>
        </div>
        <Button onClick={exportLogs} disabled={filteredLogs.length === 0} className="min-h-12">
          <Download className="mr-2 h-4 w-4" />
          Exporter
        </Button>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5 text-emerald-600" />
              Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{logs.length}</p>
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
          <CardContent className="p-4 sm:p-5">
            <label className="flex min-h-12 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 dark:border-slate-800 dark:bg-slate-950">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                value={queryText}
                onChange={(event) => setQueryText(event.target.value)}
                placeholder="Rechercher une action, un acteur ou une cible..."
                className="w-full bg-transparent text-sm outline-none"
              />
            </label>
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardContent className="p-0">
          <div className="table-scroll">
            <table className="w-full min-w-[760px] text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left dark:border-slate-800">
                  <th className="p-4">Date</th>
                  <th className="p-4">Action</th>
                  <th className="p-4">Acteur</th>
                  <th className="p-4">Cible</th>
                  <th className="p-4">Résumé</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-slate-500">
                      Chargement du journal...
                    </td>
                  </tr>
                ) : filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-slate-500">
                      Aucun résultat.
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="border-b border-slate-100 dark:border-slate-800">
                      <td className="p-4 text-slate-500 dark:text-slate-400">{formatAdminAuditDate(log.createdAt)}</td>
                      <td className="p-4 font-semibold">{adminAuditActionLabels[log.action] || log.action}</td>
                      <td className="p-4">{log.actorEmail}</td>
                      <td className="p-4 font-mono text-xs">{log.targetType}/{log.targetId}</td>
                      <td className="p-4 text-slate-600 dark:text-slate-300">{log.summary}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
