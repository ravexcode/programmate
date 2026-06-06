//Lib imports
import supabase from "@/lib/db";

//Next imports
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { Ticket } from "@/types/team.types";
import { Decrypt } from "@/functions/crypto";

//Handlers imports
import {
  serverErrorHandler,
  notFoundErrorHandler,
  supabaseErrorHandler,
  unauthorizedErrorHandler,
  badRequestErrorHandler
} from "@/app/api/handlers";

//Get the team function
export async function GET(req: NextRequest, { params }: { params: Promise<{ teamId: string | undefined }>}){
  try {
    //Gets the data
    const { teamId } = await params;
    const token = (await headers()).get("Authorization");

    //Verifies if the data is OK
    if(!teamId) return badRequestErrorHandler();

    if(!token) return unauthorizedErrorHandler("Authorization token not inserted");

    //Gets the user from Supabase Auth
    const { data: { user }, error: getUserError } = await supabase.auth.getUser(token);

    //Verifies if the user has been returned
    if(!user) return notFoundErrorHandler("User not found");

    //Verifies if there's an error
    if(getUserError) return unauthorizedErrorHandler(getUserError.message)

    //Gets the team data
    const { data: team, error: getTeamError } = await supabase
    .from("teams")
    .select("*")
    .eq("team_id", teamId)
    .maybeSingle();

    //Verifies if the team data has been gotten
    if(!team) return notFoundErrorHandler("Team not found");

    //Verifies if there's no error
    if(getTeamError) return supabaseErrorHandler(getTeamError);

    //Verifies if the user is in the team
    if(!team?.integrants_id.includes(user.id)) return unauthorizedErrorHandler("You're not in the team");

    //Decrypt all the tickets
    //Const for decrypted
    const decrypted_tickets : Array<Ticket> | null = [];
    //Team tickets decrypts for all
    team.tickets && team.tickets.forEach(( ticket: Ticket ) => {
      //Decrypts the ticket
      ticket.message = Decrypt(ticket.message);

      //Sets in decrypted tickets
      decrypted_tickets.push(ticket);
    });

    //If all is ok, returns the team data
    return NextResponse.json({
      message: "Team got successfully",
      team: team
    });
  } catch(e: unknown) {
    serverErrorHandler(e);
  }
}

//Delete the team function
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ teamId: string | undefined }>}){
  try {
    //Gets the data
    const { teamId } = await params;
    const token = (await headers()).get("Authorization");

    //Verifies if the data is OK
    if(!teamId) return badRequestErrorHandler();

    if(!token) return unauthorizedErrorHandler("Authorization token not inserted");

    //Gets the user from Supabase Auth
    const { data: { user }, error: getUserError } = await supabase.auth.getUser(token);

    //Verifies if the user has been returned
    if(!user) return notFoundErrorHandler("user not found");

    //Verifies if there's an error
    if(getUserError) return unauthorizedErrorHandler(getUserError.message);

    //Gets the team data
    const { data: team, error: getTeamError } = await supabase
    .from("teams")
    .select("*")
    .eq("team_id", teamId)
    .maybeSingle();

    //Verifies if the team data has been gotten
    if(!team) return notFoundErrorHandler("Team not found");

    //Verifies if there's no error
    if(getTeamError) return supabaseErrorHandler(getTeamError);

    //Verifies if the user is in the team
    if(!team?.integrants_id.includes(user.id)) return unauthorizedErrorHandler("You're not in the team");

    //If all is ok, deletes the team
    const { error: deleteTeamError } = await supabase
    .from("teams")
    .delete()
    .eq("team_id", teamId);

    //Verifies if there's no error
    if(deleteTeamError) return supabaseErrorHandler(deleteTeamError);

    //If everything is fine, returns success message
    return NextResponse.json({
      message: "Team deleted successfully"
    });
  } catch(e: unknown) {
    serverErrorHandler(e);
  }
}

