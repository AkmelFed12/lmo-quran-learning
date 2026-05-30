"use client";
import { useAuth } from "@/lib/hooks/useAuth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Logo from "./Logo";
import NotificationBell from "./NotificationBell";
import UserMenu from "./UserMenu";
import LocaleSwitcher from "./LocaleSwitcher";
import GlobalSearch from "./GlobalSearch";
import HeaderMore from "./HeaderMore";
import SearchToggle from "./SearchToggle";

export default function Navbar() {
  const { user } = useAuth();

  return (
    <nav className="fixed top-0 w-full bg-white/80 dark:bg-slate-950/80 backdrop-blur-md z-50 border-b border-emerald-100 dark:border-emerald-900/50">
      <div className="container mx-auto px-3 sm:px-4 py-3 flex items-center justify-between gap-2">
        <Logo />

        {/* Barre de recherche visible uniquement sur desktop */}
        <div className="hidden sm:block">
          <GlobalSearch />
        </div>

        {/* Icône de recherche pour mobile */}
        <SearchToggle />

        <div className="flex items-center gap-2 sm:gap-3">
          <LocaleSwitcher />

          {/* Liens publics visibles sur tous les écrans */}
          <Link href="/about" className="text-xs sm:text-sm font-medium hover:text-emerald-600 hidden sm:block">
            À propos
          </Link>
          <Link href="/contact" className="text-xs sm:text-sm font-medium hover:text-emerald-600 hidden sm:block">
            Contact
          </Link>
          <Link href="/blog" className="text-xs sm:text-sm font-medium hover:text-emerald-600 hidden sm:block">
            Actualités
          </Link>
          <Link href="/faq" className="text-xs sm:text-sm font-medium hover:text-emerald-600 hidden sm:block">
            FAQ
          </Link>
          <Link href="/sources-methodology" className="text-xs sm:text-sm font-medium hover:text-emerald-600 hidden lg:block">
            Sources
          </Link>
          <Link href="/support" className="hidden text-xs font-medium hover:text-emerald-600 lg:block sm:text-sm">
            Soutenir
          </Link>
          <Link href="/download" className="text-xs sm:text-sm font-medium hover:text-emerald-600">
            Télécharger
          </Link>
          

          {/* Bouton "Plus" pour les liens secondaires sur mobile */}
          <HeaderMore />

          {user ? (
            <>
              <NotificationBell />
              <Link href="/dashboard" className="text-xs sm:text-sm font-medium hover:text-emerald-600 hidden sm:block">
                Tableau de bord
              </Link>
              <UserMenu />
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className="text-xs sm:text-sm font-medium hover:text-emerald-600 whitespace-nowrap">
                Connexion
              </Link>
              <Link href="/signup">
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-xs sm:text-sm px-3 py-1.5">
                  Inscription
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
