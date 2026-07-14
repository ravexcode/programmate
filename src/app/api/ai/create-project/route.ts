import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/db";
import * as Handler from "@api/handlers";

import { headers } from "next/headers";

type PostBody = {
  ai_provider: string;
  project: {
    title: string;
    description: string;
    status: string;
    tags: string [];
    integrants_id: string [];
    erd: any [];
    kanban: any [];
  }
}

export async function POST(
  req: NextRequest
){
  try {
    const {
      ai_provider,
      project
    }: PostBody = await req.json();
    const token = (await headers()).get("Authorization");

    if(!ai_provider || !project) return Handler.badRequestErrorHandler();
    if(!token) return Handler.unauthorizedErrorHandler("Authorization token not inserted");

    const { data: { user }, error: getUserError } = await supabase.auth.getUserService({router});

    if(!user) return Handler.notFoundErrorHandler("User not found");
    if(getUserError) return Handler.unauthorizedErrorHandler("Invalid access token");

    const { data: profile, error: getProfileError } = await supabase
    .from("profiles")
    .select("plan, id")
    .eq("id", user.id)
    .maybeSingle();

    if(!profile) return Handler.notFoundErrorHandler("Profile not found");
    if(getProfileError) return Handler.supabaseErrorHandler(getProfileError);

    if(profile.plan === "free") {
      const { data: teams } = await supabase
      .from("teams")
      .select("team_id")
      .contains("users_id", [user.id]);

      if(teams && teams.length >= 2) return Handler.unauthorizedErrorHandler("Projects limit reached");
    }

    const { data: team, error: saveTeamError } = await supabase
    .from("teams")
    .insert([project])
    .select();

    if(saveTeamError) return Handler.supabaseErrorHandler(saveTeamError);

    return NextResponse.json({
      message: "Project created successfully",
      team
    });
  } catch(e) { return Handler.serverErrorHandler(e) }
}