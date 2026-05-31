"use client";
import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ShareButtonProps {
  title: string;
  text: string;
  url?: string;
}

export default function ShareButton({ title, text, url }: ShareButtonProps) {
  const handleShare = async () => {
    if (typeof window === "undefined") return;
    const shareData = {
      title,
      text,
      url: url || window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if (err instanceof DOMException && err.name !== "AbortError") {
          toast.error("Impossible de partager.");
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${title} - ${text} ${shareData.url}`);
        toast.success("Lien copié dans le presse-papier.");
      } catch {
        toast.error("Copie impossible sur ce navigateur.");
      }
    }
  };

  return (
    <Button variant="outline" size="sm" onClick={handleShare} aria-label="Partager cette page">
      <Share2 className="w-4 h-4 mr-2" /> Partager
    </Button>
  );
}
