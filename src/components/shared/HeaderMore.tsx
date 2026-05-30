"use client";
import { useState } from "react";
import Link from "next/link";
import { MoreHorizontal, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { href: "/about", label: "À propos" },
  { href: "/contact", label: "Contact" },
  { href: "/blog", label: "Actualités" },
  { href: "/faq", label: "FAQ" },
  { href: "/sources-methodology", label: "Sources" },
  { href: "/support", label: "Soutenir" },
  { href: "/privacy", label: "Confidentialité" },
  { href: "/terms", label: "Conditions" },
];

export default function HeaderMore() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="sm:hidden p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        aria-label="Plus"
      >
        {open ? <X className="w-5 h-5" /> : <MoreHorizontal className="w-5 h-5" />}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div
              className="sm:hidden fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="sm:hidden absolute top-full right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 z-50 py-2"
            >
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
