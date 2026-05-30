import { Mic } from "lucide-react";

const reciters = ["Al-Sudais", "Al-Afasy", "Al-Hussary", "Al-Mu'aiqly", "Al-Dosari"];

export default function RecitersShowcase() {
  return (
    <section className="py-24 bg-white dark:bg-slate-950">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-heading font-bold mb-8">
          Récitateurs renommés
        </h2>
        <div className="flex flex-wrap justify-center gap-4">
          {reciters.map((name) => (
            <div
              key={name}
              className="flex items-center gap-2 px-5 py-3 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            >
              <Mic className="w-4 h-4 text-emerald-600" />
              <span className="font-medium">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}