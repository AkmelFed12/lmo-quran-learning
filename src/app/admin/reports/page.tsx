"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { AlertTriangle, CheckCircle2, MessageSquare, ShieldAlert } from "lucide-react";

const initialReports = [
  {
    id: "REP-001",
    type: "Forum",
    title: "Message à relire",
    description: "Un message utilisateur doit être vérifié avant mise en avant.",
    priority: "Moyenne",
    status: "Ouvert",
  },
  {
    id: "REP-002",
    type: "Contenu",
    title: "Correction pédagogique",
    description: "Une règle de tajwid doit être relue par un enseignant.",
    priority: "Haute",
    status: "En revue",
  },
  {
    id: "REP-003",
    type: "Technique",
    title: "Audio à contrôler",
    description: "Un apprenant signale un chargement audio lent sur mobile.",
    priority: "Basse",
    status: "Ouvert",
  },
];

export default function AdminReportsPage() {
  const [reports, setReports] = useState(initialReports);

  const resolveReport = (id: string) => {
    setReports((current) => current.map((report) => report.id === id ? { ...report, status: "Résolu" } : report));
    toast.success("Signalement marqué comme résolu.");
  };

  return (
    <div className="space-y-6">
      <header className="rounded-[2rem] bg-slate-950 p-6 text-white">
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-gold">Modération</p>
        <h1 className="mt-2 text-3xl font-heading font-bold">Signalements et suivi qualité</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
          Centralisez les alertes liées au forum, au contenu pédagogique, aux audios et à l'expérience mobile.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-amber-500" /> Ouverts</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">{reports.filter((report) => report.status === "Ouvert").length}</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><ShieldAlert className="h-5 w-5 text-rose-500" /> En revue</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">{reports.filter((report) => report.status === "En revue").length}</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-emerald-600" /> Résolus</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">{reports.filter((report) => report.status === "Résolu").length}</p></CardContent>
        </Card>
      </section>

      <div className="grid gap-4">
        {reports.map((report) => (
          <Card key={report.id}>
            <CardContent className="grid gap-4 p-5 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-amber-500" />
                  <span className="font-mono text-xs text-slate-500">{report.id}</span>
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold dark:bg-slate-800">{report.type}</span>
                  <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-950">{report.priority}</span>
                  <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-950">{report.status}</span>
                </div>
                <h2 className="mt-3 font-semibold">{report.title}</h2>
                <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{report.description}</p>
              </div>
              <Button variant="outline" disabled={report.status === "Résolu"} onClick={() => resolveReport(report.id)}>
                Marquer résolu
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
