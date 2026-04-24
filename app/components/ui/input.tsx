import { InputHTMLAttributes } from "react";
import { cn } from "@/app/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none",
        className,
      )}
      {...props}
    />
  );
}
