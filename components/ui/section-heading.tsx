import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("max-w-3xl space-y-4", align === "center" && "mx-auto text-center", className)}>
      {eyebrow ? (
        <p className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-blue-700 shadow-sm shadow-blue-100/40 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-200">
          {eyebrow}
        </p>
      ) : null}
      <div className="space-y-3">
        <h2 className="text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl dark:text-white">
          {title}
        </h2>
        {description ? (
          <p className="text-base leading-7 text-slate-600 md:text-lg dark:text-slate-300">
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
}