import Link from "next/link";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="bg-slate-50 dark:bg-slate-900 border-t border-emerald-100 dark:border-emerald-900/50 py-12">
      <div className="container mx-auto px-4 text-center">
        <div className="flex justify-center mb-6">
          <Logo />
        </div>
        <p className="text-slate-600 dark:text-slate-400 mb-2">
          Learn and Read AL QU'RAN with LMO Qu'ran Learning
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-500">
          Plateforme d'apprentissage du Coran et de l'arabe.
        </p>
      </div>
    </footer>
  );
}