import type { ComponentType } from "react";

import { cn } from "@/lib/utils";

type FeatureCardProps = {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
  tone?: "blue" | "emerald" | "amber";
  className?: string;
};

const toneStyles = {
  blue: "bg-blue-50 text-blue-600 ring-blue-100 dark:bg-blue-500/10 dark:text-blue-200 dark:ring-blue-500/20",
  emerald:
    "bg-emerald-50 text-emerald-600 ring-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-200 dark:ring-emerald-500/20",
  amber:
    "bg-amber-50 text-amber-600 ring-amber-100 dark:bg-amber-500/10 dark:text-amber-200 dark:ring-amber-500/20",
} as const;

export function FeatureCard({ icon: Icon, title, description, tone = "blue", className }: FeatureCardProps) {
  return (
    <article
      className={cn(
        "group rounded-2xl border border-slate-200/80 bg-white/85 p-5 shadow-[0_12px_40px_-28px_rgba(15,23,42,0.45)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_48px_-28px_rgba(15,23,42,0.55)] dark:border-slate-800 dark:bg-slate-950/70",
        className,
      )}
    >
      <div className={cn("mb-4 inline-flex rounded-2xl p-3 ring-1", toneStyles[tone])}>
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-semibold text-slate-950 dark:text-white">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{description}</p>
    </article>
  );
}