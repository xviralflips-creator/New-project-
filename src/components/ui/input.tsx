import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...rest }, ref) {
    return <input ref={ref} className={cn("input", className)} {...rest} />;
  }
);

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea({ className, ...rest }, ref) {
  return <textarea ref={ref} className={cn("input min-h-[120px] resize-y", className)} {...rest} />;
});

export function Field({
  label,
  hint,
  error,
  children,
}: {
  label?: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      {label && <span className="label block">{label}</span>}
      {children}
      {error ? (
        <span className="block text-xs text-red-400">{error}</span>
      ) : hint ? (
        <span className="block text-xs text-fg-subtle">{hint}</span>
      ) : null}
    </label>
  );
}
