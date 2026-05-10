import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "outline" | "glass";
}

export function Card({ children, className, variant = "default" }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-[1.5rem] p-5",
        variant === "default" && "border border-slate-200/80 bg-white/90 shadow-[0_18px_52px_-32px_rgba(15,23,42,0.45)] dark:border-slate-800 dark:bg-slate-950/80",
        variant === "outline" && "border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950",
        variant === "glass" && "border border-slate-200/50 bg-white/80 backdrop-blur dark:border-slate-800/50 dark:bg-slate-950/80",
        className,
      )}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function CardHeader({ title, description, action }: CardHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h3 className="text-lg font-semibold text-slate-950 dark:text-white">{title}</h3>
        {description && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className }: CardContentProps) {
  return <div className={cn("mt-5", className)}>{children}</div>;
}

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

export function CardFooter({ children, className }: CardFooterProps) {
  return <div className={cn("mt-5 flex gap-3", className)}>{children}</div>;
}
