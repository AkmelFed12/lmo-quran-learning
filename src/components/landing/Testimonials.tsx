const testimonials = [
  { quote: "Une plateforme magnifique, très motivante.", author: "Fatima K." },
  { quote: "Mon Coran progresse chaque jour, merci LMO.", author: "Ahmed B." },
  { quote: "L'apprentissage de l'arabe est devenu facile.", author: "Sophie M." },
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-white dark:bg-slate-950">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-heading font-bold text-center mb-12">Ils nous font confiance</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div key={i} className="card-premium p-6 text-center">
              <p className="italic text-slate-600 dark:text-slate-300 mb-4">"{t.quote}"</p>
              <p className="font-semibold">{t.author}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}