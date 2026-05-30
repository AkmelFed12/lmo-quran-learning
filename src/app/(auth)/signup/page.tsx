"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  createUserWithEmailAndPassword,
  getAdditionalUserInfo,
  getRedirectResult,
  signInWithRedirect,
  updateProfile,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { doc, setDoc, increment } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getFirebaseAuthMessage } from "@/lib/auth-errors";
import { upsertLearnerProfile } from "@/lib/auth-profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { BookOpen, Globe, Sparkles } from "lucide-react";

const schema = z.object({
  name: z.string().min(2, "Nom requis"),
  email: z.string().email("Adresse e-mail invalide"),
  password: z.string().min(6, "Minimum 6 caractères"),
});

type FormData = z.infer<typeof schema>;

export default function SignUpPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const redirectHandled = useRef(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (redirectHandled.current) return;
    redirectHandled.current = true;

    const completeRedirectSignup = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (!result) return;

        setGoogleLoading(true);
        await upsertLearnerProfile(result.user, {
          isNewUser: getAdditionalUserInfo(result)?.isNewUser,
          incrementGlobalStats: true,
        });
        toast.success("Compte Google connecté.");
        router.replace("/dashboard");
      } catch (error) {
        toast.error(getFirebaseAuthMessage(error, "Connexion Google impossible pour le moment."));
      } finally {
        setGoogleLoading(false);
      }
    };

    completeRedirectSignup();
  }, [router]);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      await updateProfile(result.user, { displayName: data.name });
      await setDoc(
        doc(db, "users", result.user.uid),
        {
          uid: result.user.uid,
          displayName: data.name,
          email: data.email,
          role: "user",
          level: 1,
          xp: 0,
          dailyGoal: 10,
          onboardingDone: false,
          providerIds: ["password"],
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );

      try {
        await setDoc(
          doc(db, "stats", "global"),
          { totalUsers: increment(1) },
          { merge: true }
        );
      } catch (err) {
        console.error("Erreur mise à jour stats", err);
      }

      toast.success("Compte créé avec succès.");
      router.push("/dashboard");
    } catch (error) {
      toast.error(getFirebaseAuthMessage(error, "Création du compte impossible."));
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setGoogleLoading(true);
    try {
      await signInWithRedirect(auth, googleProvider);
    } catch (error) {
      setGoogleLoading(false);
      toast.error(getFirebaseAuthMessage(error, "Connexion Google impossible pour le moment."));
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-sky-50 px-4 pt-20 pb-12 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950">
      <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-emerald-300/25 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-sky-300/20 blur-3xl" />
      <div className="relative mx-auto grid min-h-[calc(100vh-8rem)] w-full max-w-6xl items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="hidden lg:block">
        <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200">
          <Sparkles className="h-4 w-4" />
          Nouveau parcours
        </span>
        <h1 className="mt-6 text-5xl font-heading font-bold leading-tight text-slate-900 dark:text-white">
          Créez une routine simple pour apprendre, lire et mémoriser.
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600 dark:text-slate-300">
          Votre compte active le tableau de bord personnel, les objectifs quotidiens, les badges, les révisions et le suivi de progression.
        </p>
      </div>

      <div className="w-full max-w-md justify-self-center card-premium p-6 sm:p-8">
        <div className="text-center mb-6 sm:mb-8">
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
            <BookOpen className="h-7 w-7" />
          </div>
          <h1 className="text-3xl font-heading font-bold">Inscription LMO</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Rejoignez des milliers d’apprenants.
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <Label htmlFor="name">Nom</Label>
            <Input id="name" type="text" autoComplete="name" {...register("name")} />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" autoComplete="email" {...register("email")} />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="password">Mot de passe</Label>
            <Input id="password" type="password" autoComplete="new-password" {...register("password")} />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={loading || googleLoading}>
            {loading ? "Création…" : "Créer mon compte"}
          </Button>
        </form>
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white dark:bg-slate-800 px-2 text-slate-500">
              ou
            </span>
          </div>
        </div>
        <Button variant="outline" className="w-full" onClick={signInWithGoogle} disabled={loading || googleLoading}>
          <Globe className="w-5 h-5 mr-2" /> {googleLoading ? "Redirection Google…" : "Continuer avec Google"}
        </Button>
        <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
          Déjà un compte ?{" "}
          <Link
            href="/login"
            className="text-emerald-600 hover:underline font-semibold"
          >
            Se connecter
          </Link>
        </p>
      </div>
      </div>
    </div>
  );
}
