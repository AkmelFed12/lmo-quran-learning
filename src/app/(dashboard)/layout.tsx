"use client";
import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Sidebar from "@/components/shared/Sidebar";
import MobileNav from "@/components/shared/MobileNav";
import Loading from "@/components/shared/Loading";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) return <Loading />;

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
      <Sidebar />
      <main className="flex-1 ml-0 md:ml-64 pt-6 pb-24 md:pb-6 px-4 md:px-8">
        {children}
      </main>
      <MobileNav />
    </div>
  );
}