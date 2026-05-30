"use client";

import { Award, CheckCircle2, Download, LockKeyhole } from "lucide-react";
import { addDoc, collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { certificateIcons, certificateTracks } from "@/lib/learning-content";
import { useDashboardData } from "@/lib/hooks/useDashboardData";
import { useAuth } from "@/lib/hooks/useAuth";
import { db } from "@/lib/firebase";

function isTrackUnlocked(id: string, data: ReturnType<typeof useDashboardData>["data"]) {
  if (id === "alphabet") return data.arabicProgress >= 70;
  if (id === "reading") return data.arabicProgress >= 85 && data.listeningProgress >= 20;
  if (id === "tajwid-1") return data.lastAssessment?.module?.toLowerCase().includes("tajwid") && (data.lastAssessment.score || 0) >= 8;
  if (id === "juz-amma") return data.memorizationProgress >= 10;
  return false;
}

export default function CertificatesPanel() {
  const { user } = useAuth();
  const { data } = useDashboardData();

  const prepareCertificate = async (track: (typeof certificateTracks)[number]) => {
    if (!user) {
      toast.error("Connexion requise pour préparer une attestation.");
      return;
    }

    const issuedAt = new Date();
    const learnerName = user.displayName || user.email || "Apprenant";
    const certificateId = `${user.uid}_${track.id}`;

    await setDoc(
      doc(db, "certificates", certificateId),
      {
        id: certificateId,
        userId: user.uid,
        learnerName,
        title: track.title,
        level: track.level,
        issuedAt: serverTimestamp(),
        note: track.proof,
      },
      { merge: true }
    );

    await addDoc(collection(db, "adminAuditLogs"), {
      action: "certificate.issued",
      targetType: "certificate",
      targetId: certificateId,
      summary: `Attestation prête : ${track.title} pour ${learnerName}.`,
      actorEmail: user.email || "apprenant",
      actorId: user.uid,
      createdAt: serverTimestamp(),
    });

    const certificateWindow = window.open("", "_blank", "width=900,height=700");
    if (!certificateWindow) {
      toast.error("Autorisez les fenêtres pop-up pour préparer le PDF.");
      return;
    }

    certificateWindow.document.write(`
      <html lang="fr">
        <head>
          <title>Attestation - ${track.title}</title>
          <style>
            body { font-family: Georgia, serif; background: #f8f5ed; color: #0f172a; padding: 48px; }
            .sheet { border: 6px double #047857; background: white; padding: 56px; min-height: 620px; text-align: center; }
            .brand { color: #047857; letter-spacing: 0.24em; text-transform: uppercase; font-weight: 700; }
            h1 { font-size: 42px; margin: 32px 0 12px; }
            h2 { font-size: 28px; margin: 16px 0; color: #064e3b; }
            p { font-size: 17px; line-height: 1.8; }
            .meta { margin-top: 48px; display: flex; justify-content: space-between; font-size: 14px; color: #475569; }
            @media print { body { background: white; padding: 0; } .sheet { border-color: #064e3b; } }
          </style>
        </head>
        <body>
          <main class="sheet">
            <div class="brand">LMO Quran Learning</div>
            <h1>Attestation interne</h1>
            <p>Cette attestation confirme que</p>
            <h2>${learnerName}</h2>
            <p>a débloqué le jalon pédagogique :</p>
            <h2>${track.title}</h2>
            <p>Niveau : ${track.level}</p>
            <p>${track.proof}</p>
            <p><strong>Important :</strong> cette attestation accompagne le suivi personnel et ne remplace pas une validation auprès d'un enseignant qualifié.</p>
            <div class="meta">
              <span>Date : ${issuedAt.toLocaleDateString("fr-FR")}</span>
              <span>ID : ${certificateId}</span>
            </div>
          </main>
          <script>window.onload = () => window.print();</script>
        </body>
      </html>
    `);
    certificateWindow.document.close();
    toast.success("Attestation prête à enregistrer en PDF.");
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <header className="card-premium p-5 sm:p-6">
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-gold">Certificats internes</p>
        <h1 className="mt-2 text-3xl font-heading font-bold text-slate-950 dark:text-white sm:text-4xl">
          Jalons pédagogiques
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">
          Ces attestations servent à suivre le parcours dans l'application. Elles ne remplacent pas une validation auprès d'un enseignant qualifié.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        {certificateTracks.map((track, index) => {
          const Icon = certificateIcons[index % certificateIcons.length] || Award;
          const unlocked = isTrackUnlocked(track.id, data);
          return (
            <article
              key={track.id}
              className={`rounded-[1.8rem] border p-5 ${
                unlocked
                  ? "border-gold bg-gradient-to-br from-emerald-950 to-emerald-800 text-white shadow-xl shadow-emerald-950/15"
                  : "border-emerald-900/10 bg-white dark:border-white/10 dark:bg-slate-900"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className={`grid h-12 w-12 place-items-center rounded-2xl ${unlocked ? "bg-gold text-emerald-950" : "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-gold"}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${unlocked ? "bg-white/15 text-gold" : "bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-300"}`}>
                  {unlocked ? "débloqué" : "à compléter"}
                </span>
              </div>
              <h2 className="mt-4 text-xl font-bold">{track.title}</h2>
              <p className={unlocked ? "mt-1 text-sm text-emerald-50/75" : "mt-1 text-sm text-slate-500 dark:text-slate-400"}>{track.level}</p>
              <div className="mt-4 space-y-2">
                {track.requirements.map((requirement) => (
                  <p key={requirement} className={`flex gap-2 text-sm leading-6 ${unlocked ? "text-emerald-50" : "text-slate-600 dark:text-slate-300"}`}>
                    <CheckCircle2 className={`mt-0.5 h-4 w-4 shrink-0 ${unlocked ? "text-gold" : "text-emerald-700 dark:text-gold"}`} />
                    {requirement}
                  </p>
                ))}
              </div>
              <p className={unlocked ? "mt-4 text-xs leading-5 text-emerald-50/70" : "mt-4 text-xs leading-5 text-slate-500 dark:text-slate-400"}>{track.proof}</p>
              <Button disabled={!unlocked} variant={unlocked ? "default" : "outline"} onClick={() => void prepareCertificate(track)} className="mt-5 min-h-11">
                {unlocked ? <Download className="mr-2 h-4 w-4" /> : <LockKeyhole className="mr-2 h-4 w-4" />}
                {unlocked ? "Préparer le PDF" : "Verrouillé"}
              </Button>
            </article>
          );
        })}
      </section>
    </div>
  );
}
