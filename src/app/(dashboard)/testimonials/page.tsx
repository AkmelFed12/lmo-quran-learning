"use client";
import { useEffect, useState } from "react";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import TestimonialForm from "@/components/dashboard/TestimonialForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, MessageSquare, Quote } from "lucide-react";

interface Testimonial {
  id: string;
  displayName: string;
  message: string;
  createdAt: { seconds: number };
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const q = query(collection(db, "testimonials"), orderBy("createdAt", "desc"));
        const snap = await getDocs(q);
        const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Testimonial));
        setTestimonials(list);
        setLoadError(false);
      } catch {
        setLoadError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header className="card-premium overflow-hidden p-0">
        <div className="grid gap-5 bg-gradient-to-br from-emerald-950 via-slate-950 to-emerald-900 p-5 text-white sm:p-6 lg:grid-cols-[1fr_0.8fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-gold">Témoignages</p>
            <h1 className="mt-3 text-3xl font-heading font-bold sm:text-4xl">Retours de la communauté</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-emerald-50/80">
              Partagez une expérience courte et utile. Les témoignages aident les nouveaux apprenants à comprendre l'esprit de la plateforme.
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-5">
            <Quote className="h-8 w-8 text-gold" />
            <p className="mt-4 text-sm leading-7 text-emerald-50/85">
              Un bon témoignage reste simple : ce qui vous a aidé, ce qui est devenu plus clair, et ce que vous continuez à travailler.
            </p>
          </div>
        </div>
      </header>

      <TestimonialForm />

      <Card className="border-emerald-900/10 bg-white/90 shadow-sm dark:border-white/10 dark:bg-slate-900/75">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-emerald-600" />
            Avis de la communauté
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="skeleton-block h-32 rounded-[1.5rem]" />
              <div className="skeleton-block h-32 rounded-[1.5rem]" />
            </div>
          ) : loadError ? (
            <div className="rounded-[1.5rem] border border-amber-200 bg-amber-50 p-5 text-amber-950 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-100">
              <div className="flex gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                <div>
                  <p className="font-bold">Témoignages momentanément indisponibles.</p>
                  <p className="mt-1 text-sm leading-6">Vous pouvez quand même envoyer votre témoignage. La liste se rechargera plus tard.</p>
                </div>
              </div>
            </div>
          ) : testimonials.length === 0 ? (
            <div className="rounded-[1.5rem] border border-dashed border-emerald-900/20 bg-ivory/70 p-6 text-center dark:border-white/10 dark:bg-white/[0.04]">
              <MessageSquare className="mx-auto h-8 w-8 text-emerald-700 dark:text-gold" />
              <p className="mt-3 font-semibold text-slate-950 dark:text-white">Aucun témoignage pour le moment.</p>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Soyez parmi les premiers à partager un retour.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {testimonials.map((t) => (
                <div key={t.id} className="rounded-[1.5rem] border border-emerald-900/10 bg-ivory/70 p-5 dark:border-white/10 dark:bg-white/[0.04]">
                  <Quote className="h-5 w-5 text-gold" />
                  <p className="mt-3 text-sm italic leading-7 text-slate-600 dark:text-slate-300">
                    « {t.message} »
                  </p>
                  <p className="mt-4 text-right text-sm font-semibold text-slate-950 dark:text-white">
                    — {t.displayName}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
