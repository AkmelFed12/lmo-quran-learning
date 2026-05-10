"use client";
import { useAuth } from "@/lib/hooks/useAuth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import Logo from "./Logo";

export default function Navbar() {
  const { user } = useAuth();

  return (
    <nav className="fixed top-0 w-full bg-white/80 dark:bg-slate-950/80 backdrop-blur-md z-50 border-b border-emerald-100 dark:border-emerald-900/50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Logo />
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link href="/dashboard" className="text-sm font-medium hover:text-emerald-600 hidden sm:block">
                Tableau de bord
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={() => signOut(auth)}
                className="border-slate-300 dark:border-slate-600"
              >
                <LogOut className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Déconnexion</span>
              </Button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium hover:text-emerald-600">
                Connexion
              </Link>
              <Link href="/signup">
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                  Inscription
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}