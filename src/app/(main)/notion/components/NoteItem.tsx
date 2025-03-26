"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight, File, Plus, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";

interface NoteItemProps {
  id: number;
  title: string;
  level: number;
  isExpanded: boolean;
  onToggle: (id: number) => void;
  onAddChild: (parentId: number) => void;
  onDelete: (id: number) => void;
  children?: React.ReactNode;
}

export function NoteItem({
  id,
  title,
  level,
  isExpanded,
  onToggle,
  onAddChild,
  onDelete,
  children,
}: NoteItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddChild(id);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(id);
  };

  // ページ遷移用のハンドラー
  const handleNavigate = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/notion/${id}`);
  };

  // 展開/折りたたみ用のハンドラー
  const handleToggleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle(id);
  };

  return (
    <div>
      <div
        className={cn(
          "flex items-center py-1.5 px-2 rounded-md cursor-pointer group transition-all duration-200",
          isHovered ? "bg-accent" : "hover:bg-accent/50"
        )}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* 展開/折りたたみアイコン - クリックでツリー操作 */}
        <div className="flex items-center" onClick={handleToggleClick}>
          {children ? (
            isExpanded ? (
              <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform" />
            ) : (
              <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform" />
            )
          ) : (
            <File className="h-4 w-4 shrink-0 text-muted-foreground" />
          )}
        </div>

        {/* タイトル部分 - クリックでページ遷移 */}
        <div
          className="ml-1.5 text-sm truncate flex-1 min-w-0"
          onClick={handleNavigate}
        >
          {title}
        </div>

        <div
          className={cn(
            "flex items-center gap-1 transition-opacity duration-200",
            isHovered ? "opacity-100" : "opacity-0"
          )}
        >
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 rounded-sm hover:bg-accent-foreground/10"
                  onClick={handleAddClick}
                >
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p className="text-xs">子ノート追加</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 rounded-sm hover:bg-destructive/10 hover:text-destructive"
                  onClick={handleDeleteClick}
                >
                  <Trash className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p className="text-xs">削除</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      {isExpanded && children && (
        <div className="animate-in slide-in-from-left-1 duration-200">
          {children}
        </div>
      )}
    </div>
  );
}
