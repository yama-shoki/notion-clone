"use client";

import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import { useEffect, useState } from "react";

interface EditorProps {
  onChange: (value: string) => void;
  initialContent?: string | null;
}

export const ContentEditor = ({ onChange, initialContent }: EditorProps) => {
  const [isMounted, setIsMounted] = useState(false);

  const editor = useCreateBlockNote({
    initialContent: initialContent ? JSON.parse(initialContent) : undefined,
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className="min-h-[500px] border rounded-md animate-pulse" />;
  }

  return (
    <div>
      <BlockNoteView
        editor={editor}
        onChange={() => onChange(JSON.stringify(editor.document))}
        theme={"light"}
      />
    </div>
  );
};
