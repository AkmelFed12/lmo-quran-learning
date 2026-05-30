import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-heading font-bold text-emerald-600 dark:text-emerald-400 mb-4">404</h1>
        <p className="text-2xl font-semibold text-slate-800 dark:text-white mb-2">Page introuvable</p>
        <p className="text-slate-500 dark:text-slate-400 mb-8">
          La page que vous cherchez n'existe pas ou a été déplacée.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}