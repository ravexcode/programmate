export interface AiChatMessage {
  id: string;
  session_id: string;
  sent_by: "user" | "assistant";
  content: string;
  created_at: string;
}

export interface AiChatSession {
  id: string;
  title: string;
  user_id: string;
  provider: string;
  model: string;
  messages: AiChatMessage[];
  created_at: string;
  updated_at: string;
}
