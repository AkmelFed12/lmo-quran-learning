import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  QUESTION_BANK_SIZE,
  QUESTION_CATEGORY_LABELS,
  getQuestionBatch,
} from "@/lib/question-bank";

const samples = getQuestionBatch({
  seed: "admin-quality-preview",
  count: 8,
  category: "mixed",
});

export default function AdminQuestionsPage() {
  return (
    <div className="space-y-6">
      <header className="rounded-[2rem] bg-slate-950 p-6 text-white">
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-gold">Évaluation</p>
        <h1 className="mt-2 text-3xl font-heading font-bold">Banque de questions</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
          La plateforme utilise une base pédagogique organisée de {QUESTION_BANK_SIZE.toLocaleString("fr-FR")} questions.
          Les séries sont préparées à la demande, sans doublons dans une même session, pour éviter un stockage massif inutile.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Total disponible</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{QUESTION_BANK_SIZE.toLocaleString("fr-FR")}</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">questions disponibles</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Doublons session</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-300">0</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">contrôle par identifiant et signature</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Modules couverts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{Object.keys(QUESTION_CATEGORY_LABELS).length}</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">arabe, Coran, tajwid, mémorisation</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Mode recommandé</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-bold">Préparation à la demande</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">plus rapide qu'un import Firestore de masse</p>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <CardHeader>
            <CardTitle>Répartition pédagogique</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(QUESTION_CATEGORY_LABELS).map(([key, label]) => (
              <div key={key} className="flex items-center justify-between rounded-2xl border border-slate-100 p-3 text-sm dark:border-slate-800">
                <span>{label}</span>
                <span className="font-mono text-xs text-slate-500">actif</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Échantillon de contrôle qualité</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {samples.map((question) => (
              <div key={question.id} className="rounded-2xl border border-slate-100 p-4 dark:border-slate-800">
                <div className="mb-2 flex flex-wrap gap-2">
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100">
                    {QUESTION_CATEGORY_LABELS[question.category]}
                  </span>
                  <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
                    {question.level}
                  </span>
                </div>
                <p className="text-sm font-semibold leading-6">{question.question}</p>
                <p className="mt-2 text-xs text-slate-500">Réponse : {question.answer}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
