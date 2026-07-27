"use client";

import { useState, useEffect, useRef } from "react";

import { useRouter, useParams } from "next/navigation";

import { getUser } from "@/modules/user.module";
import { getSession, addMessage } from "@/modules/ai.session.module";

import LoadingScreen from "@/components/screens/loading-screen";
import AiLayout from "@/components/ai/layout";
import SnackBar, { showSnackbar } from "@/components/ui/snackbar";

import type { UserData } from "@/types/user.types";
import type { AiChatSession, AiChatMessage } from "@/types/ai.types";
import { IconArrowUp } from "@tabler/icons-react";

export default function AiSessionPage() {
  const router = useRouter();
  const params = useParams();
  const snackbarRef = useRef(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sessionId = params.id as string;

  const [user, setUser] = useState<UserData>();
  const [session, setSession] = useState<AiChatSession>();
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const load = async () => {
      const data = await getUser(router);
      if (!data) return;
      setUser(data);

      const result = await getSession(router, sessionId, snackbarRef);
      if (result.success && result.data) {
        setSession(result.data);
      }
    };

    load();
  }, [sessionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [session?.messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSending || !session) return;

    const content = input.trim();
    setInput("");
    setIsSending(true);

    const userMessage: AiChatMessage = {
      id: crypto.randomUUID(),
      session_id: session.id,
      sent_by: "user",
      content,
      created_at: new Date().toISOString(),
    };

    setSession((prev) =>
      prev
        ? { ...prev, messages: [...prev.messages, userMessage] }
        : prev
    );

    const result = await addMessage(
      router,
      session.id,
      "user",
      content,
      snackbarRef
    );

    if (result.success && result.data) {
      setSession(result.data);
    }

    setIsSending(false);
  };

  if (!user || !session) return <LoadingScreen />;

  return (
    <AiLayout user={user} router={router}>
      <SnackBar ref={snackbarRef} />

      <main className="w-full flex flex-col items-center justify-center max-w-350 mx-auto p-5">
        <section className="h-full w-full flex flex-col items-end overflow-y-auto max-h-[70vh] gap-3 py-4">
          {session.messages.map((msg) => (
            <div
              key={msg.id}
              className={
                "w-full flex " +
                (msg.sent_by === "user" ? "justify-end" : "justify-start")
              }>
              <div
                className={
                  "max-w-[80%] rounded-xl px-4 py-2 text-sm " +
                  (msg.sent_by === "user"
                    ? "bg-main text-white"
                    : "bg-neutral-900 border border-neutral-800")
                }>
                {msg.content}
              </div>
            </div>
          ))}

          {isSending && (
            <div className="w-full flex justify-start">
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2 text-sm text-neutral-400">
                Thinking...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </section>

        <section className="w-full p-3 px-5 rounded-xl border border-neutral-900 bg-neutral-950 flex flex-col gap-2 animate-fade-in-up">
          <form onSubmit={handleSend} className="w-full flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything"
              className="w-full outline-none"
              disabled={isSending}
            />

            <button
              type="submit"
              disabled={isSending || !input.trim()}
              className="bg-main rounded-full aspect-square block hover:brightness-75 duration-300 cursor-pointer p-2 disabled:grayscale disabled:cursor-not-allowed">
              <IconArrowUp size={20} />
            </button>
          </form>

          <div className="w-full cursor-default text-sm font-light py-1">
            {session.provider} / {session.model}
          </div>
        </section>
      </main>
    </AiLayout>
  );
}
