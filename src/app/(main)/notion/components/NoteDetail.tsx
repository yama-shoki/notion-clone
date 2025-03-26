"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";
import { ArrowLeft, Clock, FileText, MoreHorizontal, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";

import { ContentEditor } from "./ContentEditor";
import { Note } from "./Sidebar";
import { TitleEditor } from "./TitleEditor";

interface NoteDetailProps {
  initialData: Note;
}

export default function NoteDetail({ initialData }: NoteDetailProps) {
  const router = useRouter();
  const [note, setNote] = useState<Note>(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // 保存処理（デバウンス付き）
  const debouncedSave = useDebouncedCallback(
    async (data: { title?: string; content?: string }) => {
      try {
        setIsSaving(true);
        const response = await fetch(`/api/notes/${note.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error("更新に失敗しました");
        }

        setLastSaved(new Date());
      } catch (error) {
        console.error("ノートの更新に失敗しました:", error);
      } finally {
        setIsSaving(false);
      }
    },
    1000 // 1秒のデバウンス
  );

  // タイトル変更時の処理
  const handleTitleChange = (title: string) => {
    setNote((prev) => ({ ...prev, title }));
    debouncedSave({ title: title ?? undefined });
  };

  // コンテンツ変更時の処理
  const handleContentChange = (content: string) => {
    setNote((prev) => ({ ...prev, content }));
    debouncedSave({ content: content ?? undefined });
  };

  // 手動保存
  const handleSave = () => {
    debouncedSave.flush(); // デバウンスを無視して即時実行
  };

  const handleBack = () => {
    router.push("/notion");
  };

  return (
    <div className="flex flex-col h-full">
      {/* ヘッダー */}
      <div className="flex items-center justify-between px-4 py-2 border-b">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="md:hidden"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <Badge variant="outline" className="text-xs">
              {note.parent_document ? "子ノート" : "ルートノート"}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {lastSaved && (
            <div className="hidden md:flex items-center text-xs text-muted-foreground">
              <Clock className="h-3 w-3 mr-1" />
              <span>
                {formatDistanceToNow(new Date(lastSaved), {
                  addSuffix: true,
                  locale: ja,
                })}
                に保存
              </span>
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={handleSave}
            disabled={isSaving}
            className="gap-1"
          >
            <Save className="h-3.5 w-3.5" />
            <span className="hidden md:inline">保存</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleSave}>保存</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleBack}>
                ノート一覧に戻る
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* コンテンツエリア */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <TitleEditor
            initialValue={note.title ?? "無題"}
            onChange={handleTitleChange}
            disabled={isSaving}
          />

          <div className="mt-8">
            <ContentEditor
              initialContent={note.content}
              onChange={handleContentChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
