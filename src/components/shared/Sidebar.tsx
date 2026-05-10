"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Brain, Calendar, Settings, LogOut, Book } from "lucide-react";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import Logo from "./Logo";

const links = [
  { href: "/dashboard", icon: Home, label: "Tableau de bord" },
  { href: "/arabic", icon: Book, label: "Apprendre l'arabe" },
  { href: "/quran", icon: BookOpen, label: "Coran" },
  { href: "/memorization", icon: Brain, label: "Mémorisation" },
  { href: "/planning", icon: Calendar, label: "Planning" },
  { href: "/settings", icon: Settings, label: "Paramètres" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full w-64 bg-white dark:bg-slate-800 border-r border-emerald-100 dark:border-emerald-900/50 z-40">
      <div className="p-6">
        <Logo />
      </div>
      <nav className="flex-1 px-4 space-y-1">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                isActive
                  ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
              }`}
            >
              <link.icon className="w-5 h-5" />
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-emerald-100 dark:border-emerald-900/50">
        <button
          onClick={() => signOut(auth)}
          className="flex items-center gap-3 w-full px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
        >
          <LogOut className="w-5 h-5" />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}