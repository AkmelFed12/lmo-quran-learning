import { GOOGLE_ADSENSE_PUBLISHER_ID } from "@/lib/monetization";

export const dynamic = "force-static";

export function GET() {
  const body = GOOGLE_ADSENSE_PUBLISHER_ID
    ? `google.com, ${GOOGLE_ADSENSE_PUBLISHER_ID}, DIRECT, f08c47fec0942fa0\n`
    : "# Google AdSense ads.txt\n# Ajoutez NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT=ca-pub-xxxxxxxxxxxxxxxx pour activer ce fichier.\n";

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
