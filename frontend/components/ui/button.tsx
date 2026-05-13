import { clsx } from "clsx";
import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline" | "ghost";
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm transition active:opacity-80 disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" && "bg-charcoal text-[#fcfbf8] shadow-insetButton",
        variant === "outline" && "border border-[rgba(28,28,28,0.4)] text-charcoal",
        variant === "ghost" && "text-charcoal hover:bg-[rgba(28,28,28,0.04)]",
        className
      )}
      {...props}
    />
  );
}
