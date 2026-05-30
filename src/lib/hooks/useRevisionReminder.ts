"use client";
import { useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "./useAuth";

export function useRevisionReminder() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const checkRevisions = async () => {
      try {
        const snap = await getDoc(doc(db, "memorization", user.uid));
        if (!snap.exists()) return;

        const sessions = snap.data().sessions || [];
        const today = new Date().toISOString().split("T")[0];
        const due = sessions.filter((s: any) => s.nextReviewDate <= today);

        if (due.length > 0 && Notification.permission === "granted") {
          // Notification locale (fonctionne même sans FCM)
          new Notification("📖 Révision du jour", {
            body: `Vous avez ${due.length} révision(s) à faire aujourd'hui.`,
            icon: "/icon-192.png",
            tag: "lmo-revision",
          });
        }
      } catch (err) {
        console.warn("Erreur vérification révisions:", err);
      }
    };

    // Vérifier immédiatement
    checkRevisions();

    // Puis toutes les heures
    const interval = setInterval(checkRevisions, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [user]);
}