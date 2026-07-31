import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

import * as Handler from "@/app/api/handlers";
import supabase from "@/lib/server/db";

export async function GET() {
  try {
    const token = (await headers()).get("Authorization");

    if (!token) return Handler.unauthorizedErrorHandler("Authorization token not inserted");

    const { data: { user }, error: getUserError } = await supabase.auth.getUser(token);

    if (!user) return Handler.notFoundErrorHandler("User not found");
    if (getUserError) return Handler.unauthorizedErrorHandler(getUserError.message);

    const { data: profile } = await supabase
      .from("profiles")
      .select("ai_sessions")
      .eq("id", user.id)
      .maybeSingle();

    return NextResponse.json({
      message: "Sessions listed",
      sessions: profile?.ai_sessions ?? [],
    });
  } catch (e) {
    return Handler.serverErrorHandler(e);
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = (await headers()).get("Authorization");

    if (!token) return Handler.unauthorizedErrorHandler("Authorization token not inserted");

    const { data: { user }, error: getUserError } = await supabase.auth.getUser(token);

    if (!user) return Handler.notFoundErrorHandler("User not found");
    if (getUserError) return Handler.unauthorizedErrorHandler(getUserError.message);

    const body = await req.json();
    const { title, provider, model } = body;

    if (!title || !provider || !model) return Handler.badRequestErrorHandler();

    const { data: profile } = await supabase
      .from("profiles")
      .select("ai_sessions")
      .eq("id", user.id)
      .maybeSingle();

    const existingSessions = profile?.ai_sessions ?? [];

    const newSession = {
      id: crypto.randomUUID(),
      title,
      user_id: user.id,
      provider,
      model,
      messages: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const updatedSessions = [...existingSessions, newSession];

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ ai_sessions: updatedSessions })
      .eq("id", user.id);

    if (updateError) return Handler.supabaseErrorHandler(updateError);

    return NextResponse.json({
      message: "Session created",
      session: newSession,
    });
  } catch (e) {
    return Handler.serverErrorHandler(e);
  }
}
