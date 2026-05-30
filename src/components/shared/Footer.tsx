import Link from "next/link";
import Logo from "./Logo";

const links = [
  { href: "/about", label: "À propos" },
  { href: "/sources-methodology", label: "Sources et méthode" },
  { href: "/support", label: "Soutenir le projet" },
  { href: "/privacy", label: "Confidentialité" },
  { href: "/terms", label: "Conditions" },
  { href: "/contact", label: "Contact" },
];

export default function Footer() {
  return (
    <footer className="border-t border-emerald-900/10 bg-ivory py-12 dark:border-white/10 dark:bg-night">
      <div className="section-shell">
        <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr] md:items-start">
          <div>
            <Logo />
            <p className="mt-5 max-w-xl text-sm leading-7 text-slate-600 dark:text-slate-300">
              Une plateforme éducative pour apprendre l'arabe, lire le Coran avec tajwid, écouter les récitations, mémoriser et réviser avec méthode.
            </p>
            <p className="mt-4 max-w-xl text-xs leading-6 text-slate-500 dark:text-slate-400">
              LMO Quran Learning ne remplace pas un professeur qualifié. Les sources et limites pédagogiques sont indiquées pour favoriser un apprentissage responsable.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="rounded-2xl border border-emerald-900/10 bg-white/60 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-gold/40 hover:text-emerald-900 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:text-white">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-10 border-t border-emerald-900/10 pt-6 text-sm text-slate-500 dark:border-white/10 dark:text-slate-400">
          Conçu et développé par{" "}
          <Link href="https://lmoportfolio.vercel.app" target="_blank" rel="noopener noreferrer" className="font-semibold text-emerald-800 hover:underline dark:text-gold">
            LMO WEB SERVICES
          </Link>
        </div>
      </div>
    </footer>
  );
}
