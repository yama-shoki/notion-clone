"use client";

import { Database } from "../../../../../types/database";
import { NoteTree } from "./NoteTree";
import { UserProfile } from "./UserProfile";

export type Note = Database["public"]["Tables"]["notes"]["Row"];

interface SidebarProps {
  initialNotes: Note[];
}

export function Sidebar({ initialNotes }: SidebarProps) {
  return (
    <aside className="group/sidebar h-full bg-neutral-100 overflow-y-auto flex flex-col w-60 border-r border-neutral-200">
      <UserProfile />
      <div className="mt-4 flex-1">
        <NoteTree initialNotes={initialNotes} />
      </div>
    </aside>
  );
}
