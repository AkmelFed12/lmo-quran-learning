"use client";
import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";

type Testimonial = {
  message: string;
  displayName: string;
};

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    (async () => {
      const q = query(collection(db, "testimonials"), orderBy("createdAt", "desc"), limit(6));
      const snap = await getDocs(q);
      const list = snap.docs
        .map((entry) => entry.data())
        .filter((item): item is Testimonial =>
          typeof item.message === "string" &&
          typeof item.displayName === "string"
        );
      if (list.length === 0) {
        setTestimonials([
          { message: "Une plateforme magnifique, très motivante.", displayName: "Umm Inaya wa Abdul Wahhab" },
          { message: "Ma lecture du Coran progresse chaque jour, merci LMO.", displayName: "Talbi Oumar T." },
          { message: "L'apprentissage de l'arabe est devenu facile.", displayName: "Ali B." },
        ]);
      } else {
        setTestimonials(list);
      }
    })();
  }, []);

  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-heading font-bold text-center mb-12">
          Ils nous font confiance
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700"
            >
              <p className="italic text-slate-600 dark:text-slate-300 mb-4">
                « {t.message} »
              </p>
              <p className="font-semibold">{t.displayName}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
