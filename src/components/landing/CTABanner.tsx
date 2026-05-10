import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CTABanner() {
  return (
    <section className="py-24 bg-emerald-700 dark:bg-emerald-800 text-white text-center">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
          Prêt à enrichir votre foi ?
        </h2>
        <p className="text-emerald-100 mb-8">Rejoignez LMO dès aujourd'hui.</p>
        <Link href="/signup" className="btn-emerald bg-white text-emerald-700 hover:bg-white/90">
          Commencer gratuitement
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </section>
  );
}