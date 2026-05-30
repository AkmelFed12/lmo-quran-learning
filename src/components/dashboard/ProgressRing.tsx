"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface ProgressRingProps {
  value: number;
  label: string;
}

export default function ProgressRing({ value, label }: ProgressRingProps) {
  const [animatedValue, setAnimatedValue] = useState(0);
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedValue / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedValue(value), 300);
    return () => clearTimeout(timer);
  }, [value]);

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center"
    >
      <svg width="100" height="100" className="transform -rotate-90">
        <circle
          cx="50" cy="50" r={radius}
          stroke="currentColor"
          strokeWidth="8"
          fill="transparent"
          className="text-slate-100 dark:text-slate-800"
        />
        <motion.circle
          cx="50" cy="50" r={radius}
          stroke="currentColor"
          strokeWidth="8"
          fill="transparent"
          strokeLinecap="round"
          className="text-emerald-500"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>
      <span className="text-sm font-medium mt-1 text-slate-600 dark:text-slate-400">{label}</span>
      <motion.span
        key={value}
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-lg font-bold"
      >
        {value}%
      </motion.span>
    </motion.div>
  );
}