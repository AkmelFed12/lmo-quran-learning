"use client";
import { useState, useEffect } from "react";
import { useTheme } from "@/components/shared/ThemeProvider";
import { useLocale } from "@/lib/hooks/useLocale";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { CheckCircle2, RefreshCw, Moon, Sun, Globe, Bell, BellOff, Save, ShieldCheck, WifiOff } from "lucide-react";

export default function SettingsPage() {
  // Toujours appeler les hooks en premier, sans condition
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { locale, setLocale } = useLocale();
  const { user, profile, disabled } = useAuth();

  const [mounted, setMounted] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [lowDataMode, setLowDataMode] = useState(false);

  // Attendre que le composant soit monté côté client avant de lire des APIs navigateur
  useEffect(() => {
    setMounted(true);
    try {
      if (typeof window !== "undefined" && "Notification" in window) {
        setNotificationsEnabled(Notification.permission === "granted");
      }
      const savedLowDataMode = window.localStorage.getItem("lmo_low_data_mode") === "true";
      setLowDataMode(savedLowDataMode);
      document.documentElement.classList.toggle("low-data", savedLowDataMode);
    } catch {}
  }, []);

  const toggleLowDataMode = () => {
    const next = !lowDataMode;
    setLowDataMode(next);
    window.localStorage.setItem("lmo_low_data_mode", String(next));
    document.documentElement.classList.toggle("low-data", next);
    toast.success(next ? "Mode faible connexion activé." : "Mode faible connexion désactivé.");
  };

  const toggleNotifications = async () => {
    if (!mounted) return;
    if (!("Notification" in window)) {
      toast.error("Notifications non supportées sur ce navigateur.");
      return;
    }
    if (!notificationsEnabled) {
      try {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          setNotificationsEnabled(true);
          toast.success("Notifications activées.");
        } else {
        toast.error("Notifications refusées. Vous pouvez les autoriser depuis les réglages du navigateur.");
      }
    } catch (err) {
        toast.error("Impossible d'ouvrir la demande de permission pour le moment.");
      }
    } else {
      toast.info("Gérez les notifications dans les paramètres de votre navigateur.");
    }
  };

  const saveSettings = async () => {
    if (!user) {
      toast.error("Vous devez être connecté.");
      return;
    }
    try {
      await setDoc(
        doc(db, "users", user.uid),
        {
          preferences: {
            theme: theme || "system",
            locale: locale || "fr",
            notifications: notificationsEnabled,
            lowDataMode,
          },
        },
        { merge: true }
      );
      toast.success("Paramètres sauvegardés.");
    } catch {
      toast.error("Paramètres conservés sur l'appareil. Réessayez quand la connexion sera stable.");
    }
  };

  // Ne rien afficher tant que le client n'est pas prêt (évite les erreurs d'hydratation)
  if (!mounted) return null;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Paramètres</h2>

      <Card>
        <CardHeader>
          <CardTitle>État du compte</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/20">
            <ShieldCheck className="h-5 w-5 text-emerald-700 dark:text-emerald-300" />
            <p className="mt-3 font-semibold text-slate-950 dark:text-white">{disabled ? "Accès limité" : "Compte actif"}</p>
            <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
              {profile?.role ? `Rôle : ${profile.role}` : "Profil apprenant"}
            </p>
          </div>
          <div className="rounded-2xl border border-sky-100 bg-sky-50 p-4 dark:border-sky-900/50 dark:bg-sky-950/20">
            <RefreshCw className="h-5 w-5 text-sky-700 dark:text-sky-300" />
            <p className="mt-3 font-semibold text-slate-950 dark:text-white">Synchronisation prête</p>
            <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">Vos données sont liées à votre compte.</p>
          </div>
          <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-950/20">
            <CheckCircle2 className="h-5 w-5 text-amber-700 dark:text-amber-300" />
            <p className="mt-3 font-semibold text-slate-950 dark:text-white">{user?.email || "Session active"}</p>
            <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">Dernière vérification : maintenant.</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Apparence</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {resolvedTheme === "dark" ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
            <span>Thème</span>
          </div>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value as "light" | "dark" | "system")}
            className="w-full sm:w-48 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
          >
            <option value="system">Système</option>
            <option value="light">Clair</option>
            <option value="dark">Sombre</option>
          </select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Langue</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5" />
            <span>Langue de l'interface</span>
          </div>
          <select
            value={locale}
            onChange={(e) => setLocale(e.target.value as "fr" | "en" | "ar")}
            className="w-full sm:w-48 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
          >
            <option value="fr">Français</option>
            <option value="en">English</option>
            <option value="ar">العربية</option>
          </select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {notificationsEnabled ? (
              <Bell className="w-5 h-5 text-emerald-500" />
            ) : (
              <BellOff className="w-5 h-5 text-slate-400" />
            )}
            <span>Rappels de révision</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full sm:w-auto"
            onClick={toggleNotifications}
          >
            {notificationsEnabled ? "Désactiver" : "Activer"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Performance mobile</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <WifiOff className="mt-1 h-5 w-5 text-emerald-700 dark:text-gold" />
            <div>
              <span className="font-medium">Mode faible connexion</span>
              <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                Réduit les animations et limite les effets visuels pour garder l'application fluide sur mobile.
              </p>
            </div>
          </div>
          <Button
            variant={lowDataMode ? "default" : "outline"}
            size="sm"
            className="w-full sm:w-auto"
            onClick={toggleLowDataMode}
          >
            {lowDataMode ? "Activé" : "Activer"}
          </Button>
        </CardContent>
      </Card>

      <Button onClick={saveSettings} className="w-full">
        <Save className="w-4 h-4 mr-2" /> Sauvegarder les paramètres
      </Button>
    </div>
  );
}
