"use client";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { jsPDF } from "jspdf";

interface DayPlan {
  day: string;
  surah: number;
  surahName: string;
  fromAyah: number;
  toAyah: number;
  verses: number;
}

export default function ExportPlanningPDF({ plan }: { plan: DayPlan[] }) {
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.text("Planning de mémorisation - LMO", 20, 20);
    doc.setFont("helvetica", "normal");
    plan.forEach((day, i) => {
      const y = 30 + i * 10;
      doc.text(
        `${day.day} : ${day.surahName} (${day.surah}) versets ${day.fromAyah} à ${day.toAyah}`,
        20,
        y
      );
    });
    doc.save("planning-lmo.pdf");
  };

  return (
    <Button onClick={exportPDF} variant="outline" className="mt-4">
      <Download className="w-4 h-4 mr-2" /> Télécharger le planning
    </Button>
  );
}
