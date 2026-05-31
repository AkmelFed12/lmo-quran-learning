"use client";
import { useState, useEffect, useRef } from "react";
import {
  doc, getDoc, setDoc, updateDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/hooks/useAuth";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { User, Award, BookOpen, Target, Camera, Key } from "lucide-react";
import Image from "next/image";
import { getFirebaseAuthMessage } from "@/lib/auth-errors";

const MAX_AVATAR_SIZE = 2 * 1024 * 1024;

export default function ProfilePage() {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [dailyGoal, setDailyGoal] = useState(10);
  const [photoURL, setPhotoURL] = useState<string | null>(user?.photoURL || null);
  const [stats, setStats] = useState({ quizzes: 0, sessions: 0, totalAyahs: 0 });
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const xp = stats.quizzes * 20 + stats.sessions * 30 + stats.totalAyahs * 5;
  const level = Math.max(1, Math.floor(xp / 250) + 1);
  const currentLevelXp = (level - 1) * 250;
  const nextLevelXp = level * 250;
  const levelProgress = Math.min(100, Math.round(((xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100));

  useEffect(() => {
    if (!user) return;
    (async () => {
      const userSnap = await getDoc(doc(db, "users", user.uid));
      if (userSnap.exists()) {
        const data = userSnap.data();
        setDisplayName(data.displayName || "");
        setDailyGoal(data.dailyGoal || 10);
        if (data.photoURL) setPhotoURL(data.photoURL);
      }
      const progressSnap = await getDoc(doc(db, "progress", user.uid));
      if (progressSnap.exists()) {
        const d = progressSnap.data();
        setStats({
          quizzes: d.arabic?.quizzesPassed || 0,
          sessions: d.memorizationSessions?.length || 0,
          totalAyahs: d.stats?.totalAyahs || 0,
        });
      }
    })();
  }, [user]);

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Choisissez une image au format PNG, JPG ou WebP.");
      return;
    }
    if (file.size > MAX_AVATAR_SIZE) {
      toast.error("Image trop lourde. Choisissez une photo de moins de 2 Mo.");
      return;
    }

    setUploading(true);
    try {
      const storageRef = ref(storage, `avatars/${user.uid}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setPhotoURL(url);
      await updateDoc(doc(db, "users", user.uid), { photoURL: url });
      toast.success("Photo mise à jour !");
    } catch {
      toast.error("Photo non envoyée. Vérifiez votre connexion puis réessayez.");
    } finally {
      setUploading(false);
    }
  };

  const saveProfile = async () => {
    if (!user) return;
    const normalizedGoal = Math.min(100, Math.max(1, Number(dailyGoal) || 10));
    setDailyGoal(normalizedGoal);

    try {
      await setDoc(doc(db, "users", user.uid), {
        displayName: displayName.trim(),
        dailyGoal: normalizedGoal,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
      toast.success("Profil mis à jour.");
    } catch {
      toast.error("Profil conservé sur l'appareil. Réessayez quand la connexion sera stable.");
    }
  };

  const handleChangePassword = async () => {
    if (!user || !currentPassword || !newPassword) {
      toast.error("Veuillez remplir tous les champs.");
      return;
    }
    if (!user.email) {
      toast.error("Ce compte ne permet pas le changement de mot de passe depuis cette page.");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Choisissez un mot de passe d'au moins 6 caractères.");
      return;
    }

    setChangingPassword(true);
    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      toast.success("Mot de passe modifié !");
      setCurrentPassword("");
      setNewPassword("");
    } catch (error: unknown) {
      toast.error(getFirebaseAuthMessage(error, "Mot de passe non modifié pour le moment."));
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Profil</h2>

      <Card className="overflow-hidden border-emerald-100 bg-gradient-to-br from-emerald-600 to-teal-600 text-white dark:border-emerald-900">
        <CardContent className="p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-100">Progression</p>
              <h3 className="mt-2 text-3xl font-heading font-bold">Niveau {level}</h3>
              <p className="mt-2 text-sm text-emerald-50/85">
                {xp} XP gagnés grâce aux quiz, aux sessions et aux versets mémorisés.
              </p>
            </div>
            <div className="w-full rounded-2xl bg-white/12 p-4 md:max-w-sm">
              <div className="flex items-center justify-between text-sm text-emerald-50">
                <span>{xp - currentLevelXp} XP</span>
                <span>{nextLevelXp - currentLevelXp} XP</span>
              </div>
              <div className="mt-3 h-2 rounded-full bg-white/20">
                <div className="h-full rounded-full bg-white" style={{ width: `${levelProgress}%` }} />
              </div>
              <p className="mt-3 text-xs text-emerald-50/75">
                Encore {Math.max(nextLevelXp - xp, 0)} XP pour atteindre le niveau {level + 1}.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Carte identité */}
      <Card>
        <CardHeader><CardTitle>Informations personnelles</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-20 h-20 shrink-0">
              {photoURL ? (
                <Image src={photoURL} alt="Photo de profil" width={80} height={80} className="rounded-full object-cover" />
              ) : (
                <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                  <User className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                </div>
              )}
              <button
                type="button"
                aria-label="Changer la photo de profil"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-7 h-7 bg-emerald-600 rounded-full flex items-center justify-center text-white shadow hover:bg-emerald-700"
                disabled={uploading}
              >
                <Camera className="w-4 h-4" />
              </button>
              <input type="file" ref={fileInputRef} onChange={handlePhotoChange} accept="image/*" className="hidden" />
            </div>
            <div className="text-center sm:text-left">
              <p className="font-semibold">{user?.displayName || "Utilisateur"}</p>
              <p className="text-sm text-slate-500">{user?.email}</p>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Nom affiché</label>
              <input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Objectif quotidien (versets)</label>
              <input
              id="dailyGoal"
              type="number"
              min={1}
              max={100}
              value={dailyGoal}
              onChange={(e) => setDailyGoal(+e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2"
            />
          </div>
          <Button onClick={saveProfile} className="w-full sm:w-auto">Sauvegarder</Button>
        </CardContent>
      </Card>

      {/* Changement de mot de passe */}
      <Card>
        <CardHeader><CardTitle>Modifier le mot de passe</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <input
            aria-label="Mot de passe actuel"
            type="password"
            placeholder="Mot de passe actuel"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2"
          />
          <input
            aria-label="Nouveau mot de passe"
            type="password"
            placeholder="Nouveau mot de passe"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2"
          />
          <Button
            onClick={handleChangePassword}
            disabled={changingPassword}
            className="w-full sm:w-auto"
          >
            <Key className="w-4 h-4 mr-2" />
            {changingPassword ? "Modification…" : "Changer le mot de passe"}
          </Button>
        </CardContent>
      </Card>

      {/* Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <CardTitle>Quiz réussis</CardTitle>
          </CardHeader>
          <CardContent><p className="text-3xl font-bold">{stats.quizzes}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-sky-500" />
            <CardTitle>Sessions</CardTitle>
          </CardHeader>
          <CardContent><p className="text-3xl font-bold">{stats.sessions}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-500" />
            <CardTitle>Versets mémorisés</CardTitle>
          </CardHeader>
          <CardContent><p className="text-3xl font-bold">{stats.totalAyahs}</p></CardContent>
        </Card>
      </div>
    </div>
  );
}
