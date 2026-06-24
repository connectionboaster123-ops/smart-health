import { forwardRef, type InputHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

interface FieldProps {
  label: string;
  helper?: string;
}

export const Input = forwardRef<HTMLInputElement, FieldProps & InputHTMLAttributes<HTMLInputElement>>(
  ({ label, helper, className, id, ...props }, ref) => {
    const inputId = id ?? props.name ?? label.toLowerCase().replace(/\s+/g, "-");

    return (
      <label className="block" htmlFor={inputId}>
        <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</span>
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-950 shadow-sm transition placeholder:text-slate-400 focus:border-clinical-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white",
            className
          )}
          {...props}
        />
        {helper ? <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">{helper}</span> : null}
      </label>
    );
  }
);

Input.displayName = "Input";

export function Select({ label, helper, className, id, children, ...props }: FieldProps & SelectHTMLAttributes<HTMLSelectElement>) {
  const inputId = id ?? props.name ?? label.toLowerCase().replace(/\s+/g, "-");

  return (
    <label className="block" htmlFor={inputId}>
      <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</span>
      <select
        id={inputId}
        className={cn(
          "h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-950 shadow-sm transition focus:border-clinical-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white",
          className
        )}
        {...props}
      >
        {children}
      </select>
      {helper ? <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">{helper}</span> : null}
    </label>
  );
}

export function Textarea({ label, helper, className, id, ...props }: FieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const inputId = id ?? props.name ?? label.toLowerCase().replace(/\s+/g, "-");

  return (
    <label className="block" htmlFor={inputId}>
      <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</span>
      <textarea
        id={inputId}
        className={cn(
          "min-h-28 w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm text-slate-950 shadow-sm transition placeholder:text-slate-400 focus:border-clinical-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white",
          className
        )}
        {...props}
      />
      {helper ? <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">{helper}</span> : null}
    </label>
  );
}
