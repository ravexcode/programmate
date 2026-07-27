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

const API_KEY = process.env.NEXT_PUBLIC_API_KEY!;

export async function createSessionController(data: CreateSessionData): Promise<{
  status: number;
  message: string;
  session?: AiChatSession;
}> {
  const req = await fetch(`/api/ai/sessions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "nexzero-api-key": API_KEY,
      "Authorization": data.token,
    },
    body: JSON.stringify({
      title: data.title,
      provider: data.provider,
      model: data.model,
    }),
  });

  const response = await req.json().catch((e) => {
    if (e instanceof Error) {
      console.error("Error creating session:", e.cause);
      return { message: e.message, status: req.status };
    }
    return { message: "Server error", status: 500 };
  });

  return {
    message: response.message,
    session: response.session,
    status: req.status,
  };
}

export async function listSessionsController(token: string): Promise<{
  status: number;
  message: string;
  sessions?: AiChatSession[];
}> {
  const req = await fetch(`/api/ai/sessions`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "nexzero-api-key": API_KEY,
      "Authorization": token,
    },
  });

  const response = await req.json().catch((e) => {
    if (e instanceof Error) {
      console.error("Error listing sessions:", e.cause);
      return { message: e.message, status: req.status };
    }
    return { message: "Server error", status: 500 };
  });

  return {
    message: response.message,
    sessions: response.sessions,
    status: req.status,
  };
}

export async function getSessionController(data: GetSessionData): Promise<{
  status: number;
  message: string;
  session?: AiChatSession;
}> {
  const req = await fetch(`/api/ai/sessions/${data.sessionId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "nexzero-api-key": API_KEY,
      "Authorization": data.token,
    },
  });

  const response = await req.json().catch((e) => {
    if (e instanceof Error) {
      console.error("Error getting session:", e.cause);
      return { message: e.message, status: req.status };
    }
    return { message: "Server error", status: 500 };
  });

  return {
    message: response.message,
    session: response.session,
    status: req.status,
  };
}

export async function deleteSessionController(data: DeleteSessionData): Promise<{
  status: number;
  message: string;
}> {
  const req = await fetch(`/api/ai/sessions/${data.sessionId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "nexzero-api-key": API_KEY,
      "Authorization": data.token,
    },
  });

  const response = await req.json().catch((e) => {
    if (e instanceof Error) {
      console.error("Error deleting session:", e.cause);
      return { message: e.message, status: req.status };
    }
    return { message: "Server error", status: 500 };
  });

  return {
    message: response.message,
    status: req.status,
  };
}

export async function addMessageController(data: AddMessageData): Promise<{
  status: number;
  message: string;
  session?: AiChatSession;
}> {
  const req = await fetch(`/api/ai/sessions/${data.sessionId}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "nexzero-api-key": API_KEY,
      "Authorization": data.token,
    },
    body: JSON.stringify({
      sent_by: data.sent_by,
      content: data.content,
    }),
  });

  const response = await req.json().catch((e) => {
    if (e instanceof Error) {
      console.error("Error adding message:", e.cause);
      return { message: e.message, status: req.status };
    }
    return { message: "Server error", status: 500 };
  });

  return {
    message: response.message,
    session: response.session,
    status: req.status,
  };
}
