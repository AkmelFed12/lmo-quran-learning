"use client";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, Brain, Trophy, Globe, Smartphone, Star, Download,
  Volume2, VolumeX
} from "lucide-react";

const scenes = [
  { id: 1, title: "Apprendre et lire le Coran", subtitle: "avec LMO Quran Learning", icon: BookOpen, color: "text-emerald-400" },
  { id: 2, title: "Une plateforme complète", subtitle: "Arabe • Coran • Mémorisation", icons: [{ Icon: BookOpen, label: "Arabe" }, { Icon: Brain, label: "Coran" }, { Icon: Star, label: "Mémorisation" }] },
  { id: 3, title: "Quiz quotidien et communauté", subtitle: "Compétition • Forum • Entraide", icons: [{ Icon: Trophy, label: "Compétition" }, { Icon: Globe, label: "Forum" }, { Icon: Smartphone, label: "Entraide" }] },
  { id: 4, title: "Disponible partout", subtitle: "Web • Android • iOS (bientôt)", icons: [{ Icon: Globe, label: "Web" }, { Icon: Smartphone, label: "Android" }, { Icon: Star, label: "iOS" }] },
  { id: 5, title: "100 % gratuit", subtitle: "Rejoignez-nous !", icon: Download, color: "text-amber-400" },
];

export default function PromoVideo() {
  const [currentScene, setCurrentScene] = useState(0);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioAuthorized, setAudioAuthorized] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Défilement automatique
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentScene((prev) => (prev + 1) % scenes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Autoriser l'audio après le premier clic/toucher n'importe où sur la page
  useEffect(() => {
    const authorizeAudio = () => {
      if (!audioAuthorized && audioRef.current) {
        audioRef.current.play().then(() => {
          setAudioPlaying(true);
          setAudioAuthorized(true);
        }).catch(() => {});
      }
    };
    window.addEventListener('click', authorizeAudio, { once: true });
    window.addEventListener('touchend', authorizeAudio, { once: true });
    return () => {
      window.removeEventListener('click', authorizeAudio);
      window.removeEventListener('touchend', authorizeAudio);
    };
  }, [audioAuthorized]);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (audioPlaying) {
      audioRef.current.pause();
      setAudioPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setAudioPlaying(true);
        setAudioAuthorized(true);
      }).catch(() => {});
    }
  };

  const scene = scenes[currentScene];

  return (
    <section className="relative bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950 overflow-hidden">
      {/* Audio Muhammad Al-Luhaidan (fichier local) */}
      <audio ref={audioRef} loop preload="auto">
        <source src="/audio/luhaidan-fatiha.mp3" type="audio/mpeg" />
      </audio>

      {/* Bouton audio */}
      <button
        onClick={toggleAudio}
        className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
        title={audioPlaying ? "Couper le son" : "Activer le son"}
      >
        {audioPlaying ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
      </button>

      <div className="container mx-auto px-4 py-12 sm:py-16 md:py-24 relative z-10">
        <div className="max-w-3xl mx-auto text-center min-h-[350px] sm:min-h-[400px] flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={scene.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="space-y-4 sm:space-y-6"
            >
              {scene.icon && (
                <scene.icon className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto ${scene.color || "text-white"}`} />
              )}
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-heading font-bold text-white">
                {scene.title}
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-emerald-100">{scene.subtitle}</p>

              {scene.icons && (
                <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-6 sm:mt-8">
                  {scene.icons.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col items-center bg-white/10 backdrop-blur-sm rounded-2xl p-3 sm:p-4 w-24 sm:w-28 border border-white/20"
                    >
                      <item.Icon className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-300 mb-1 sm:mb-2" />
                      <span className="text-white text-xs sm:text-sm font-medium">{item.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Barre de progression */}
          <div className="flex justify-center gap-2 mt-8 sm:mt-10">
            {scenes.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentScene(idx)}
                className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                  idx === currentScene ? "bg-white w-6 sm:w-8" : "bg-white/40 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
