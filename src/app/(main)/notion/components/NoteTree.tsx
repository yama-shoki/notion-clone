"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { NoteItem } from "./NoteItem";
import { Note } from "./Sidebar";

interface NoteTreeProps {
  initialNotes: Note[];
}

export function NoteTree({ initialNotes }: NoteTreeProps) {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());
  const [childrenMap, setChildrenMap] = useState<Map<number, Note[]>>(
    new Map()
  );
  const [isCreating, setIsCreating] = useState(false);

  const fetchChildren = useCallback(async (parentId: number) => {
    try {
      const response = await fetch(`/api/notes/${parentId}/children`);
      const { data } = await response.json();
      setChildrenMap((prev) => new Map(prev).set(parentId, data));
    } catch (error) {
      console.error("子ノートの取得に失敗しました:", error);
      toast.error("子ノートの取得に失敗しました", { position: "top-right" });
    }
  }, []);

  const handleToggle = async (id: number) => {
    if (isCreating) return;

    if (expandedIds.has(id)) {
      setExpandedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    } else {
      setExpandedIds((prev) => new Set(prev).add(id));
      if (!childrenMap.has(id)) {
        await fetchChildren(id);
      }
    }
  };

  const handleAddChild = async (parentId: number | null) => {
    if (isCreating) return;
    setIsCreating(true);

    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "新しいノート",
          parent_document: parentId,
        }),
      });
      const { data: newNote } = await response.json();

      if (parentId === null) {
        setNotes((prev) => [newNote, ...prev]);
        toast.success("新しいノートを作成しました", { position: "top-right" });
      } else {
        setChildrenMap((prev) => {
          const parentChildren = prev.get(parentId) || [];
          return new Map(prev).set(parentId, [newNote, ...parentChildren]);
        });
        if (!expandedIds.has(parentId)) {
          setExpandedIds((prev) => new Set(prev).add(parentId));
        }
        toast.success("新しい子ノートを作成しました", {
          position: "top-right",
        });
      }
    } catch (error) {
      console.error("ノートの作成に失敗しました:", error);
      toast.error("ノートの作成に失敗しました", { position: "top-right" });
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setNotes((prev) => prev.filter((note) => note.id !== id));
        setChildrenMap((prev) => {
          prev.forEach((children, parentId) => {
            prev.set(
              parentId,
              children.filter((child) => child.id !== id)
            );
          });
          return new Map(prev);
        });
        toast.success("ノートを削除しました", { position: "top-right" });
      } else {
        const { error } = await response.json();
        toast.error(error, { position: "top-right" });
      }
    } catch (error) {
      console.error("ノートの削除に失敗しました:", error);
      toast.error("ノートの削除に失敗しました", { position: "top-right" });
    }
  };

  const renderNoteTree = (noteList: Note[], level = 0) => {
    return noteList.map((note) => {
      const children = childrenMap.get(note.id);
      const hasChildren = children && children.length > 0;
      const isExpanded = expandedIds.has(note.id);

      return (
        <NoteItem
          key={note.id}
          id={note.id}
          title={note.title || "無題"}
          level={level}
          isExpanded={isExpanded}
          onToggle={handleToggle}
          onAddChild={handleAddChild}
          onDelete={handleDelete}
        >
          {hasChildren && isExpanded && renderNoteTree(children, level + 1)}
        </NoteItem>
      );
    });
  };

  return (
    <div className="space-y-2 p-2">
      <div className="flex items-center justify-between px-2 py-1">
        <h2 className="text-sm font-medium text-foreground">ノート一覧</h2>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-md hover:bg-accent"
          onClick={() => handleAddChild(null)}
          disabled={isCreating}
        >
          <Plus className="h-4 w-4" />
          <span className="sr-only">新規ノート作成</span>
        </Button>
      </div>
      <div className="px-1 space-y-0.5">
        {notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 px-2 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              ノートがありません
            </p>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => handleAddChild(null)}
              disabled={isCreating}
            >
              <Plus className="h-4 w-4 mr-2" />
              新規ノート作成
            </Button>
          </div>
        ) : (
          renderNoteTree(notes)
        )}
      </div>
    </div>
  );
}
