//Next imports
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

//Handlers imports
import {
  serverErrorHandler,
  badRequestErrorHandler,
  notFoundErrorHandler,
  supabaseErrorHandler,
} from "@api/handlers";

//Lib imports
import supabase from "@/lib/db";

//Types imports
import { CalendarDate } from "@/types/team.types";
import { ParamsType } from "@api/teams/[teamId]/params.type";

async function authenticateUser(token: string | null) {
  if (!token) return { user: null, error: "Authorization token not inserted" };

  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error) return { user: null, error: error.message };
  if (!user) return { user: null, error: "User not found" };

  return { user, error: null };
}

async function getTeamAndVerifyUser(teamId: string, token: string | null) {
  const auth = await authenticateUser(token);

  if (auth.error) {
    return { team: null, user: null, error: auth.error };
  }

  const { data: team, error: getTeamError } = await supabase
    .from("teams")
    .select("*")
    .eq("team_id", teamId)
    .maybeSingle();

  if (getTeamError) return { team: null, user: auth.user, error: getTeamError.message };
  if (!team) return { team: null, user: auth.user, error: "Team not found" };
  if (!team.integrants_id.includes(auth.user!.id)) {
    return { team: null, user: auth.user, error: "You're not in the team" };
  }

  return { team, user: auth.user, error: null };
}

export async function POST({ params }: ParamsType, req: NextRequest) {
  try {
    const { teamId } = await params;
    const { event } = await req.json();
    const token = (await headers()).get("Authorization");

    if (!teamId || !event) return badRequestErrorHandler();

    const { team, error } = await getTeamAndVerifyUser(teamId, token);

    if (error) return notFoundErrorHandler(error);
    if (!team) return notFoundErrorHandler("Team not found");

    const { error: saveEventError } = await supabase
      .from("teams")
      .update({
        calendar: [...team.calendar, event]
      })
      .eq("team_id", teamId);

    if (saveEventError) return supabaseErrorHandler(saveEventError);

    return NextResponse.json({ message: "Event saved successfully" });
  } catch (error) {
    return serverErrorHandler(error);
  }
}

export async function PUT({ params }: ParamsType, req: NextRequest) {
  try {
    const { teamId } = await params;
    const { event, eventIndex } = await req.json();
    const token = (await headers()).get("Authorization");

    if (!teamId || !event || eventIndex === undefined) return badRequestErrorHandler();

    const { team, error } = await getTeamAndVerifyUser(teamId, token);

    if (error) return notFoundErrorHandler(error);
    if (!team) return notFoundErrorHandler("Team not found");
    if (team.calendar.length < 1) {
      return NextResponse.json(
        { message: "The calendar has no events", error: "Confusion" },
        { status: 409 }
      );
    }

    const updated = team.calendar.map((prev: CalendarDate, index: number) =>
      index === eventIndex ? event : prev
    );

    const { error: updateCalendarError } = await supabase
      .from("teams")
      .update({ calendar: updated })
      .eq("team_id", teamId);

    if (updateCalendarError) return supabaseErrorHandler(updateCalendarError);

    return NextResponse.json({ message: "Event updated successfully" });
  } catch (error) {
    return serverErrorHandler(error);
  }
}

export async function DELETE({ params }: ParamsType, req: NextRequest) {
  try {
    const { teamId } = await params;
    const { eventIndex } = await req.json();
    const token = (await headers()).get("Authorization");

    if (!teamId || eventIndex === undefined) return badRequestErrorHandler();

    const { team, error } = await getTeamAndVerifyUser(teamId, token);

    if (error) return notFoundErrorHandler(error);
    if (!team) return notFoundErrorHandler("Team not found");
    if (team.calendar.length < 1) {
      return NextResponse.json(
        { message: "The calendar has no events", error: "Confusion" },
        { status: 409 }
      );
    }

    const updated = team.calendar.filter((_: CalendarDate, i: number) => i !== eventIndex);

    const { error: updateCalendarError } = await supabase
      .from("teams")
      .update({ calendar: updated })
      .eq("team_id", teamId);

    if (updateCalendarError) return supabaseErrorHandler(updateCalendarError);

    return NextResponse.json({ message: "Event removed successfully" });
  } catch (error) {
    return serverErrorHandler(error);
  }
}
