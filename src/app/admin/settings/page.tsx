"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { KeyRound, Save, ShieldCheck, Users } from "lucide-react";

interface Settings {
  siteName: string;
  contactEmail: string;
  maxDailyGoal: number;
}

const STORAGE_KEY = "admin_settings";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    siteName: "LMO Quran Learning",
    contactEmail: "ouattaralm12@gmail.com",
    maxDailyGoal: 50,
  });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setSettings(JSON.parse(saved));
  }, []);

  const saveSettings = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    toast.success("Paramètres sauvegardés.");
  };

  return (
    <div className="space-y-6">
      <header className="rounded-[2rem] bg-slate-950 p-6 text-white">
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-gold">Paramètres admin</p>
        <h1 className="mt-2 text-3xl font-heading font-bold">Sécurité, rôles et configuration</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
          Centralisez les réglages importants et gardez une trace claire des responsabilités.
        </p>
      </header>

      <Card>
        <CardHeader><CardTitle>Configuration générale</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Nom du site</label>
            <input
              value={settings.siteName}
              onChange={e => setSettings({...settings, siteName: e.target.value})}
              className="w-full rounded-lg border px-3 py-2"
            />
          </div>
          <div>
            <label className="text-sm font-medium">E-mail de contact</label>
            <input
              type="email"
              value={settings.contactEmail}
              onChange={e => setSettings({...settings, contactEmail: e.target.value})}
              className="w-full rounded-lg border px-3 py-2"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Objectif quotidien maximum</label>
            <input
              type="number"
              value={settings.maxDailyGoal}
              onChange={e => setSettings({...settings, maxDailyGoal: +e.target.value})}
              className="w-full rounded-lg border px-3 py-2"
            />
          </div>
          <Button onClick={saveSettings}><Save className="w-4 h-4 mr-1" /> Sauvegarder</Button>
        </CardContent>
      </Card>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-emerald-600" />
              Rôles prévus
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {[
              ["Admin", "Accès complet, sécurité, utilisateurs et configuration."],
              ["Éditeur", "Création et correction des articles, leçons et quiz."],
              ["Enseignant", "Validation pédagogique, tajwid et méthodologie."],
              ["Modérateur", "Forum, témoignages, messages et signalements."],
            ].map(([role, description]) => (
              <div key={role} className="rounded-2xl border border-slate-100 p-4 dark:border-slate-800">
                <p className="font-semibold">{role}</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
              Sécurité administrateur
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
            <p>
              Le mot de passe administrateur doit être modifié depuis le compte Firebase Auth associé à l'e-mail admin. Pour une version multi-admin, les rôles doivent être stockés côté base de données et protégés par règles serveur.
            </p>
            <div className="rounded-2xl bg-amber-50 p-4 text-amber-950 dark:bg-amber-950/30 dark:text-amber-100">
              Évitez les mots de passe simples en production. Activez une adresse administrateur dédiée et limitez l'accès à l'URL admin.
            </div>
            <Button variant="outline" onClick={() => toast.info("Utilisez le profil administrateur ou Firebase Auth pour modifier le mot de passe.")}>
              <KeyRound className="mr-2 h-4 w-4" />
              Procédure de changement
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
