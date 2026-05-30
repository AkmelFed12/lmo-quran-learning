"use client";
import { FormEvent, useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";

type ChatMessage = {
  role: "user" | "guide";
  text: string;
};

const starterMessages: ChatMessage[] = [
  {
    role: "guide",
    text: "As-salâm 'alaykoum. Je peux vous aider à choisir une petite session : arabe, lecture, écoute ou mémorisation.",
  },
];

function buildReply(question: string) {
  const normalized = question.toLowerCase();

  if (normalized.includes("memor") || normalized.includes("révis") || normalized.includes("revis")) {
    return "Pour mémoriser durablement, choisissez 3 à 5 versets, écoutez-les 3 fois, récitez sans regarder, puis ajoutez une révision demain.";
  }

  if (normalized.includes("arabe") || normalized.includes("lettre") || normalized.includes("alphabet")) {
    return "Commencez par 5 lettres, puis associez chaque lettre à son audio. Une courte répétition quotidienne est plus efficace qu'une longue session rare.";
  }

  if (normalized.includes("audio") || normalized.includes("écoute") || normalized.includes("récit") || normalized.includes("recit")) {
    return "Dans le lecteur Coran, utilisez la vitesse lente et la répétition 3 fois. Écoutez d'abord, puis répétez verset par verset.";
  }

  if (normalized.includes("planning") || normalized.includes("routine") || normalized.includes("objectif")) {
    return "Routine conseillée : 5 minutes d'arabe, 5 minutes d'écoute, 5 minutes de lecture, puis 3 versets à réviser. Gardez le rythme simple.";
  }

  return "Bonne question. Pour avancer aujourd'hui, je vous conseille une action courte : ouvrir le focus du jour, terminer une session, puis noter ce qui était difficile.";
}

export default function LearningGuide() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(starterMessages);
  const [input, setInput] = useState("");

  const sendMessage = (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    const question = input.trim();
    if (!question) return;

    setMessages((prev) => [
      ...prev,
      { role: "user", text: question },
      { role: "guide", text: buildReply(question) },
    ]);
    setInput("");
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-24 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg shadow-emerald-900/20 transition hover:-translate-y-0.5 hover:bg-emerald-700 md:bottom-6"
        aria-label={open ? "Fermer le guide LMO" : "Ouvrir le guide LMO"}
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-40 right-4 z-50 flex h-[28rem] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-[1.5rem] border border-emerald-100 bg-white shadow-2xl dark:border-emerald-900/50 dark:bg-slate-900 md:bottom-20"
          >
            <div className="border-b border-slate-100 bg-gradient-to-r from-emerald-600 to-teal-600 p-4 text-white dark:border-slate-800">
              <h3 className="flex items-center gap-2 font-semibold">
                <MessageCircle className="h-5 w-5" />
                Accompagnement LMO
              </h3>
              <p className="mt-1 text-xs text-emerald-50/80">Conseils rapides pour votre apprentissage.</p>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {messages.map((msg, index) => (
                <div
                  key={`${msg.role}-${index}`}
                  className={`max-w-[86%] rounded-2xl p-3 text-sm leading-6 ${
                    msg.role === "user"
                      ? "ml-auto bg-emerald-600 text-white"
                      : "mr-auto bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  }`}
                >
                  {msg.text}
                </div>
              ))}
            </div>

            <form onSubmit={sendMessage} className="flex gap-2 border-t border-slate-100 p-3 dark:border-slate-800">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ex: comment mémoriser ?"
                className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-950"
              />
              <Button size="sm" type="submit">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
