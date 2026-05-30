"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Send, Phone, Mail, MessageCircle, MapPin } from "lucide-react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.error("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    setLoading(true);
    try {
      await addDoc(collection(db, "contacts"), {
        name,
        email,
        phone,
        message,
        createdAt: new Date(),
      });
      toast.success("Message envoyé avec succès !");
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch (err) {
      toast.error("Erreur lors de l'envoi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-center mb-8 text-slate-800 dark:text-white">
          Contactez-nous
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 text-center mb-16 max-w-2xl mx-auto leading-relaxed">
          Une question, une suggestion ou simplement envie de nous encourager ? 
          N'hésitez pas à nous écrire. Nous vous répondrons dans les meilleurs délais.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Carte e-mail */}
          <a
            href="mailto:ouattaralm12@gmail.com"
            className="card-premium p-6 flex items-start gap-4 hover:border-emerald-500 transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-800/50 transition">
              <Mail className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">E-mail</h3>
              <p className="text-slate-600 dark:text-slate-400 break-all">ouattaralm12@gmail.com</p>
            </div>
          </a>

          {/* Carte Téléphone */}
          <a
            href="tel:+2250150070083"
            className="card-premium p-6 flex items-start gap-4 hover:border-emerald-500 transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-800/50 transition">
              <Phone className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Téléphone</h3>
              <p className="text-slate-600 dark:text-slate-400">0150070083</p>
              <p className="text-slate-600 dark:text-slate-400">0574724233</p>
              <p className="text-slate-600 dark:text-slate-400">0705583082</p>
            </div>
          </a>

          {/* Carte WhatsApp */}
          <a
            href="https://wa.me/2250150070083"
            target="_blank"
            rel="noopener noreferrer"
            className="card-premium p-6 flex items-start gap-4 hover:border-emerald-500 transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0 group-hover:bg-green-200 dark:group-hover:bg-green-800/50 transition">
              <MessageCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">WhatsApp</h3>
              <p className="text-slate-600 dark:text-slate-400">+225 01 50 07 00 83</p>
            </div>
          </a>
        </div>

        {/* Formulaire de contact */}
        <div className="max-w-2xl mx-auto">
          <div className="card-premium p-8">
            <h2 className="text-2xl font-heading font-bold mb-6 text-center">Envoyez-nous un message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Nom <span className="text-red-500">*</span></label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Votre nom" required />
              </div>
              <div>
                <label className="text-sm font-medium">E-mail <span className="text-red-500">*</span></label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Votre e-mail" required />
              </div>
              <div>
                <label className="text-sm font-medium">Téléphone</label>
                <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Votre numéro de téléphone" />
              </div>
              <div>
                <label className="text-sm font-medium">Message <span className="text-red-500">*</span></label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2"
                  placeholder="Votre message…"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                <Send className="w-4 h-4 mr-2" /> {loading ? "Envoi…" : "Envoyer le message"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
