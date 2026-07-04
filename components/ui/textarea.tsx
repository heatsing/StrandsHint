import * as React from "react";
import { cn } from "@/lib/utils";

export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn("rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-800", className)}
      {...props}
    />
  );
}
