import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

import supabase from "@/lib/server/db";
import { Encrypt } from "@/lib/server/crypto";
import { sanitizeProjectSpec } from "@/utils/ai-project-spec";

import {
  serverErrorHandler,
  unauthorizedErrorHandler,
  badRequestErrorHandler,
  supabaseErrorHandler,
} from "@/app/api/handlers";

/**
 * Saves a validated AI project spec into the user's teams table.
 * Re-validates the spec server-side (never trust the client), verifies
 * the user's own token and enforces the free plan limit.
 */
export async function POST(req: NextRequest) {
  try {
    const token = (await headers()).get("Authorization");
    if (!token) return unauthorizedErrorHandler("Authorization token not inserted");

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError) return unauthorizedErrorHandler(authError.message);
    if (!user) return unauthorizedErrorHandler("User not found");

    const body = await req.json();
    const spec = sanitizeProjectSpec(body.spec);
    if (!spec) return badRequestErrorHandler();

    const { data: profile } = await supabase
      .from("profiles")
      .select("plan, email, display_name, avatar_url")
      .eq("id", user.id)
      .maybeSingle();

    // Free plan limit — same gate as POST /api/teams
    if (profile && (profile.plan || "free").toLowerCase() === "free") {
      const { data: teams } = await supabase
        .from("teams")
        .select("team_id")
        .contains("integrants_id", [user.id]);

      if (teams && teams.length >= 2) {
        return unauthorizedErrorHandler("Projects limit reached");
      }
    }

    const username =
      profile?.display_name || user.user_metadata?.display_name || user.email || "User";
    const email = profile?.email || user.email;
    const avatar_url = profile?.avatar_url ?? null;

    const team = {
      name: spec.project.name,
      description: spec.project.description,
      status: spec.project.status,
      tags: spec.project.tags,
      integrants: [
        {
          id: user.id,
          email,
          username,
          type: "admin",
          avatar_url,
        },
      ],
      integrants_id: [user.id],
      created_at: new Date(),
      kanban_board: spec.kanban,
      tickets: spec.tickets.map((ticket) => ({
        title: ticket.title,
        message: Encrypt(ticket.message),
        importance: ticket.importance,
        creator: username,
        creator_id: user.id,
        to: username,
        created_at: new Date().toISOString(),
      })),
      calendar: spec.calendar.map((event) => ({
        title: event.title,
        description: event.description,
        date: new Date(event.date).toISOString(),
        creatorId: user.id,
        creator: { id: user.id, email, username, avatar_url },
        type: "deadline",
        color: "blue",
      })),
    };

    const { data: newTeam, error: saveError } = await supabase
      .from("teams")
      .insert([team])
      .select()
      .single();

    if (saveError) return supabaseErrorHandler(saveError);

    return NextResponse.json(
      { message: "Project created successfully", team: newTeam },
      { status: 200 }
    );
  } catch (error) {
    return serverErrorHandler(error);
  }
}
