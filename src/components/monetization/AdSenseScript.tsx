import { GOOGLE_ADSENSE_CLIENT, GOOGLE_ADSENSE_ENABLED } from "@/lib/monetization";

export default function AdSenseScript() {
  if (!GOOGLE_ADSENSE_ENABLED) return null;

  return (
    <script
      async
      crossOrigin="anonymous"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${GOOGLE_ADSENSE_CLIENT}`}
    />
  );
}
