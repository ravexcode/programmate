"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

import { getSession } from "@/modules/ai.session.module";
import AiPage from "../page";

import type { AiChatSession } from "@/types/ai.types";

export default function AiSessionPage() {
  const router = useRouter();
  const params = useParams();
  const sessionId = params.id as string;

  const [session, setSession] = useState<AiChatSession>();

  useEffect(() => {
    if (!sessionId) return;

    const load = async () => {
      const result = await getSession(router, sessionId);
      if (result.success && result.data) {
        setSession(result.data);
      }
    };

    load();
  }, [sessionId]);

  if (!session) return null;

  return <AiPage initialSession={session} />;
}
