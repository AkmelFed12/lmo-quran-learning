"use client";
import { useAuth } from "@/lib/hooks/useAuth";
import LandingContent from "@/components/landing/LandingContent";
import WelcomeHero from "@/components/landing/WelcomeHero";
import Loading from "@/components/shared/Loading";

export default function HomePage() {
  const { user, loading } = useAuth();

  if (loading) return <Loading />;

  return (
    <main className="relative overflow-hidden">
      {user ? <WelcomeHero /> : <LandingContent />}
    </main>
  );
}