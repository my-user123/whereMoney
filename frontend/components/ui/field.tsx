import { clsx } from "clsx";
import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2 text-sm text-charcoal">
      <span>{label}</span>
      {children}
    </label>
  );
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={clsx(
        "h-11 rounded-md border border-line px-3 text-sm outline-none focus:shadow-focus focus:ring-2 focus:ring-blue-500/40",
        className
      )}
      {...props}
    />
  );
}

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={clsx(
        "h-11 rounded-md border border-line px-3 text-sm outline-none focus:shadow-focus focus:ring-2 focus:ring-blue-500/40",
        className
      )}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={clsx(
        "min-h-24 rounded-md border border-line px-3 py-2 text-sm outline-none focus:shadow-focus focus:ring-2 focus:ring-blue-500/40",
        className
      )}
      {...props}
    />
  );
}
