import { BarChart3, Users, Headphones } from "lucide-react";

export default function Stats() {
  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <div className="card-premium p-6">
          <BarChart3 className="w-10 h-10 mx-auto mb-4 text-emerald-600" />
          <h3 className="text-3xl font-bold">+10k</h3>
          <p className="text-slate-600 dark:text-slate-400">Utilisateurs actifs</p>
        </div>
        <div className="card-premium p-6">
          <Headphones className="w-10 h-10 mx-auto mb-4 text-emerald-600" />
          <h3 className="text-3xl font-bold">500k</h3>
          <p className="text-slate-600 dark:text-slate-400">Heures d'écoute</p>
        </div>
        <div className="card-premium p-6">
          <Users className="w-10 h-10 mx-auto mb-4 text-emerald-600" />
          <h3 className="text-3xl font-bold">1M+</h3>
          <p className="text-slate-600 dark:text-slate-400">Versets mémorisés</p>
        </div>
      </div>
    </section>
  );
}