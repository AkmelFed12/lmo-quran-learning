import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 font-heading text-xl font-bold text-emerald-700 dark:text-emerald-400">
      <BookOpen className="w-6 h-6" />
      <span>LMO</span>
    </Link>
  );
}