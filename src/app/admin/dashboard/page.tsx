"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { AlertTriangle, ArrowRight, BookOpen, ClipboardCheck, FileWarning, HeartHandshake, RefreshCw, ShieldCheck, TrendingUp, Users } from "lucide-react";
import { QUESTION_BANK_SIZE } from "@/lib/question-bank";

type AdminUserRow = {
  id: string;
  displayName?: string;
  email?: string;
};

const qualityQueue = [
  "Vérifier les exemples de tajwid ajoutés récemment.",
  "Relire les textes publics avant publication.",
  "Contrôler les signalements du forum.",
];

const moduleHealth = [
  { label: "Coran", value: "Stable", tone: "text-emerald-700 dark:text-emerald-300" },
  { label: "Arabe", value: "À enrichir", tone: "text-amber-700 dark:text-amber-300" },
  { label: "Mémorisation", value: "Actif", tone: "text-emerald-700 dark:text-emerald-300" },
  { label: "Forum", value: "À modérer", tone: "text-rose-700 dark:text-rose-300" },
];

const quickActions = [
  { href: "/admin/content", title: "Publier une leçon", text: "Brouillon, relecture, publication.", icon: BookOpen },
  { href: "/admin/questions", title: "Contrôler les questions", text: "Banque, formulations, niveaux.", icon: ClipboardCheck },
  { href: "/admin/quality", title: "Audit qualité", text: "Fautes, sources, cohérence.", icon: ShieldCheck },
];

const learningChecks = [
  "Un module doit avoir un objectif clair, une pratique et une validation.",
  "Une question doit évaluer une compétence précise, sans piège inutile.",
  "Toute explication liée au Coran doit rester sobre et vérifiable.",
];

const monetizationChecks = [
  "Vérifier que les annonces ne couvrent jamais le texte coranique ni les boutons audio.",
  "Contrôler régulièrement les revenus, impressions et alertes dans Google AdSense.",
  "Garder le soutien Wave facultatif, clair et séparé de la progression pédagogique.",
];

export default function AdminDashboard() {
  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalSessions: 0, totalQuizzes: 0, totalContacts: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [usersSnap, memSnap, progSnap, contactsSnap] = await Promise.all([
        getDocs(collection(db, "users")),
        getDocs(collection(db, "memorization")),
        getDocs(collection(db, "progress")),
        getDocs(collection(db, "contacts")),
      ]);

      let sessions = 0;
      memSnap.forEach((item) => {
        sessions += item.data().sessions?.length || 0;
      });
      let quizzes = 0;
      progSnap.forEach((item) => {
        quizzes += item.data().arabic?.quizzesPassed || 0;
      });

      setStats({
        totalUsers: usersSnap.size,
        totalSessions: sessions,
        totalQuizzes: quizzes,
        totalContacts: contactsSnap.size,
      });
      setUsers(
        usersSnap.docs.slice(0, 8).map((item) => {
          const data = item.data();
          return {
            id: item.id,
            displayName: typeof data.displayName === "string" ? data.displayName : undefined,
            email: typeof data.email === "string" ? data.email : undefined,
          };
        })
      );
    } catch (fetchError) {
      console.error(fetchError);
      setError("Impossible de charger toutes les statistiques. Vérifiez les règles Firebase et la connexion.");
      toast.error("Chargement admin incomplet.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const deleteUser = async (userId: string) => {
    if (!confirm("Supprimer cet utilisateur ?")) return;
    try {
      await deleteDoc(doc(db, "users", userId));
      toast.success("Utilisateur supprimé.");
      await fetchData();
    } catch {
      toast.error("Suppression impossible pour le moment.");
    }
  };

  const statCards = [
    { label: "Utilisateurs", value: stats.totalUsers, icon: Users, color: "text-emerald-600" },
    { label: "Sessions de mémorisation", value: stats.totalSessions, icon: BookOpen, color: "text-sky-600" },
    { label: "Quiz réussis", value: stats.totalQuizzes, icon: TrendingUp, color: "text-amber-600" },
    { label: "Banque de questions", value: QUESTION_BANK_SIZE.toLocaleString("fr-FR"), icon: ClipboardCheck, color: "text-emerald-600" },
  ];

  return (
    <div className="space-y-6">
      <header className="rounded-[2rem] bg-slate-950 p-6 text-white">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-gold">Administration</p>
            <h1 className="mt-2 text-3xl font-heading font-bold">Pilotage pédagogique et opérationnel</h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
              Suivi des apprenants, qualité du contenu, modération et santé globale de la plateforme.
            </p>
          </div>
          <Button onClick={() => void fetchData()} disabled={loading} className="min-h-11 bg-gold text-slate-950 hover:bg-amber-300">
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Actualiser
          </Button>
        </div>
      </header>

      {error && (
        <div className="rounded-[1.5rem] border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-100">
          {error}
        </div>
      )}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.label}>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">{card.label}</CardTitle>
                <Icon className={`h-5 w-5 ${card.color}`} />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{loading ? "..." : card.value}</p>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Link key={action.href} href={action.href} className="group rounded-[1.5rem] border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-gold/50 hover:shadow-lg dark:border-white/10 dark:bg-slate-900">
              <div className="flex items-start justify-between gap-3">
                <Icon className="h-5 w-5 text-emerald-700 dark:text-gold" />
                <ArrowRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-1 group-hover:text-gold" />
              </div>
              <h2 className="mt-4 font-bold text-slate-950 dark:text-white">{action.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{action.text}</p>
            </Link>
          );
        })}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <Card>
          <CardHeader>
            <CardTitle>Derniers utilisateurs</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="py-2 text-left">UID</th>
                  <th className="py-2 text-left">Nom</th>
                  <th className="py-2 text-left">E-mail</th>
                  <th className="py-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-slate-500">Chargement des utilisateurs...</td>
                  </tr>
                )}
                {!loading && users.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-slate-500">Aucun utilisateur à afficher pour le moment.</td>
                  </tr>
                )}
                {!loading && users.map((user) => (
                  <tr key={user.id} className="border-b border-slate-100 dark:border-slate-800">
                    <td className="py-3 font-mono text-xs">{user.id.substring(0, 8)}…</td>
                    <td className="py-3">{user.displayName || "-"}</td>
                    <td className="py-3">{user.email}</td>
                    <td className="py-3 text-right">
                      <Button size="sm" variant="outline" onClick={() => deleteUser(user.id)} className="text-red-500">
                        Supprimer
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <div className="space-y-5">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileWarning className="h-5 w-5 text-amber-500" />
                Qualité du contenu
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {qualityQueue.map((item) => (
                <div key={item} className="rounded-2xl bg-amber-50 p-3 text-sm text-amber-950 dark:bg-amber-950/30 dark:text-amber-100">
                  {item}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HeartHandshake className="h-5 w-5 text-emerald-600" />
                Soutien et monétisation
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              {monetizationChecks.map((item) => (
                <div key={item} className="rounded-2xl border border-slate-100 p-3 text-sm leading-6 text-slate-600 dark:border-slate-800 dark:text-slate-300">
                  {item}
                </div>
              ))}
              <Link href="/support" className="mt-2 inline-flex items-center gap-2 text-sm font-bold text-emerald-800 hover:text-emerald-950 dark:text-gold">
                Voir la page de soutien
                <ArrowRight className="h-4 w-4" />
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
                Santé des modules
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              {moduleHealth.map((item) => (
                <div key={item.label} className="flex items-center justify-between rounded-2xl border border-slate-100 p-3 text-sm dark:border-slate-800">
                  <span>{item.label}</span>
                  <span className={`font-semibold ${item.tone}`}>{item.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardCheck className="h-5 w-5 text-emerald-600" />
                Standard pédagogique
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              {learningChecks.map((item) => (
                <div key={item} className="rounded-2xl border border-slate-100 p-3 text-sm leading-6 text-slate-600 dark:border-slate-800 dark:text-slate-300">
                  {item}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-rose-500" />
            Journal d'activité administrateur
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 text-sm text-slate-600 dark:text-slate-300">
          <p>Dernière synchronisation des statistiques : maintenant.</p>
          <p>Les modifications locales du contenu sont conservées dans le navigateur administrateur.</p>
          <p>Prochaine étape recommandée : connecter ces journaux à Firestore pour un audit multi-admin.</p>
        </CardContent>
      </Card>
    </div>
  );
}
