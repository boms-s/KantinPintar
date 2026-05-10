import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type AuthShellProps = {
  badge: string;
  title: string;
  description: string;
  accent: "blue" | "purple" | "red";
  children: ReactNode;
  asideTitle?: string;
  asideDescription?: string;
  className?: string;
};

const accentStyles = {
  blue: {
    outer: "from-blue-500/20 via-sky-500/10 to-transparent",
    badge: "bg-blue-600 text-white",
    text: "text-blue-600",
    ring: "ring-blue-100",
  },
  purple: {
    outer: "from-violet-500/20 via-fuchsia-500/10 to-transparent",
    badge: "bg-violet-600 text-white",
    text: "text-violet-600",
    ring: "ring-violet-100",
  },
  red: {
    outer: "from-rose-500/20 via-red-500/10 to-transparent",
    badge: "bg-red-600 text-white",
    text: "text-red-600",
    ring: "ring-red-100",
  },
} as const;

export function AuthShell({
  badge,
  title,
  description,
  accent,
  children,
  asideTitle,
  asideDescription,
  className,
}: AuthShellProps) {
  const styles = accentStyles[accent];

  return (
    <div className={cn("min-h-screen px-4 py-8 sm:px-6 lg:px-8", className)}>
      <div className={cn("mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]")}>
        <div className="relative hidden overflow-hidden rounded-[2rem] border border-slate-200/70 bg-white/75 p-8 shadow-[0_30px_90px_-36px_rgba(15,23,42,0.7)] backdrop-blur lg:flex lg:min-h-168 lg:flex-col lg:justify-between dark:border-slate-800 dark:bg-slate-950/70">
          <div className={cn("absolute inset-0 bg-linear-to-br", styles.outer)} />
          <div className="relative z-10 space-y-8">
            <div className={cn("inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold shadow-sm ring-1", styles.badge, styles.ring)}>
              {badge}
            </div>
            <div className="space-y-4">
              <h1 className="max-w-lg text-5xl font-semibold tracking-tight text-slate-950 dark:text-white">
                {title}
              </h1>
              <p className="max-w-xl text-base leading-7 text-slate-600 dark:text-slate-300">
                {description}
              </p>
            </div>
          </div>

          <div className="relative z-10 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/70 bg-white/85 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950/80">
              <p className={cn("text-xs font-semibold uppercase tracking-[0.24em]", styles.text)}>Fokus</p>
              <p className="mt-2 text-lg font-semibold text-slate-950 dark:text-white">UI yang jelas dan tidak kaku</p>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">Tampilan disusun supaya pengguna langsung paham langkah berikutnya.</p>
            </div>
            <div className="rounded-3xl border border-white/70 bg-white/85 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950/80">
              <p className={cn("text-xs font-semibold uppercase tracking-[0.24em]", styles.text)}>Arah</p>
              <p className="mt-2 text-lg font-semibold text-slate-950 dark:text-white">Siap ke backend</p>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">Form sekarang tetap di client, tapi layout dan komposisinya sudah siap dipindah ke server.</p>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className={cn("absolute inset-x-8 top-0 h-48 rounded-full bg-linear-to-br blur-3xl", styles.outer)} />
          <div className="relative rounded-[2rem] border border-slate-200/80 bg-white/90 p-6 shadow-[0_24px_80px_-32px_rgba(15,23,42,0.55)] backdrop-blur sm:p-8 dark:border-slate-800 dark:bg-slate-950/85">
            <div className="mb-8 flex items-center gap-3">
              <div className={cn("flex h-10 w-10 items-center justify-center rounded-2xl font-semibold", styles.badge)}>
                🍽️
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Smart Kantin</p>
                <h2 className="text-xl font-semibold text-slate-950 dark:text-white">{asideTitle ?? title}</h2>
              </div>
            </div>
            <p className="mb-6 text-sm leading-6 text-slate-600 dark:text-slate-300">
              {asideDescription ?? description}
            </p>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}