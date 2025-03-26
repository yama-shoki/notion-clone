import { createClient } from "@/lib/supabase/server";
import { cache } from "react";

// ログイン中のユーザーを取得する関数
export const currentUser = cache(async () => {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();
  return user.data.user;
});
