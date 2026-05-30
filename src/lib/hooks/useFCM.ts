"use client";
import { useEffect, useState } from "react";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { doc, setDoc } from "firebase/firestore";
import { app, db } from "@/lib/firebase";
import { useAuth } from "@/lib/hooks/useAuth";

export function useFCM() {
  const [token, setToken] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user || typeof window === "undefined") return;

    const askPermission = async () => {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") return;

      try {
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

    void askPermission();
  }, [user]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const messaging = getMessaging(app);
      const unsubscribe = onMessage(messaging, (payload) => {
        if (Notification.permission === "granted") {
          const notification = new Notification(payload.notification?.title || "LMO", {
            body: payload.notification?.body,
            icon: "/icon-192.png",
          });
          notification.onclick = () => {
            window.focus();
            window.location.href = payload.data?.url || "/dashboard";
          };
        }
      });
      return () => unsubscribe();
    } catch {
      return undefined;
    }
  }, []);

  return { token };
}
