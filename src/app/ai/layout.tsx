import type { Metadata } from "next";

import AiSidebar from "@/components/ai/ai-sidebar";

export const metadata: Metadata = {
  title: "NexZero - Agents chat"
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex overflow-hidden bg-neutral-950">
      <AiSidebar />
      <main className="flex-1 h-full overflow-hidden">
        {children}
      </main>
    </div>
  );
}
