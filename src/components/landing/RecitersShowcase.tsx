import { Mic } from "lucide-react";

const reciters = ["Al-Sudais", "Al-Luhaidan", "Al-Dosari", "Al-Hussary"];

export default function RecitersShowcase() {
  return (
    <section className="py-24 bg-emerald-50 dark:bg-emerald-950/20">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-heading font-bold mb-8">Récitateurs renommés</h2>
        <div className="flex flex-wrap justify-center gap-6">
          {reciters.map((name) => (
            <div key={name} className="card-premium p-6 flex items-center gap-3">
              <Mic className="w-5 h-5 text-emerald-600" />
              <span className="font-medium">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}