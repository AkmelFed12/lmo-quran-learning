import type { User } from "firebase/auth";
import { doc, increment, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

type ProfileOptions = {
  isNewUser?: boolean;
  incrementGlobalStats?: boolean;
};

export async function upsertLearnerProfile(user: User, options: ProfileOptions = {}) {
  const now = new Date().toISOString();
  const profilePayload = {
    uid: user.uid,
    displayName: user.displayName || "Apprenant",
    email: user.email,
    providerIds: user.providerData.map((provider) => provider.providerId),
    lastLoginAt: now,
    updatedAt: now,
    ...(options.isNewUser
      ? {
          role: "user",
          level: 1,
          xp: 0,
          dailyGoal: 10,
          onboardingDone: false,
          createdAt: now,
        }
      : {}),
  };

  await setDoc(
    doc(db, "users", user.uid),
    profilePayload,
    { merge: true }
  );

  if (options.isNewUser && options.incrementGlobalStats) {
    try {
      await setDoc(
        doc(db, "stats", "global"),
        { totalUsers: increment(1) },
        { merge: true }
      );
    } catch (error) {
      console.error("Erreur mise à jour stats", error);
    }
  }
}
