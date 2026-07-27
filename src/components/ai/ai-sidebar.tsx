"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  IconLayoutSidebar,
  IconPlus,
  IconSettings,
  IconSparkles,
  IconMessage,
  IconTrash
} from "@tabler/icons-react";

import { listSessions, deleteSession } from "@/modules/ai.session.module";

import type { AiChatSession } from "@/types/ai.types";

interface AiSidebarProps {
  currentSessionId?: string;
  onSessionSelect?: (session: AiChatSession) => void;
  snackbarRef?: React.RefObject<null>;
}

export default function AiSidebar({ currentSessionId, onSessionSelect, snackbarRef }: AiSidebarProps) {
  const router = useRouter();

  const [expanded, setExpanded] = useState(() => {
    if (typeof window === "undefined") return true;
    return !window.localStorage.getItem("ai_sidebar_collapsed");
  });

  const [sessions, setSessions] = useState<AiChatSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSessions();
  }, []);

  async function loadSessions() {
    setLoading(true);
    const res = await listSessions(router, snackbarRef);
    if (res.success && res.data) {
      setSessions(res.data);
    }
    setLoading(false);
  }

  async function handleDeleteSession(e: React.MouseEvent, sessionId: string) {
    e.stopPropagation();
    e.preventDefault();

    const res = await deleteSession(router, sessionId, snackbarRef);
    if (res.success) {
      setSessions(prev => prev.filter(s => s.id !== sessionId));
      if (currentSessionId === sessionId) {
        router.push("/ai");
      }
    }
  }

  function toggleSidebar() {
    const next = !expanded;
    setExpanded(next);
    if (!next) {
      window.localStorage.setItem("ai_sidebar_collapsed", "collapsed");
    } else {
      window.localStorage.removeItem("ai_sidebar_collapsed");
    }
  }

  const sortedSessions = [...sessions].sort(
    (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  );

  return (
    <aside
      className={`text-xs md:text-sm h-full items-center justify-start bg-neutral-950 text-text transition-all duration-400 flex flex-col animate-fade-in overflow-x-auto overflow-y-auto overflow-hidden border-r border-neutral-800
        ${expanded ? "w-64" : "w-16"}
      `}>

      {/* Header */}
      <div className="flex flex-col justify-center items-center sm:mt-1 sm:mb-3 w-full">
        <Link
          href="/ai"
          className="duration-300 hover:scale-105 hover:brightness-120 p-3 flex items-center justify-center w-full">
          <IconSparkles
            size={20}
            stroke={1.5}
            color="white" />
          {expanded && (
            <span className="text-sm font-semibold ml-2 animate-fade-in-right">
              NexZero AI
            </span>
          )}
        </Link>
      </div>

      {/* Toggler */}
      <div className="px-3 hidden sm:flex w-full">
        <button
          type="button"
          onClick={toggleSidebar}
          className="flex justify-start items-center gap-2 p-2 rounded-lg hover:bg-blue-900 cursor-pointer transition focus:outline-none opacity-90 duration-800 w-full">
          <IconLayoutSidebar
            size={20}
            stroke={2}
            color="white" />
          {expanded && (
            <span className="text-sm animate-fade-in-right">Close</span>
          )}
        </button>
      </div>

      {/* New Chat */}
      <div className="px-3 w-full mt-2">
        <Link
          href="/ai"
          className="flex justify-start items-center gap-2 p-2 rounded-lg hover:bg-blue-900 cursor-pointer transition focus:outline-none opacity-90 duration-400 w-full">
          <IconPlus
            size={20}
            stroke={2}
            color="white" />
          {expanded && (
            <span className="text-sm animate-fade-in-right">New Chat</span>
          )}
        </Link>
      </div>

      {/* Providers Settings */}
      <div className="px-3 w-full">
        <Link
          href="/ai?view=providers"
          className="flex justify-start items-center gap-2 p-2 rounded-lg hover:bg-blue-900 cursor-pointer transition focus:outline-none opacity-90 duration-400 w-full">
          <IconSettings
            size={20}
            stroke={2}
            color="white" />
          {expanded && (
            <span className="text-sm animate-fade-in-right">Providers</span>
          )}
        </Link>
      </div>

      {/* Divider */}
      {expanded && (
        <div className="w-full px-3 my-2">
          <div className="w-full border-t border-neutral-800" />
        </div>
      )}

      {/* Chat History */}
      <nav className="flex flex-col gap-1 px-3 w-full h-full duration-400 items-center justify-start overflow-y-auto">
        {expanded && (
          <span className="w-full text-base font-bold p-2 animate-fade-in-right">
            History
          </span>
        )}

        {loading ? (
          expanded && (
            <span className="w-full text-neutral-500 p-2 text-sm animate-fade-in-right">
              Loading...
            </span>
          )
        ) : sortedSessions.length === 0 ? (
          expanded && (
            <span className="w-full text-neutral-500 p-2 text-sm animate-fade-in-right">
              No chats yet
            </span>
          )
        ) : (
          sortedSessions.map((session) => (
            <Link
              key={session.id}
              href={`/ai?session=${session.id}`}
              onClick={(e) => {
                if (onSessionSelect) {
                  e.preventDefault();
                  onSessionSelect(session);
                }
              }}
              className={`flex justify-start items-center gap-2 p-2 rounded-lg cursor-pointer transition focus:outline-none duration-400 w-full group
                ${currentSessionId === session.id ? "bg-blue-900" : "hover:bg-blue-900"}
              `}>
              <IconMessage
                size={20}
                stroke={2}
                color="white" />
              {expanded && (
                <div className="flex items-center justify-between w-full animate-fade-in-right overflow-hidden">
                  <span className="text-sm truncate">
                    {session.title}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => handleDeleteSession(e, session.id)}
                    className="opacity-0 group-hover:opacity-100 duration-300 hover:text-red-400 p-1">
                    <IconTrash
                      size={14}
                      stroke={2} />
                  </button>
                </div>
              )}
            </Link>
          ))
        )}
      </nav>
    </aside>
  );
}
