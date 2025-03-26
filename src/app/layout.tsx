import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap", // フォントローディング時のちらつきを防ぐ
});

export const metadata: Metadata = {
  title: "Notion-Clone",
  description: "Notion-Clone",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={cn(inter.className, "min-h-dvh")}>
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
