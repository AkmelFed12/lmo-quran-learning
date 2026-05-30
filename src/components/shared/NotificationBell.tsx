"use client";
import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/hooks/useAuth";

export default function NotificationBell() {
  const { user } = useAuth();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    const checkRevisions = async () => {
      const snap = await getDoc(doc(db, "memorization", user.uid));
      if (snap.exists()) {
        const sessions = snap.data().sessions || [];
        const today = new Date().toISOString().split("T")[0];
        const due = sessions.filter((s: any) => s.nextReviewDate <= today);
        setCount(due.length);
      }
    };
    checkRevisions();
    const interval = setInterval(checkRevisions, 60000);
    return () => clearInterval(interval);
  }, [user]);

  return (
    <div className="relative cursor-pointer">
      <Bell className="w-5 h-5 text-slate-600 dark:text-slate-300 hover:text-emerald-600 transition-colors" />
      {count > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse">
          {count}
        </span>
      )}
    </div>
  );
}