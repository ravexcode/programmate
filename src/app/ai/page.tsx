"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

import LoadingScreen from "@/components/screens/loading-screen";
import SnackBar from "@/components/ui/snackbar";
import MainButton from "@/components/ui/buttons/main";

import { useGetData } from "@/client/ai";
import { createSession, getSession, addMessage } from "@/modules/ai.session.module";

import type { UserData } from "@/types/user.types";
import type { AiChatSession, AiChatMessage } from "@/types/ai.types";

function AiContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const snackbarRef = useRef(null);

  const [user, setUser] = useState<UserData>();
  const [currentSession, setCurrentSession] = useState<AiChatSession | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [sending, setSending] = useState(false);

  const sessionId = searchParams.get("session");

  useGetData(setUser, router);

  useEffect(() => {
    if (sessionId && user) {
      loadSession(sessionId);
    }
  }, [sessionId, user]);

  async function loadSession(id: string) {
    const res = await getSession(router, id, snackbarRef);
    if (res.success && res.data) {
      setCurrentSession(res.data);
    }
  }

  async function handleNewChat() {
    const provider = user?.ai?.[0]?.name ?? "OpenRouter";
    const model = user?.ai?.[0]?.models?.[0] ?? "default";

    const res = await createSession(
      router,
      "New Chat",
      provider,
      model,
      snackbarRef
    );

    if (res.success && res.data) {
      setCurrentSession(res.data);
      router.push(`/ai?session=${res.data.id}`);
    }
  }

  async function handleSend(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!inputValue.trim() || !currentSession || sending) return;

    const message = inputValue.trim();
    setInputValue("");
    setSending(true);

    const userMsg: AiChatMessage = {
      id: crypto.randomUUID(),
      session_id: currentSession.id,
      sent_by: "user",
      content: message,
      created_at: new Date().toISOString(),
    };

    setCurrentSession(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        messages: [...prev.messages, userMsg],
      };
    });

    const res = await addMessage(
      router,
      currentSession.id,
      "user",
      message,
      snackbarRef
    );

    if (res.success && res.data) {
      setCurrentSession(res.data);
    }

    setSending(false);
  }

  if (!user) return <LoadingScreen />;

  return (
    <div className="h-full flex flex-col bg-neutral-950">
      <SnackBar ref={snackbarRef} />

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
        <h1 className="text-lg font-semibold">
          {currentSession ? currentSession.title : "NexZero AI"}
        </h1>
        <MainButton
          size="w-auto px-4"
          action={handleNewChat}
        >
          + New Chat
        </MainButton>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4 max-w-400 w-full mx-auto">
        {!currentSession ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-neutral-500">
              <p className="text-lg mb-2">Start a new conversation</p>
              <p className="text-sm">Select a provider and model to begin</p>
            </div>
          </div>
        ) : currentSession.messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-neutral-500">
              <p className="text-lg mb-2">Ask anything</p>
              <p className="text-sm">Powered by {currentSession.provider}</p>
            </div>
          </div>
        ) : (
          currentSession.messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sent_by === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[70%] rounded-sm px-4 py-2 ${
                  msg.sent_by === "user"
                    ? "bg-main text-white"
                    : "bg-neutral-900 border border-neutral-800"
                }`}>
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input */}
      {currentSession && (
        <form
          onSubmit={handleSend}
          className="p-4 border border-neutral-800 rounded-xl max-w-400 w-full mb-5 mx-auto">
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                disabled={sending}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-sm px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-main transition-colors duration-300 disabled:opacity-50"
              />
            </div>
            <MainButton
              size="w-auto px-6 py-3"
              type="submit"
              isDisabled={!inputValue.trim() || sending}
              isLoading={sending}>
              Send
            </MainButton>
          </div>

          <div
          className="w-full flex justify-start gap-3 items-center p-2">
            
          </div>
        </form>
      )}
    </div>
  );
}

export default function AiPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <AiContent />
    </Suspense>
  );
}
