import { currentUser } from "@/app/server/auth/data";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import NoteDetail from "../components/NoteDetail";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function NotePage({ params }: PageProps) {
  const { id } = await params;
  const noteId = Number(id);

  if (isNaN(noteId)) {
    return redirect("/notion");
  }

  // ユーザー認証
  const user = await currentUser();
  if (!user) {
    return redirect("/");
  }

  // データ取得
  const supabase = await createClient();
  const { data: note } = await supabase
    .from("notes")
    .select()
    .eq("id", noteId)
    .eq("user_id", user.id)
    .single();

  if (!note) {
    return redirect("/notion");
  }

  return <NoteDetail initialData={note} />;
}
