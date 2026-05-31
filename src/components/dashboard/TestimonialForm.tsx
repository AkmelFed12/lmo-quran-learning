"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/hooks/useAuth";

export default function TestimonialForm() {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const submitTestimonial = async () => {
    if (!message.trim() || !user) return;
    setLoading(true);
    try {
      await addDoc(collection(db, "testimonials"), {
        uid: user.uid,
        displayName: user.displayName || "Anonyme",
        message,
        createdAt: new Date(),
      });
      toast.success("Merci pour votre témoignage !");
      setMessage("");
    } catch (err) {
      toast.error("Témoignage non envoyé. Vérifiez votre connexion puis réessayez.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card-premium p-6">
      <h3 className="text-lg font-semibold mb-4">Partager votre expérience</h3>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={3}
        placeholder="Votre témoignage…"
        className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 mb-3"
      />
      <Button onClick={submitTestimonial} disabled={loading}>
        {loading ? "Envoi…" : "Envoyer mon témoignage"}
      </Button>
    </div>
  );
}
