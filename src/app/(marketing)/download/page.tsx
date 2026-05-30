"use client";
import { useState } from "react";
import Link from "next/link";
import { Download, Apple, Smartphone, ArrowRight, BookOpen } from "lucide-react";
import { doc, setDoc, increment } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function DownloadPage() {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    // Incrémente le compteur de téléchargements
    try {
      await setDoc(
        doc(db, "stats", "global"),
        { totalDownloads: increment(1) },
        { merge: true }
      );
    } catch (err) {
      console.error("Erreur mise à jour téléchargements", err);
    }
    // Déclenche le téléchargement
    window.location.href = "/lmo-quran.apk";
    setDownloading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950 pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* En-tête */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-slate-800 dark:text-white mb-4">
            Téléchargez l'application
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Emportez l'apprentissage du Coran et de l'arabe partout avec vous, même sans connexion.
          </p>
        </div>

        {/* Cartes de téléchargement */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Android */}
          <div className="card-premium p-8 flex flex-col items-center text-center hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-6">
              <Smartphone className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-heading font-bold mb-3">Android</h2>
            <p className="text-slate-600 dark:text-slate-300 mb-6">
              Téléchargez le fichier APK et installez l'application sur votre téléphone ou tablette Android.
            </p>
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-full font-semibold hover:bg-green-700 transition-colors shadow-lg shadow-green-200/30"
            >
              <Download className="w-5 h-5" />
              {downloading ? "Téléchargement…" : "Télécharger l'APK"}
            </button>
            <div className="mt-6 text-left text-sm text-slate-500 dark:text-slate-400 space-y-2">
              <p className="font-semibold">Instructions :</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Téléchargez le fichier APK en cliquant sur le bouton ci-dessus.</li>
                <li>Ouvrez le fichier téléchargé sur votre appareil.</li>
                <li>Si demandé, autorisez l'installation depuis des sources inconnues.</li>
                <li>L'application s'installe et apparaît sur votre écran d'accueil.</li>
              </ol>
            </div>
          </div>

          {/* iOS */}
          <div className="card-premium p-8 flex flex-col items-center text-center hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-6">
              <Apple className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-2xl font-heading font-bold mb-3">iOS (iPhone / iPad)</h2>
            <p className="text-slate-600 dark:text-slate-300 mb-6">
              Installez l'application directement depuis Safari en l'ajoutant à votre écran d'accueil.
            </p>
            <a
              href="https://lmo-quran-learning.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200/30"
            >
              <BookOpen className="w-5 h-5" />
              Ouvrir le site
            </a>
            <div className="mt-6 text-left text-sm text-slate-500 dark:text-slate-400 space-y-2">
              <p className="font-semibold">Instructions :</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Ouvrez le site avec <strong>Safari</strong> (le navigateur d'Apple).</li>
                <li>Appuyez sur l'icône <strong>Partager</strong> en bas de l'écran.</li>
                <li>Faites défiler et sélectionnez <strong>« Sur l'écran d'accueil »</strong>.</li>
                <li>Donnez un nom (ex: LMO) et appuyez sur <strong>Ajouter</strong>.</li>
                <li>L'icône apparaîtra sur votre écran d'accueil comme une application native.</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Retour à l'accueil */}
        <div className="text-center mt-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium hover:underline"
          >
            <ArrowRight className="w-4 h-4" /> Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
