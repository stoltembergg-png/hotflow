import * as React from "react";
import { cn } from "@/lib/utils";

const badgeVariants = {
  default: "bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-300 border-orange-500/30",
  secondary: "bg-white/10 text-white/70 border-white/10",
  destructive: "bg-red-500/20 text-red-300 border-red-500/30",
  outline: "text-white/70 border-white/20",
  success: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  warning: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
};

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof badgeVariants;
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
        badgeVariants[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
