import { SelectHTMLAttributes } from "react";
import { cn } from "@/app/lib/utils";

export function Select({
  className,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}
