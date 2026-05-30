"use client";
import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const steps = [
  {
    title: "Bienvenue sur LMO Quran Learning",
    text: "Votre espace regroupe lecture, arabe, audio, mémorisation et progression personnelle.",
    target: "dashboard-link",
  },
  {
    title: "Tableau de bord",
    text: "Commencez par le focus du jour, puis suivez vos objectifs, badges, séries quotidiennes et révisions.",
    target: "dashboard-link",
  },
  {
    title: "Parcours guidé",
    text: "Chaque jour, l'application propose une petite suite d'actions : écouter, lire, réviser, puis tester.",
    target: "guided-path-link",
  },
  {
    title: "Fondations arabes",
    text: "Travaillez les lettres, les voyelles, les syllabes, les mots et la lecture progressive.",
    target: "arabic-link",
  },
  {
    title: "Lecture et mémorisation",
    text: "Utilisez le lecteur audio, la répétition par verset, les notes personnelles et les révisions espacées.",
    target: "quran-link",
  },
  {
    title: "Sources et progression",
    text: "Retrouvez les sources pédagogiques, vos progrès et les attestations internes depuis votre espace personnel.",
    target: "progress-link",
  },
];

export default function OnboardingOverlay() {
  const { user } = useAuth();
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const snap = await getDoc(doc(db, "users", user.uid));
      if (!snap.exists() || !snap.data().onboardingDone) {
        setShow(true);
      }
    })();
  }, [user]);

  const close = async () => {
    setShow(false);
    if (user) {
      await setDoc(doc(db, "users", user.uid), { onboardingDone: true }, { merge: true });
    }
  };

  const nextStep = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      close();
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="relative w-full max-w-md rounded-[2rem] border border-emerald-100 bg-white p-8 text-center shadow-2xl dark:border-emerald-900/50 dark:bg-slate-900"
          >
            <div className="mx-auto mb-5 h-1.5 w-16 rounded-full bg-emerald-500" />
            <h3 className="text-2xl font-bold mb-4">{steps[step].title}</h3>
            <p className="text-slate-600 dark:text-slate-300 mb-6">{steps[step].text}</p>
            <div className="flex gap-2 justify-center mb-4">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${i === step ? "bg-emerald-600" : "bg-slate-300"}`}
                />
              ))}
            </div>
            <div className="flex gap-3 justify-center">
              {step > 0 && (
                <Button variant="outline" onClick={() => setStep(step - 1)}>
                  Précédent
                </Button>
              )}
              <Button onClick={nextStep}>
                {step === steps.length - 1 ? "Commencer" : "Suivant"}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
