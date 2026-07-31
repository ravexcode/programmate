//Next server imports
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

//Lib imports
import supabase from "@/lib/server/db";

//Handlers imports
import {
  badRequestErrorHandler,
  notFoundErrorHandler,
  serverErrorHandler,
  supabaseErrorHandler,
  unauthorizedErrorHandler
} from "@api/handlers";

//Types imports
import { ParamsType } from "../params.type";

export async function POST(req: NextRequest, { params }: ParamsType) {
  try { 
    const { kanban_data } = await req.json();
    const token = (await headers()).get("Authorization");
    const { teamId } = await params;

    if(!kanban_data || teamId === undefined) return badRequestErrorHandler();
    if(!token) return unauthorizedErrorHandler("Authorization token not inserted");

    //Gets the user from Supabase Auth
    const { data: { user }, error: getUserError } = await supabase.auth.getUser(token);

    //Verifies if the user has been returned
    if(!user) return notFoundErrorHandler("User not found");

    //Verifies if there's an error
    if(getUserError) return unauthorizedErrorHandler(getUserError.message);

    //Gets the team data
    const { data: team, error: getTeamError } = await supabase
    .from("teams")
    .select("*")
    .eq("team_id", teamId)
    .maybeSingle();

    //Verifies if the team data has been gotten
    if(!team) return notFoundErrorHandler("The team doesn't exists");

    //Verifies if there's no error
    if(getTeamError) return supabaseErrorHandler(getTeamError);

    //Verifies if the user is in the team
    if(!team?.integrants_id.includes(user.id)) return unauthorizedErrorHandler("Oops... You aren't in the team");
    
    //Saves the board
    const { error: saveBoardError } = await supabase
    .from("teams")
    .update({
      kanban_board: kanban_data
    })
    .eq("team_id", teamId);

    if(saveBoardError) return supabaseErrorHandler(saveBoardError);

    return NextResponse.json({
      message: "Board updated successfully!"
    });
  } catch(e) {
    return serverErrorHandler(e);
  }
}