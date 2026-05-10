"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Globe } from "lucide-react";

const schema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Mot de passe requis"),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      router.push("/");
    } catch (error: any) {
      toast.error("Email ou mot de passe incorrect.");
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      router.push("/");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md card-premium p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-heading font-bold">Connexion</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Heureux de vous revoir.
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email")} />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>
          <div>
            <Label htmlFor="password">Mot de passe</Label>
            <Input id="password" type="password" {...register("password")} />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>
          <div className="flex justify-end">
            <Link href="/forgot-password" className="text-sm text-emerald-600 hover:underline">
              Mot de passe oublié ?
            </Link>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Connexion..." : "Se connecter"}
          </Button>
        </form>
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t" /></div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white dark:bg-slate-800 px-2 text-slate-500">ou</span>
          </div>
        </div>
        <Button variant="outline" className="w-full" onClick={signInWithGoogle}>
          <Globe className="w-5 h-5 mr-2" /> Continuer avec Google
        </Button>
        <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
          Pas encore de compte ? <Link href="/signup" className="text-emerald-600 hover:underline font-semibold">S'inscrire</Link>
        </p>
      </div>
    </div>
  );
}