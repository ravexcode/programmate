//Next imports
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

//Handlers imports
import {
  serverErrorHandler,
  badRequestErrorHandler,
  notFoundErrorHandler,
  supabaseErrorHandler,
  unauthorizedErrorHandler,
  errorTemplate
} from "@api/handlers"; 

//Lib imports
import supabase from "@/lib/db";

//Types imports
import { CalendarDate } from "@/types/team.types";
import { ParamsType } from "@api/teams/[teamId]/params.type";

export async function POST({ params }: ParamsType, req: NextRequest) {
  try {
    const { teamId } = await params;
    const { event } = await req.json();
    const token = (await headers()).get("Authorization");
    
    if (!teamId || event) return badRequestErrorHandler();
    if(!token) return unauthorizedErrorHandler("Authorization token not inserted");

    const { data: { user }, error: getUserError } = await supabase.auth.getUser(token);

    if(!user) return notFoundErrorHandler("User data not found");
    if(getUserError) return unauthorizedErrorHandler("Authorization token expired");

    const { data: team, error: getTeamError } = await supabase
    .from("teams")
    .select("*")
    .eq("team_id", teamId)
    .maybeSingle();

    if(!team) return notFoundErrorHandler("Team not found");
    if(getTeamError) return supabaseErrorHandler(getTeamError);

    if(team.integrants_id.includes(user.id)) return unauthorizedErrorHandler("You're not in the team");

    const { error: saveEventError } = await supabase
    .from("teams")
    .update({
      calendar: [
        ...team.calendar,
        event
      ]
    })
    .eq("team_id", teamId);

    if(saveEventError) return supabaseErrorHandler(saveEventError);

    return NextResponse.json({
      message: "Event saved successfully"
    });
  } catch (error) {
    return serverErrorHandler(error);
  }
}

export async function PUT({ params }: ParamsType, req: NextRequest) {
  try {
    const { teamId } = await params;
    const { event, eventIndex } = await req.json();
    const token = (await headers()).get("Authorization");
    
    if (!teamId || event || eventIndex === undefined) return badRequestErrorHandler();
    if(!token) return unauthorizedErrorHandler("Authorization token not inserted");

    const { data: { user }, error: getUserError } = await supabase.auth.getUser(token);

    if(!user) return notFoundErrorHandler("User data not found");
    if(getUserError) return unauthorizedErrorHandler("Authorization token expired");

    const { data: team, error: getTeamError } = await supabase
    .from("teams")
    .select("*")
    .eq("team_id", teamId)
    .maybeSingle();

    if(!team) return notFoundErrorHandler("Team not found");
    if(getTeamError) return supabaseErrorHandler(getTeamError);

    if(team.integrants_id.includes(user.id)) return unauthorizedErrorHandler("You're not in the team");

    if(team.calendar.length < 1) return errorTemplate(
      "The calendar has no events",
      "Confusion",
      409
    );

    const updated = team.calendar.filter((prev: CalendarDate, index: number) => {
      if(index !== eventIndex) return prev;

      return event;
    });

    const { error: updateCalendarError } = await supabase
    .from("teams")
    .update({
      calendar: updated
    })
    .eq("team_id", teamId);

    if(updateCalendarError) return supabaseErrorHandler(updateCalendarError);

    return NextResponse.json({
      message: "Event updated successfully"
    })
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
    if(!token) return unauthorizedErrorHandler("Authorization token not inserted");

    const { data: { user }, error: getUserError } = await supabase.auth.getUser(token);

    if(!user) return notFoundErrorHandler("User data not found");
    if(getUserError) return unauthorizedErrorHandler("Authorization token expired");

    const { data: team, error: getTeamError } = await supabase
    .from("teams")
    .select("*")
    .eq("team_id", teamId)
    .maybeSingle();

    if(!team) return notFoundErrorHandler("Team not found");
    if(getTeamError) return supabaseErrorHandler(getTeamError);

    if(team.integrants_id.includes(user.id)) return unauthorizedErrorHandler("You're not in the team");

    if(team.calendar.length < 1) return errorTemplate(
      "The calendar has no events",
      "Confusion",
      409
    );

    const updated = team.calendar.filter((_: CalendarDate, i: number) => i !== eventIndex);

    const { error: updateCalendarError } = await supabase
    .from("teams")
    .update({
      calendar: updated
    })
    .eq("team_id", teamId);

    if(updateCalendarError) return supabaseErrorHandler(updateCalendarError);

    return NextResponse.json({
      message: "Event removed successfully"
    })
  } catch (error) {
      return serverErrorHandler(error);
  }
}