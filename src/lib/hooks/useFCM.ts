"use client";
import { useEffect, useState } from "react";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Import de l'instance app nécessaire à getMessaging()
import { initializeApp, getApps, getApp } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export function useFCM() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  // Récupérer l'utilisateur courant (vous avez déjà useAuth, on l'importe)
  // Pour simplifier, on va utiliser le localStorage pour l'uid (ou un contexte)
  useEffect(() => {
    // On peut réutiliser votre hook useAuth ici, mais pour ne pas créer de dépendance,
    // on lit le localStorage. Dans la pratique, vous préférerez useAuth.
    const uid = localStorage.getItem("uid");
    if (uid) setUser({ uid });
  }, []);

  useEffect(() => {
    if (!user || typeof window === "undefined") return;

    const askPermission = async () => {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") return;

      try {
        // Initialisation de messaging avec l'instance app
        const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
        const messaging = getMessaging(app);

        const currentToken = await getToken(messaging, {
          vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY || "",
        });
        if (currentToken) {
          setToken(currentToken);
          await setDoc(
            doc(db, "users", user.uid),
            { fcmToken: currentToken },
            { merge: true }
          );
        }
      } catch (err) {
        console.error("Erreur token FCM:", err);
      }
    };

    askPermission();
  }, [user]);

  // Écouter les messages au premier plan
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
      const messaging = getMessaging(app);
      const unsubscribe = onMessage(messaging, (payload) => {
        if (Notification.permission === "granted") {
          new Notification(payload.notification?.title || "LMO", {
            body: payload.notification?.body,
            icon: "/icon-192.png",
          });
        }
      });
      return () => unsubscribe();
    } catch (err) {
      // ignore
    }
  }, []);

  return { token };
}