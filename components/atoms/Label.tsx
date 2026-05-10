interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
}

export function Label({ children, ...props }: LabelProps) {
  return (
    <label className="text-sm font-medium text-slate-700 dark:text-slate-200" {...props}>
      {children}
    </label>
  );
}
