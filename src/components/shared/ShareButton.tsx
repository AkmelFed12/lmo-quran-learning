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
    const shareData = {
      title,
      text,
      url: url || window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if ((err as any).name !== "AbortError") {
          toast.error("Impossible de partager.");
        }
      }
    } else {
      // Fallback : copier dans le presse-papier
      await navigator.clipboard.writeText(`${title} - ${text} ${shareData.url}`);
      toast.success("Lien copié dans le presse-papier !");
    }
  };

  return (
    <Button variant="outline" size="sm" onClick={handleShare}>
      <Share2 className="w-4 h-4 mr-2" /> Partager
    </Button>
  );
}