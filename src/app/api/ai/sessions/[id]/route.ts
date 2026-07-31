import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

import * as Handler from "@/app/api/handlers";
import supabase from "@/lib/server/db";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
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

    const sessions = profile?.ai_sessions ?? [];
    const session = sessions.find((s: { id: string }) => s.id === id);

    if (!session) return Handler.notFoundErrorHandler("Session not found");

    return NextResponse.json({
      message: "Session found",
      session,
    });
  } catch (e) {
    return Handler.serverErrorHandler(e);
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
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

    const sessions = profile?.ai_sessions ?? [];
    const filtered = sessions.filter((s: { id: string }) => s.id !== id);

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ ai_sessions: filtered })
      .eq("id", user.id);

    if (updateError) return Handler.supabaseErrorHandler(updateError);

    return NextResponse.json({
      message: "Session deleted",
    });
  } catch (e) {
    return Handler.serverErrorHandler(e);
  }
}
