"use client";
import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import GlobalSearch from "./GlobalSearch";

export default function SearchToggle() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative sm:hidden">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          aria-label="Rechercher"
        >
          <Search className="w-5 h-5" />
        </button>
      ) : (
        <div className="absolute right-0 top-0 w-screen max-w-xs z-50">
          <GlobalSearch />
          <button
            onClick={() => setOpen(false)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}