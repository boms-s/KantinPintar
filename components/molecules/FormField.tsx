import { Input } from "@/components/atoms/Input";
import { Label } from "@/components/atoms/Label";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface FormFieldProps {
  label: string;
  error?: string;
  helper?: string;
  children: ReactNode;
  required?: boolean;
  className?: string;
}

export function FormField({
  label,
  error,
  helper,
  children,
  required = false,
  className,
}: FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {error && <p className="text-xs font-medium text-red-600 dark:text-red-400">{error}</p>}
      {helper && !error && (
        <p className="text-xs text-slate-500 dark:text-slate-400">{helper}</p>
      )}
    </div>
  );
}
