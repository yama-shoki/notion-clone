"use client";

import { ModeToggle } from "@/components/ModeToggle";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Database } from "../../../../../types/database";
import { NoteTree } from "./NoteTree";
import { UserProfile } from "./UserProfile";

export type Note = Database["public"]["Tables"]["notes"]["Row"];

interface NotionSidebarProps {
  initialNotes: Note[];
}

export function NotionSidebar({ initialNotes }: NotionSidebarProps) {
  return (
    <Sidebar variant="inset" className="border-r border-border">
      <SidebarHeader className="border-b border-border">
        <UserProfile />
      </SidebarHeader>
      <SidebarContent>
        <NoteTree initialNotes={initialNotes} />
      </SidebarContent>
      <SidebarFooter className="border-t border-border p-4">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Notion Clone</span>
          <ModeToggle />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
