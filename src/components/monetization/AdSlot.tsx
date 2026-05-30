"use client";

import { useEffect, useRef } from "react";
import { GOOGLE_ADSENSE_CLIENT, GOOGLE_ADSENSE_ENABLED } from "@/lib/monetization";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

type AdSlotProps = {
  slot?: string;
  className?: string;
  label?: string;
  minHeight?: number;
};

export default function AdSlot({
  slot,
  className = "",
  label = "Espace publicitaire",
  minHeight = 120,
}: AdSlotProps) {
  const pushed = useRef(false);
  const canRender = GOOGLE_ADSENSE_ENABLED && Boolean(slot);

  useEffect(() => {
    if (!canRender || pushed.current) return;
    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
      pushed.current = true;
    } catch {
      pushed.current = false;
    }
  }, [canRender, slot]);

  if (!canRender) return null;

  return (
    <aside
      aria-label={label}
      className={`rounded-[1.5rem] border border-emerald-900/10 bg-white/70 p-3 shadow-sm dark:border-white/10 dark:bg-slate-900/60 ${className}`}
      style={{ minHeight }}
    >
      <p className="mb-2 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
        {label}
      </p>
      <ins
        className="adsbygoogle block"
        style={{ display: "block" }}
        data-ad-client={GOOGLE_ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  );
}
