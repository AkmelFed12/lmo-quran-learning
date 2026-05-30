"use client";

import { useEffect, useState } from "react";
import { Activity, CheckCircle2, RefreshCw, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { platformHealthChecks } from "@/lib/learning-content";

type HealthResult = {
  id: string;
  label: string;
  status: "ok" | "error" | "checking";
  latency?: number;
  type?: string;
};

export default function AdminMonitoringPage() {
  const [results, setResults] = useState<HealthResult[]>([]);

  const runChecks = async () => {
    setResults(platformHealthChecks.map((check) => ({ id: check.id, label: check.label, status: "checking" })));

    const nextResults = await Promise.all(
      platformHealthChecks.map(async (check) => {
        const startedAt = performance.now();
        try {
          const response = await fetch(check.href, { cache: "no-store" });
          return {
            id: check.id,
            label: check.label,
            status: response.ok ? "ok" as const : "error" as const,
            latency: Math.round(performance.now() - startedAt),
            type: response.headers.get("content-type") || undefined,
          };
        } catch {
          return {
            id: check.id,
            label: check.label,
            status: "error" as const,
            latency: Math.round(performance.now() - startedAt),
          };
        }
      })
    );

    setResults(nextResults);
  };

  useEffect(() => {
    void runChecks();
  }, []);

  const okCount = results.filter((result) => result.status === "ok").length;

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 rounded-[2rem] bg-slate-950 p-6 text-white lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-gold">Monitoring</p>
          <h1 className="mt-2 text-3xl font-heading font-bold">Santé technique</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
            Vérification rapide des services utiles : Coran, audio, PWA et disponibilité des routes critiques.
          </p>
        </div>
        <Button onClick={runChecks} className="min-h-12">
          <RefreshCw className="mr-2 h-4 w-4" />
          Relancer
        </Button>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-emerald-600" />
              Services actifs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{okCount}/{platformHealthChecks.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Build</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-slate-500 dark:text-slate-400">Next.js App Router · PWA · Firebase</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Contrôle recommandé</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-slate-500 dark:text-slate-400">Tester après chaque déploiement : audio, Coran, auth, quiz quotidien.</p>
          </CardContent>
        </Card>
      </section>

      <div className="grid gap-4">
        {results.map((result) => (
          <Card key={result.id}>
            <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                {result.status === "ok" ? (
                  <CheckCircle2 className="mt-1 h-5 w-5 text-emerald-600" />
                ) : result.status === "checking" ? (
                  <RefreshCw className="mt-1 h-5 w-5 animate-spin text-amber-500" />
                ) : (
                  <XCircle className="mt-1 h-5 w-5 text-red-500" />
                )}
                <div>
                  <p className="font-semibold">{result.label}</p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{result.type || "En attente de réponse"}</p>
                </div>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                {result.latency ? `${result.latency} ms` : result.status}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
