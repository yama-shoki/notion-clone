"use client";

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface ItemProps {
  label: string;
  onClick?: () => void;
  icon: LucideIcon;
  className?: string;
}

export const Item = ({ label, onClick, icon: Icon, className }: ItemProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "group min-h-[27px] text-sm py-1 pr-3 w-full hover:bg-primary/5 flex items-center text-muted-foreground font-medium",
        className
      )}
    >
      <Icon className="shrink-0 h-4 w-4 mr-2 text-muted-foreground" />
      <span className="truncate">{label}</span>
    </div>
  );
};
