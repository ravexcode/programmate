//Next imports
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

//Lib imports
import supabase from "@/lib/server/db";

//Functions imports
import { Decrypt } from "@/functions/crypto";

//Handlers imports
import {
  badRequestErrorHandler,
  notFoundErrorHandler,
  serverErrorHandler,
  supabaseErrorHandler,
  unauthorizedErrorHandler
} from "@api/handlers";
import { Ticket } from "@/types/team.types";

//Get ticket by index
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ teamId: string | undefined, index: number | string | undefined }>}
) {
  try {
    //Gets the data
    const { teamId, index } = await params;
    const token = (await headers()).get("Authorization");
    
    //Verifies if the data is OK
    if(!teamId || !index) return badRequestErrorHandler();
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
    if(!team) return notFoundErrorHandler("Team not found")

    //Verifies if there's no error
    if(getTeamError) return supabaseErrorHandler(getTeamError)

    //Verifies if the user is in the team
    if(!team?.integrants_id.includes(user.id)) return unauthorizedErrorHandler("Oops... You aren't in the team");

    const ticket = team.tickets[index];

    if(!ticket) return notFoundErrorHandler("Ticket not found");

    ticket.message = Decrypt(ticket.message);

    return NextResponse.json({
      message: "Ticket got",
      ticket: team.tickets[index],
    })
  } catch(e: unknown) {
    serverErrorHandler(e);
  }
}

//Delete a ticket by index
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ teamId: string | undefined, index: number | string | undefined }>} ) {
  try {
    //Gets the data
    const { teamId, index } = await params;
    const token = (await headers()).get("Authorization");
    
    //Verifies if the data is OK
    if(!teamId || !index) return badRequestErrorHandler();
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
    if(!team) return notFoundErrorHandler("Team not found")

    //Verifies if there's no error
    if(getTeamError) return supabaseErrorHandler(getTeamError)

    //Verifies if the user is in the team
    if(!team?.integrants_id.includes(user.id)) return unauthorizedErrorHandler("Oops... You aren't in the team");

    //Find and remove ticket
    const tickets: Ticket [] = team.tickets || [];
    const filtered = tickets.filter((_, i) => i !== Number(index));

    //Update team with filtered tickets
    const { error: updateTeamError } = await supabase
    .from("teams")
    .update({
      tickets: filtered
    })
    .eq("team_id", teamId);

    //Verifies if there's no error
    if(updateTeamError) return supabaseErrorHandler(updateTeamError);

    //If all is ok, returns success message
    return NextResponse.json({
      message: "Ticket deleted successfully"
    });
  } catch(e: unknown) {
    serverErrorHandler(e);
  }
}