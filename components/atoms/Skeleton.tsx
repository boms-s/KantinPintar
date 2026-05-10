import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800",
        className,
      )}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
      <Skeleton className="h-6 w-32 mb-3" />
      <Skeleton className="h-4 w-48 mb-4" />
      <Skeleton className="h-32 w-full" />
    </div>
  );
}
