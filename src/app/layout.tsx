import type { Metadata } from "next";
import "@/styles/globals.css";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Learn and Read AL QU'RAN with LMO Qu'ran Learning",
  description: "Plateforme complète d'apprentissage de l'arabe et du Coran avec suivi intelligent.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="min-h-screen bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Toaster richColors position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}