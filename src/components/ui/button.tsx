import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline";
  size?: "sm" | "default" | "lg";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const base = "inline-flex items-center justify-center rounded-full font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:pointer-events-none disabled:opacity-50";
    const variants = {
      default: "bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-200/50 dark:shadow-emerald-800/20",
      outline: "border border-slate-300 dark:border-slate-600 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800",
    };
    const sizes = {
      sm: "h-9 px-3 text-sm",
      default: "h-10 px-5 py-2",
      lg: "h-12 px-8 text-lg",
    };
    return (
      <button
        className={cn(base, variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
export { Button };