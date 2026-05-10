"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Brain, Calendar } from "lucide-react";

const links = [
  { href: "/dashboard", icon: Home, label: "Accueil" },
  { href: "/arabic", icon: BookOpen, label: "Arabe" },
  { href: "/quran", icon: BookOpen, label: "Coran" },
  { href: "/memorization", icon: Brain, label: "Mémo" },  
  { href: "/planning", icon: Calendar, label: "Planning" },
];

export default function MobileNav() {
  const pathname = usePathname();
  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white dark:bg-slate-800 border-t border-emerald-100 dark:border-emerald-900/50 z-50">
      <div className="flex items-center justify-around py-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex flex-col items-center p-1 rounded-lg ${
              pathname === link.href
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-slate-500 dark:text-slate-400"
            }`}
          >
            <link.icon className="w-5 h-5" />
            <span className="text-xs">{link.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}