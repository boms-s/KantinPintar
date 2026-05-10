import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

const badgeVariants = cva("inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold", {
  variants: {
    variant: {
      default: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
      primary: "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-200",
      success: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200",
      warning: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-200",
      destructive: "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-200",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface BadgeProps extends VariantProps<typeof badgeVariants> {
  children: ReactNode;
  className?: string;
}

export function Badge({ children, variant, className }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)}>{children}</span>;
}
