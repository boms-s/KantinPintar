import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
}

export function Input({
  label,
  error,
  helper,
  icon,
  iconPosition = "right",
  className,
  ...props
}: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          className={cn(
            "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition dark:border-slate-800 dark:bg-slate-950 dark:text-white",
            "placeholder:text-slate-400 dark:placeholder:text-slate-500",
            "focus:border-slate-400 focus:ring-4 focus:ring-slate-100 dark:focus:border-slate-600 dark:focus:ring-slate-800",
            error && "border-red-300 focus:border-red-400 focus:ring-red-100 dark:border-red-500/30 dark:focus:ring-red-500/20",
            icon && iconPosition === "left" && "pl-10",
            icon && iconPosition === "right" && "pr-10",
            className,
          )}
          {...props}
        />
        {icon && (
          <div
            className={cn(
              "absolute top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500",
              iconPosition === "left" ? "left-3" : "right-3",
            )}
          >
            {icon}
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-xs font-medium text-red-600 dark:text-red-400">{error}</p>}
      {helper && !error && <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{helper}</p>}
    </div>
  );
}
