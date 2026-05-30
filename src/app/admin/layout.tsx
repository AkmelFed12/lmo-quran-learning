"use client";
import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Loading from "@/components/shared/Loading";
import {
  LayoutDashboard, Users, MessageSquare, BookOpen, Mic,
  Settings, LogOut, BarChart3, Menu, X, ClipboardCheck, Activity, ShieldCheck, History, GraduationCap, Layers
} from "lucide-react";
import { signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { motion, AnimatePresence } from "framer-motion";
import { doc, getDoc } from "firebase/firestore";
import { type UserRole, isStaffRole } from "@/lib/admin-roles";

const sidebarLinks = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Tableau de bord", roles: ["admin"] },
  { href: "/admin/users", icon: Users, label: "Utilisateurs", roles: ["admin"] },
  { href: "/admin/contacts", icon: MessageSquare, label: "Messages", roles: ["admin", "moderator"] },
  { href: "/admin/reports", icon: MessageSquare, label: "Signalements", roles: ["admin", "moderator"] },
  { href: "/admin/content", icon: BookOpen, label: "Contenu", roles: ["admin", "editor", "teacher"] },
  { href: "/admin/review", icon: ClipboardCheck, label: "À relire", roles: ["admin", "editor", "teacher"] },
  { href: "/admin/questions", icon: ClipboardCheck, label: "Banque de questions", roles: ["admin", "editor", "teacher"] },
  { href: "/admin/learning", icon: BarChart3, label: "Résultats pédagogiques", roles: ["admin", "teacher"] },
  { href: "/admin/teacher", icon: GraduationCap, label: "Espace enseignant", roles: ["admin", "teacher"] },
  { href: "/admin/classes", icon: Layers, label: "Classes", roles: ["admin", "teacher"] },
  { href: "/admin/quality", icon: ShieldCheck, label: "Qualité", roles: ["admin", "editor", "teacher"] },
  { href: "/admin/reciters", icon: Mic, label: "Récitateurs", roles: ["admin", "editor"] },
  { href: "/admin/analytics", icon: BarChart3, label: "Statistiques", roles: ["admin"] },
  { href: "/admin/monitoring", icon: Activity, label: "Monitoring", roles: ["admin"] },
  { href: "/admin/audit", icon: History, label: "Audit", roles: ["admin", "editor", "teacher", "moderator"] },
  { href: "/admin/settings", icon: Settings, label: "Paramètres", roles: ["admin"] },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, profile, disabled, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [role, setRole] = useState<UserRole | null>(null);
  const [checkingRole, setCheckingRole] = useState(true);

  useEffect(() => {
    if (!loading && pathname !== "/admin/login") {
      if (!user) {
        router.push("/admin/login");
      }
    }
  }, [user, loading, pathname, router]);

  useEffect(() => {
    if (pathname === "/admin/login") {
      setCheckingRole(false);
      return;
    }

    if (loading) return;
    if (!user) {
      setCheckingRole(false);
      return;
    }
    if (disabled) {
      void signOut(auth);
      router.push("/admin/login");
      setCheckingRole(false);
      return;
    }

    const loadRole = async () => {
      setCheckingRole(true);
      if (profile?.role === "admin") {
        setRole("admin");
        setCheckingRole(false);
        return;
      }

      try {
        const snapshot = await getDoc(doc(db, "users", user.uid));
        const nextRole = snapshot.exists() ? snapshot.data().role : null;
        if (isStaffRole(nextRole)) {
          setRole(nextRole);
        } else {
          router.push("/dashboard");
        }
      } catch {
        router.push("/dashboard");
      } finally {
        setCheckingRole(false);
      }
    };

    void loadRole();
  }, [disabled, loading, pathname, profile?.role, router, user]);

  if (pathname === "/admin/login") return <>{children}</>;
  if (loading || checkingRole) return <Loading />;
  if (!role) return <Loading />;
  const adminEmail = user?.email || "Administrateur";
  const visibleLinks = sidebarLinks.filter((link) => link.roles.includes(role));

  return (
    <div className="flex min-h-screen bg-slate-100 dark:bg-slate-950">
      {/* Sidebar desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-white fixed left-0 top-0 h-full z-40">
        <div className="p-6 border-b border-slate-700">
          <h2 className="text-xl font-heading font-bold text-emerald-400">LMO Admin</h2>
          <p className="text-xs text-slate-400 mt-1">{adminEmail}</p>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {visibleLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-lg"
                    : "text-slate-300 hover:bg-slate-800"
                }`}
              >
                <link.icon className="w-5 h-5" />
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-slate-700">
          <button
            onClick={() => signOut(auth)}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-slate-300 hover:bg-red-600/20 hover:text-red-400 transition"
          >
            <LogOut className="w-5 h-5" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Mobile header + menu */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-slate-900 text-white">
        <div className="flex items-center justify-between px-4 py-3">
          <h2 className="text-lg font-heading font-bold text-emerald-400">LMO Admin</h2>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-slate-800"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden bg-slate-800 border-t border-slate-700"
            >
              <div className="px-4 py-3 space-y-1">
                {visibleLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? "bg-emerald-600 text-white shadow-lg"
                          : "text-slate-300 hover:bg-slate-700"
                      }`}
                    >
                      <link.icon className="w-5 h-5" />
                      {link.label}
                    </Link>
                  );
                })}
                <button
                  onClick={() => signOut(auth)}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-slate-300 hover:bg-red-600/20 hover:text-red-400 transition"
                >
                  <LogOut className="w-5 h-5" />
                  Déconnexion
                </button>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>

      {/* Contenu principal */}
      <main className="flex-1 md:ml-64 pt-14 md:pt-0 p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}
