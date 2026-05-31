"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { useDashboardData } from "@/lib/hooks/useDashboardData";

type ProgressData = ReturnType<typeof useDashboardData>["data"];

type ExportProgressPDFProps = {
  data: ProgressData;
  globalScore: number;
  levelLabel: string;
};

function sanitizeFileName(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9-_]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

export default function ExportProgressPDF({ data, globalScore, levelLabel }: ExportProgressPDFProps) {
  const [exporting, setExporting] = useState(false);

  const exportPDF = async () => {
    if (exporting) return;
    setExporting(true);
    try {
      const { jsPDF } = await import("jspdf");
      const generatedAt = new Date();
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();

      doc.setFillColor(4, 120, 87);
      doc.rect(0, 0, pageWidth, 36, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text("Résumé de progression", 20, 18);
      doc.setFontSize(10);
      doc.text("LMO Quran Learning", 20, 27);

      doc.setTextColor(15, 23, 42);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.text(`Date : ${generatedAt.toLocaleDateString("fr-FR")}`, 20, 50);
      doc.text(`Niveau global : ${levelLabel}`, 20, 60);
      doc.text(`Score moyen : ${globalScore}%`, 20, 70);
      doc.text(`Série actuelle : ${data.streak} jour(s)`, 20, 80);
      doc.text(`Objectif du jour : ${data.dailyGoalCurrent} / ${data.dailyGoalTarget}`, 20, 90);

      doc.setFont("helvetica", "bold");
      doc.text("Progression", 20, 110);
      doc.setFont("helvetica", "normal");
      doc.text(`Arabe : ${data.arabicProgress}%`, 24, 122);
      doc.text(`Écoute : ${data.listeningProgress}%`, 24, 132);
      doc.text(`Mémorisation : ${data.memorizationProgress}%`, 24, 142);

      let y = 162;
      if (data.lastAssessment?.module) {
        doc.setFont("helvetica", "bold");
        doc.text("Dernier test", 20, y);
        doc.setFont("helvetica", "normal");
        y += 12;
        doc.text(`${data.lastAssessment.module} : ${data.lastAssessment.score || 0}/${data.lastAssessment.total || 0}`, 24, y);
        y += 16;
      }

      if (data.lastListened?.surahId) {
        doc.setFont("helvetica", "bold");
        doc.text("Dernière écoute", 20, y);
        doc.setFont("helvetica", "normal");
        y += 12;
        doc.text(`Sourate ${data.lastListened.surahId}, verset ${data.lastListened.ayahNumber || 1}`, 24, y);
        y += 16;
      }

      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text(
        "Ce document est un résumé personnel généré depuis l'application. Il ne remplace pas une validation par un enseignant qualifié.",
        20,
        280,
        { maxWidth: pageWidth - 40 },
      );

      doc.save(`progression-lmo-${sanitizeFileName(generatedAt.toISOString().slice(0, 10))}.pdf`);
      toast.success("Résumé PDF généré.");
    } catch {
      toast.error("Impossible de générer le PDF pour le moment.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <Button type="button" variant="outline" onClick={() => void exportPDF()} disabled={exporting}>
      <Download className="mr-2 h-4 w-4" />
      {exporting ? "Préparation..." : "Exporter en PDF"}
    </Button>
  );
}
