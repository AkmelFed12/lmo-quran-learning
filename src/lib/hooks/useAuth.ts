"use client";
import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export type AuthProfile = {
  role?: string;
  disabled?: boolean;
};

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<AuthProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!active) return;
      setUser(firebaseUser);

      if (!firebaseUser) {
        setProfile(null);
        setLoading(false);
        return;
      }

      try {
        const snapshot = await getDoc(doc(db, "users", firebaseUser.uid));
        if (!active) return;
        const data = snapshot.exists() ? snapshot.data() : {};
        setProfile({
          role: typeof data.role === "string" ? data.role : "user",
          disabled: data.disabled === true,
        });
      } catch {
        if (!active) return;
        setProfile({ role: "user", disabled: false });
      } finally {
        if (active) setLoading(false);
      }
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  return { user, profile, disabled: profile?.disabled === true, loading };
}
