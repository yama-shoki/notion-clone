"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { Plus } from "lucide-react";

import { useState } from "react";
import { toast } from "sonner";

export const CreateNoteForm = () => {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const createNote = async () => {
    setLoading(true);
    try {
      const supabase = await createClient();
      const user = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from("notes")
        .insert([
          {
            user_id: user.data.user?.id, // ユーザーIDを使用
            title: title,
            parent_document: null, // 必要に応じて調整
          },
        ])
        .select()
        .single();

      if (error) throw new Error(error.message);
      toast.success(`${data.title}ノートを作成しました`, {
        position: "top-right",
      });

      setTitle(""); // 入力フィールドをクリア
    } catch (error) {
      console.error("ノート作成エラー:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-0 shadow-none w-1/2 m-auto">
      <CardHeader className="px-4 pb-3">
        <CardTitle className="text-lg font-medium">
          新しいノートを作成する
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4">
        <div className="flex gap-2">
          <input
            className="h-9 flex-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm"
            placeholder="ノートのタイトルを入力"
            type="text"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
          />
          <Button
            onClick={createNote}
            disabled={loading || !title} // 処理中とタイトルが存在しない場合は無効化
            className="flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="h-4 w-4" />
            <span className="ml-1">ノート作成</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
