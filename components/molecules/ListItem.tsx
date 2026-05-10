import { cn } from "@/lib/utils";

interface ListItemProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export function ListItem({
  title,
  subtitle,
  action,
  onClick,
  className,
}: ListItemProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition dark:border-slate-800 dark:bg-slate-950",
        onClick && "cursor-pointer hover:border-slate-300 dark:hover:border-slate-700",
        className,
      )}
    >
      <div className="flex-1">
        <p className="text-sm font-semibold text-slate-950 dark:text-white">
          {title}
        </p>
        {subtitle && (
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
