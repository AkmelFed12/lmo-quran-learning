import type { Metadata, Viewport } from "next";
import { Amiri, Inter, Playfair_Display } from "next/font/google";
import "@/styles/globals.css";
import { ThemeProvider } from "@/components/shared/ThemeProvider";
import { LocaleProvider } from "@/lib/hooks/useLocale";
import { Toaster } from "sonner";
import PwaUpdatePrompt from "@/components/shared/PwaUpdatePrompt";
import AdSenseScript from "@/components/monetization/AdSenseScript";
import CacheRecoveryScript from "@/components/shared/CacheRecoveryScript";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-amiri",
  display: "swap",
});

export const metadata: Metadata = {
  applicationName: "LMO Quran Learning",
  title: {
    default: "LMO Quran Learning | Apprendre à lire le Coran pas à pas",
    template: "%s | LMO Quran Learning",
  },
  description: "Apprenez l'alphabet arabe, les voyelles, la lecture du Coran, les bases du tajwid et la mémorisation avec un parcours clair et progressif.",
  keywords: [
    "LMO Quran Learning",
    "apprendre arabe",
    "apprendre Coran",
    "tajwid",
    "mémorisation Coran",
    "lecture Coran",
    "application Coran",
  ],
  creator: "LMO WEB SERVICES",
  publisher: "LMO WEB SERVICES",
  metadataBase: new URL("https://lmo-quran-learning.vercel.app"),
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://lmo-quran-learning.vercel.app",
    siteName: "LMO Quran Learning",
    title: "LMO Quran Learning",
    description: "Un parcours progressif pour apprendre à lire le Coran : alphabet, voyelles, écoute, tajwid, mémorisation et révision.",
    images: [
      {
        url: "/icon-512.png",
        width: 512,
        height: 512,
        alt: "LMO Quran Learning",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "LMO Quran Learning",
    description: "Apprendre à lire le Coran pas à pas, avec un parcours simple et régulier.",
    images: ["/icon-512.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png" },
      { url: "/icon-192.png", type: "image/png" },
    ],
    shortcut: [{ url: "/favicon.ico" }],
    apple: [{ url: "/apple-icon.png", type: "image/png" }],
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#059669",
  colorScheme: "light dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${inter.variable} ${playfair.variable} ${amiri.variable}`}>
      <head>
        <CacheRecoveryScript />
        <AdSenseScript />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body suppressHydrationWarning className="min-h-screen bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
        <ThemeProvider>
          <LocaleProvider>
            {children}
            <PwaUpdatePrompt />
            <Toaster richColors position="top-center" />
            <Analytics />
            <SpeedInsights />
          </LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
