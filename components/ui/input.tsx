import * as React from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn("rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-800", className)}
      {...props}
    />
  );
}
