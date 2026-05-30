"use client";
import { useEffect, useState } from "react";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import TestimonialForm from "@/components/dashboard/TestimonialForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

interface Testimonial {
  id: string;
  displayName: string;
  message: string;
  createdAt: { seconds: number };
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      const q = query(collection(db, "testimonials"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Testimonial));
      setTestimonials(list);
      setLoading(false);
    };
    fetchTestimonials();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Témoignages</h2>

      <TestimonialForm />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-emerald-600" />
            Avis de la communauté
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-slate-500">Chargement…</p>
          ) : testimonials.length === 0 ? (
            <p className="text-center text-slate-500">Aucun témoignage pour le moment.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {testimonials.map((t) => (
                <div key={t.id} className="card-premium p-4">
                  <p className="italic text-slate-600 dark:text-slate-300 mb-2">
                    « {t.message} »
                  </p>
                  <p className="text-sm font-semibold text-right">
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