import { Note } from "@/app/(main)/notion/components/Sidebar";
import { createBrowserClient } from "@supabase/ssr";
import {
  RealtimeChannel,
  RealtimePostgresChangesPayload,
} from "@supabase/supabase-js";
import { Database } from "../../../types/database";

export function createClient() {
  // Create a supabase client on the browser with project's credentials
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
export const subscribe = async (
  userId: string,
  callback: (payload: RealtimePostgresChangesPayload<Note>) => void
) => {
  const supabase = await createClient();
  return await supabase
    .channel("notes-changes")
    .on<Note>(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "notes",
        filter: `user_id=eq.${userId}`,
      },
      callback
    )
    .subscribe();
};
export const unsubscribe = async (channel: RealtimeChannel) => {
  const supabase = await createClient();
  await supabase.removeChannel(channel);
};
