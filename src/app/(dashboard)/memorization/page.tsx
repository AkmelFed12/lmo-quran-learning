import MemorizationTracker from "@/components/quran/MemorizationTracker";
import RevisionProtocol from "@/components/learning/RevisionProtocol";

export default function MemorizationPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <header className="card-premium p-5 sm:p-6">
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-gold">Révision ciblée</p>
        <h1 className="mt-2 text-3xl font-heading font-bold text-slate-950 dark:text-white">Mémorisation</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">
          Planifiez une portion, révisez-la au bon moment, puis notez la qualité de rappel. Les passages fragiles reviennent plus tôt.
        </p>
      </header>
      <RevisionProtocol />
      <MemorizationTracker />
    </div>
  );
}
