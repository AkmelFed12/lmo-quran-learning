"use client";
import { useEffect } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function NotificationManager() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user || !("Notification" in window)) return;

    // Demander la permission
    Notification.requestPermission();

    // Enregistrer le service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(console.error);
    }

    // Vérifier les révisions du jour et envoyer une notification
    const checkRevisions = async () => {
      const docRef = doc(db, "memorization", user.uid);
      const snap = await getDoc(docRef);
      if (!snap.exists()) return;

      const sessions = snap.data().sessions || [];
      const today = new Date().toISOString().split("T")[0];
      const dueRevisions = sessions.filter((s: any) => s.nextReviewDate <= today);

      if (dueRevisions.length > 0 && Notification.permission === "granted") {
        const notification = new Notification("LMO Quran - Rappel de révision", {
          body: `Vous avez ${dueRevisions.length} révision(s) à faire aujourd'hui.`,
          icon: "/icon-192.png",
        });
        notification.onclick = () => {
          window.focus();
          window.location.href = "/memorization";
        };
      }
    };

    checkRevisions();
  }, [user]);

  return null;
}
