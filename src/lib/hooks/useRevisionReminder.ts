"use client";
import { useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "./useAuth";

type RevisionSession = {
  nextReviewDate?: string;
};

const reminderKey = (uid: string, date: string) => `lmo-revision-reminder-${uid}-${date}`;

export function useRevisionReminder() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user || typeof window === "undefined" || !("Notification" in window)) return;

    const checkRevisions = async () => {
      try {
        if (Notification.permission !== "granted") return;

        const snap = await getDoc(doc(db, "memorization", user.uid));
        if (!snap.exists()) return;

        const today = new Date().toISOString().split("T")[0];
        const alreadyShown = window.localStorage.getItem(reminderKey(user.uid, today)) === "shown";
        if (alreadyShown) return;

        const sessions = Array.isArray(snap.data().sessions) ? snap.data().sessions as RevisionSession[] : [];
        const due = sessions.filter((session) => session.nextReviewDate && session.nextReviewDate <= today);

        if (due.length > 0) {
          const notification = new Notification("Révision du jour", {
            body: `Vous avez ${due.length} révision(s) à faire aujourd'hui.`,
            icon: "/icon-192.png",
            tag: "lmo-revision",
          });
          window.localStorage.setItem(reminderKey(user.uid, today), "shown");
          notification.onclick = () => {
            window.focus();
            window.location.href = "/memorization";
          };
        }
      } catch {
        // Les rappels ne doivent jamais bloquer l'accès au tableau de bord.
      }
    };

    void checkRevisions();

    const interval = window.setInterval(() => void checkRevisions(), 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [user]);
}
