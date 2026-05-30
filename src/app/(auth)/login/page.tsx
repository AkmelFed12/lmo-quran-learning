"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { getAdditionalUserInfo, getRedirectResult, signInWithEmailAndPassword, signInWithRedirect } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { getFirebaseAuthMessage } from "@/lib/auth-errors";
import { upsertLearnerProfile } from "@/lib/auth-profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { BookOpen, Globe, LockKeyhole } from "lucide-react";

const schema = z.object({
  email: z.string().email("Adresse e-mail invalide"),
  password: z.string().min(6, "Mot de passe requis"),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const redirectHandled = useRef(false);
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (redirectHandled.current) return;
    redirectHandled.current = true;

    const completeRedirectLogin = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (!result) return;

        setGoogleLoading(true);
        await upsertLearnerProfile(result.user, {
          isNewUser: getAdditionalUserInfo(result)?.isNewUser,
          incrementGlobalStats: true,
        });
        toast.success("Connexion Google réussie.");
        router.replace("/dashboard");
      } catch (error) {
        toast.error(getFirebaseAuthMessage(error, "Connexion Google impossible pour le moment."));
      } finally {
        setGoogleLoading(false);
      }
    };

    completeRedirectLogin();
  }, [router]);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      router.push("/dashboard");
    } catch (error) {
      toast.error(getFirebaseAuthMessage(error, "E-mail ou mot de passe incorrect."));
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
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-sky-50 px-4 py-12 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950">
      <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-emerald-300/25 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-sky-300/20 blur-3xl" />
      <div className="relative mx-auto flex min-h-[calc(100vh-6rem)] w-full max-w-6xl items-center justify-center">
        <div className="hidden flex-1 pr-12 lg:block">
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200">
            <BookOpen className="h-4 w-4" />
            Espace apprenant
          </span>
          <h1 className="mt-6 text-5xl font-heading font-bold leading-tight text-slate-900 dark:text-white">
            Reprenez votre lecture exactement là où vous l&apos;avez arrêtée.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            Connectez-vous pour retrouver votre progression, vos objectifs quotidiens, vos révisions et votre parcours de mémorisation.
          </p>
        </div>

        <div className="w-full max-w-md card-premium p-6 sm:p-8">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
            <LockKeyhole className="h-7 w-7" />
          </div>
          <h1 className="text-3xl font-heading font-bold">Connexion</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Heureux de vous revoir.
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" autoComplete="email" {...register("email")} />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>
          <div>
            <Label htmlFor="password">Mot de passe</Label>
            <Input id="password" type="password" autoComplete="current-password" {...register("password")} />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>
          <div className="flex justify-end">
            <Link href="/forgot-password" className="text-sm text-emerald-600 hover:underline">
              Mot de passe oublié ?
            </Link>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Connexion…" : "Se connecter"}
          </Button>
        </form>
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t" /></div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white dark:bg-slate-800 px-2 text-slate-500">ou</span>
          </div>
        </div>
        <Button variant="outline" className="w-full" onClick={signInWithGoogle} disabled={googleLoading || loading}>
          <Globe className="w-5 h-5 mr-2" /> {googleLoading ? "Redirection Google…" : "Continuer avec Google"}
        </Button>
        <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
          Pas encore de compte ? <Link href="/signup" className="text-emerald-600 hover:underline font-semibold">S&apos;inscrire</Link>
        </p>
      </div>
      </div>
    </div>
  );
}
