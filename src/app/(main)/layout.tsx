import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { createClient } from "@/lib/supabase/server";
import { ThemeProvider } from "next-themes";
import { redirect } from "next/navigation";
import { Toaster } from "sonner";

import { currentUser } from "../server/auth/data";
import { NotionSidebar } from "./notion/components/NotionSidebar";

export default async function NotionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();
  if (!user) {
    return redirect("/");
  }

  const supabase = await createClient();
  const { data: notes } = await supabase
    .from("notes")
    .select("*")
    .is("parent_document", null)
    .order("created_at", { ascending: false });

  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <SidebarProvider>
        <div className="flex h-screen w-full">
          <NotionSidebar initialNotes={notes || []} />
          <SidebarInset>
            <div className="flex h-full flex-col">
              <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
                <SidebarTrigger className="md:hidden" />
                <div className="flex-1" />
              </header>
              <main className="flex-1 overflow-auto">{children}</main>
            </div>
            <Toaster position="top-right" />
          </SidebarInset>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
}
