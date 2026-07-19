//Lib imports
import supabase from "@/lib/db";

//Next imports
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

//Types
import { Ticket } from "@/types/team.types";
import { Encrypt } from "@/functions/crypto";

//Handlers
import {
  badRequestErrorHandler,
  notFoundErrorHandler,
  unauthorizedErrorHandler,
  supabaseErrorHandler,
  serverErrorHandler
} from "@/app/api/handlers";

//Create a new ticket
export async function POST(req: NextRequest, { params }: { params: Promise<{ teamId: string | undefined }>}){
  try {
    //Gets the data
    const { teamId } = await params;
    const { creator, to, title, message, importance, creator_id } = await req.json();
    const token = (await headers()).get("Authorization");

    //Verifies if the data is OK
    if(!teamId || !token || !creator || !to || !title || !message || !importance) return badRequestErrorHandler();

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

    const encrypted_message : string = Encrypt(message);

    //Create new ticket
    const newTicket: Ticket = {
      creator,
      to,
      title,
      creator_id,
      message: encrypted_message,
      importance,
      created_at: new Date().toISOString()
    };

    //Get current tickets or initialize empty array
    const currentTickets = team.tickets || [];

    //Add new ticket to array
    const updatedTickets = [...currentTickets, newTicket];

    //Update team with new ticket
    const { error: updateTeamError } = await supabase
    .from("teams")
    .update({
      tickets: updatedTickets
    })
    .eq("team_id", teamId);

    //Verifies if there's no error
    if(updateTeamError) return supabaseErrorHandler(updateTeamError);

    //If all is ok, returns success message
    return NextResponse.json({
      message: "Ticket created"
    })
  } catch(e: unknown) {
    return serverErrorHandler(e);
  }
}

//Update a ticket
export async function PUT(req: NextRequest, { params }: { params: Promise<{ teamId: string | undefined }>}){
  try {
    //Gets the data
    const { teamId } = await params;
    const { ticketIndex, ticket } = await req.json();
    const token = (await headers()).get("Authorization");

    //Verifies if the data is OK
    if(!teamId || ticketIndex === undefined) return badRequestErrorHandler();

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

    if(team.tickets === undefined || team.tickets === null) return notFoundErrorHandler("The team hasn't tickets");

    //Find and update ticket
    const tickets = team.tickets;
    tickets[ticketIndex] = ticket;
    tickets[ticketIndex].message = Encrypt(tickets[ticketIndex].message);

    //Update team with modified tickets
    const { error: updateTeamError } = await supabase
    .from("teams")
    .update({
      tickets
    })
    .eq("team_id", teamId);

    //Verifies if there's no error
    if(updateTeamError) return supabaseErrorHandler(updateTeamError);

    //If all is ok, returns success message
    return NextResponse.json({
      message: "Ticket updated"
    });
  } catch(e: unknown) {
    return serverErrorHandler(e);
  }
}