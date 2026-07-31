import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

import * as Handler from "@/app/api/handlers";
import supabase from "@/lib/server/db";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const token = (await headers()).get("Authorization");

    if (!token) return Handler.unauthorizedErrorHandler("Authorization token not inserted");

    const { data: { user }, error: getUserError } = await supabase.auth.getUser(token);

    if (!user) return Handler.notFoundErrorHandler("User not found");
    if (getUserError) return Handler.unauthorizedErrorHandler(getUserError.message);

    const body = await req.json();
    const { sent_by, content } = body;

    if (!sent_by || !content) return Handler.badRequestErrorHandler();

    const { data: profile } = await supabase
      .from("profiles")
      .select("ai_sessions")
      .eq("id", user.id)
      .maybeSingle();

    const sessions = profile?.ai_sessions ?? [];
    const sessionIndex = sessions.findIndex((s: { id: string }) => s.id === id);

    if (sessionIndex === -1) return Handler.notFoundErrorHandler("Session not found");

    const newMessage = {
      id: crypto.randomUUID(),
      session_id: id,
      sent_by,
      content,
      created_at: new Date().toISOString(),
    };

    sessions[sessionIndex].messages.push(newMessage);
    sessions[sessionIndex].updated_at = new Date().toISOString();

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ ai_sessions: sessions })
      .eq("id", user.id);

    if (updateError) return Handler.supabaseErrorHandler(updateError);

    return NextResponse.json({
      message: "Message added",
      session: sessions[sessionIndex],
    });
  } catch (e) {
    return Handler.serverErrorHandler(e);
  }
}
