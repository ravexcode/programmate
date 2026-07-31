import {
  createSessionRequest,
  listSessionsRequest,
  getSessionRequest,
  deleteSessionRequest,
  addMessageRequest,
} from "@/client/ai-session";

import type { AiChatSession } from "@/types/ai.types";

type CreateSessionData = {
  token: string;
  title: string;
  provider: string;
  model: string;
};

type GetSessionData = {
  token: string;
  sessionId: string;
};

type DeleteSessionData = {
  token: string;
  sessionId: string;
};

type AddMessageData = {
  token: string;
  sessionId: string;
  sent_by: "user" | "assistant";
  content: string;
};

export async function createSessionController(data: CreateSessionData): Promise<{
  status: number;
  message: string;
  session?: AiChatSession;
}> {
  const req = await createSessionRequest(data.token, {
    title: data.title,
    provider: data.provider,
    model: data.model,
  });

  return {
    message: req.data.message,
    session: req.data.session,
    status: req.status,
  };
}

export async function listSessionsController(token: string): Promise<{
  status: number;
  message: string;
  sessions?: AiChatSession[];
}> {
  const req = await listSessionsRequest(token);

  return {
    message: req.data.message,
    sessions: req.data.sessions,
    status: req.status,
  };
}

export async function getSessionController(data: GetSessionData): Promise<{
  status: number;
  message: string;
  session?: AiChatSession;
}> {
  const req = await getSessionRequest(data.token, data.sessionId);

  return {
    message: req.data.message,
    session: req.data.session,
    status: req.status,
  };
}

export async function deleteSessionController(data: DeleteSessionData): Promise<{
  status: number;
  message: string;
}> {
  const req = await deleteSessionRequest(data.token, data.sessionId);

  return {
    message: req.data.message,
    status: req.status,
  };
}

export async function addMessageController(data: AddMessageData): Promise<{
  status: number;
  message: string;
  session?: AiChatSession;
}> {
  const req = await addMessageRequest(data.token, data.sessionId, {
    sent_by: data.sent_by,
    content: data.content,
  });

  return {
    message: req.data.message,
    session: req.data.session,
    status: req.status,
  };
}
