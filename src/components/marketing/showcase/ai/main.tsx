"use client";

//React imports
import { useEffect, useRef, useState } from "react";

//Hooks imports
import { IconSend, IconRobot } from "@tabler/icons-react";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
}

const seedMessages: Message[] = [
  { id: 1, role: "assistant", content: "Hello! What are we building today?" },
];

const cannedReplies = [
  "Got it. I can help you plan that project, break it into issues and generate the database schema.",
  "Good call. Want me to create the tasks and put them on the kanban board?",
  "I can also draft the ERD tables for that feature or write the markdown ticket.",
];

export default function AiShowcase() {
  const [ messages, setMessages ] = useState<Message[]>(seedMessages);
  const [ draft, setDraft ] = useState("");
  const [ thinking, setThinking ] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  const send = () => {
    if(!draft.trim() || thinking) return;

    const userMessage: Message = {
      id: messages.length + 1,
      role: "user",
      content: draft.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setDraft("");
    setThinking(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          role: "assistant",
          content: cannedReplies[prev.length % cannedReplies.length],
        },
      ]);
      setThinking(false);
    }, 900);
  };

  return (
    <div
    className="w-full aspect-video rounded-md border border-neutral-800 bg-neutral-950 flex flex-col overflow-hidden">
      <div
      className="flex justify-between items-center px-5 py-3 border-b border-neutral-800">
        <p
        className="flex items-center gap-2 text-sm font-medium tracking-wide">
          <IconRobot
          size={16}
          stroke={2}
          className="text-main" />
          NexZero AI
        </p>

        <span
        className="rounded-full border border-main/40 bg-main/20 px-2.5 py-0.5 text-[10px] font-medium text-main">
          claude / latest
        </span>
      </div>

      <div
      className="flex-1 flex flex-col gap-3 overflow-y-auto scrollbar-hide px-5 py-4">
        {
          messages.map((message) => (
            <div
            key={message.id}
            className={"w-max max-w-80% flex flex-col gap-1 " + (message.role === "user" ? "items-end self-end" : "items-start self-start")}>
              <p
              className={"text-[10px] text-text/40 " + (message.role === "user" ? "text-right" : "")}>
                {message.role === "user" ? "you" : "assistant"}
              </p>
              <div
              className={"rounded-md px-3 py-2 text-sm " + (message.role === "user" ? "bg-main text-white" : "bg-neutral-800 text-text/90")}>
                {message.content}
              </div>
            </div>
          ))
        }

        {
          thinking && (
            <div
            className="w-max max-w-80% self-start flex items-center gap-2 rounded-md bg-neutral-800 px-3 py-2 text-sm text-text/50">
              <span
              className="h-1.5 w-1.5 rounded-full bg-main animate-pulse" />
              Thinking...
            </div>
          )
        }

        <div ref={bottomRef} />
      </div>

      <div
      className="px-5 py-3 border-t border-neutral-800 flex gap-2">
        <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && send()}
        placeholder="Ask about your project..."
        className="w-full rounded-sm bg-neutral-900 border border-neutral-800 px-3 py-2 text-sm outline-none focus:border-main" />
        <button
        type="button"
        onClick={send}
        className="rounded-sm bg-main px-4 duration-300 hover:brightness-80 disabled:opacity-50"
        disabled={thinking}>
          <IconSend
          size={16}
          stroke={2} />
        </button>
      </div>
    </div>
  )
}
