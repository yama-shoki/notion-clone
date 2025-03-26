"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";
import TextareaAutosize from "react-textarea-autosize";

interface TitleEditorProps {
  initialValue: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function TitleEditor({
  initialValue,
  onChange,
  disabled,
}: TitleEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 初期ロード時にフォーカスを当てる（タイトルが空の場合）
  useEffect(() => {
    if (textareaRef.current && (!initialValue || initialValue === "無題")) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [initialValue]);

  return (
    <div className="relative group">
      <TextareaAutosize
        ref={textareaRef}
        value={initialValue}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder="無題"
        className={cn(
          "w-full resize-none bg-transparent text-4xl font-bold outline-none transition-colors",
          "placeholder:text-muted-foreground/50",
          "focus:ring-0 focus:ring-offset-0",
          disabled ? "opacity-60" : "opacity-100"
        )}
        maxRows={3}
      />
      <div className="h-[1px] w-full bg-border group-focus-within:bg-primary/50 transition-colors" />
    </div>
  );
}
