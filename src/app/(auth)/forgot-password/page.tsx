"use client";
import { useState } from "react";
import Link from "next/link";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { getFirebaseAuthMessage } from "@/lib/auth-errors";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedEmail = email.trim();
    if (!normalizedEmail) {
      toast.error("Indiquez votre adresse e-mail.");
      return;
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, normalizedEmail);
      toast.success("Si un compte existe avec cette adresse, un lien de réinitialisation vient d'être envoyé.");
    } catch (error: unknown) {
      toast.error(getFirebaseAuthMessage(error, "Réinitialisation impossible pour le moment."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md card-premium p-8">
        <h1 className="text-3xl font-heading font-bold text-center mb-4">Mot de passe oublié</h1>
        <form onSubmit={handleReset} className="space-y-5">
          <div>
            <Label htmlFor="email">Adresse e-mail</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Envoi…" : "Réinitialiser le mot de passe"}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm">
          <Link href="/login" className="text-emerald-600 hover:underline">Retour à la connexion</Link>
        </p>
      </div>
    </div>
  );
}
