//Lib imports
import supabase from "@/lib/db";

//Next imports
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

//Types
interface Ticket {
  id: string;
  creator: string;
  to: string;
  message: string;
  importance: string;
  created_at: string;
}

//Get all tickets from a team
export async function GET(req: NextRequest, { params }: { params: { teamId: Promise<string | null | undefined> }}){
  try {
    //Gets the data
    const { teamId } = await params;
    const token = (await headers()).get("Authorization");

    //Verifies if the data is OK
    if(!teamId || !token) return NextResponse.json({
      message: "Data sent error",
      error: "Bad request"
    }, {
      status: 403
    });

    //Gets the user from Supabase Auth
    const { data: { user }, error: getUserError } = await supabase.auth.getUser(token);

    //Verifies if the user has been returned
    if(!user) return NextResponse.json({
      message: "User not found",
      error: "Not found"
    }, {
      status: 404
    });

    //Verifies if there's an error
    if(getUserError) return NextResponse.json({
      message: getUserError.message,
      error: getUserError
    }, {
      status: 500
    });

    //Gets the team data
    const { data: team, error: getTeamError } = await supabase
    .from("teams")
    .select("*")
    .eq("team_id", teamId)
    .maybeSingle();

    //Verifies if the team data has been gotten
    if(!team) return NextResponse.json({
      message: "The team doesn't exists",
      error: "Not found"
    }, {
      status: 404
    });

    //Verifies if there's no error
    if(getTeamError) return NextResponse.json({
      message: "Trying to get team error",
      error: getTeamError.message
    }, {
      status: 500
    });

    //Verifies if the user is in the team
    if(!team?.integrants_id.includes(user.id)) return NextResponse.json({
      message: "Oops... You aren't in the team",
      error: "Unauthorized"
    }, {
      status: 401
    });

    //If all is ok, returns the tickets
    return NextResponse.json({
      message: "Tickets retrieved successfully",
      tickets: team.tickets || []
    });
  } catch(e: any) {
    console.error(e);
    //Server errors
    return NextResponse.json({
      message: "An error has happened in the server",
      error: e.message
    }, {
      status: 500
    });
  }
}

//Create a new ticket
export async function POST(req: NextRequest, { params }: { params: { teamId: Promise<string | null | undefined> }}){
  try {
    //Gets the data
    const { teamId } = await params;
    const { creator, to, message, importance } = await req.json();
    const token = (await headers()).get("Authorization");

    //Verifies if the data is OK
    if(!teamId || !token || !creator || !to || !message || !importance) return NextResponse.json({
      message: "Data sent error",
      error: "Bad request"
    }, {
      status: 403
    });

    //Gets the user from Supabase Auth
    const { data: { user }, error: getUserError } = await supabase.auth.getUser(token);

    //Verifies if the user has been returned
    if(!user) return NextResponse.json({
      message: "User not found",
      error: "Not found"
    }, {
      status: 404
    });

    //Verifies if there's an error
    if(getUserError) return NextResponse.json({
      message: getUserError.message,
      error: getUserError
    }, {
      status: 500
    });

    //Gets the team data
    const { data: team, error: getTeamError } = await supabase
    .from("teams")
    .select("*")
    .eq("team_id", teamId)
    .maybeSingle();

    //Verifies if the team data has been gotten
    if(!team) return NextResponse.json({
      message: "The team doesn't exists",
      error: "Not found"
    }, {
      status: 404
    });

    //Verifies if there's no error
    if(getTeamError) return NextResponse.json({
      message: "Trying to get team error",
      error: getTeamError.message
    }, {
      status: 500
    });

    //Verifies if the user is in the team
    if(!team?.integrants_id.includes(user.id)) return NextResponse.json({
      message: "Oops... You aren't in the team",
      error: "Unauthorized"
    }, {
      status: 401
    });

    //Create new ticket
    const newTicket: Ticket = {
      id: `ticket_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      creator,
      to,
      message,
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
    if(updateTeamError) return NextResponse.json({
      message: "Trying to update team error",
      error: updateTeamError.message
    }, {
      status: 500
    });

    //If all is ok, returns success message
    return NextResponse.json({
      message: "Ticket created successfully",
      ticket: newTicket
    });
  } catch(e: any) {
    console.error(e);
    //Server errors
    return NextResponse.json({
      message: "An error has happened in the server",
      error: e.message
    }, {
      status: 500
    });
  }
}

//Update a ticket
export async function PUT(req: NextRequest, { params }: { params: { teamId: Promise<string | null | undefined> }}){
  try {
    //Gets the data
    const { teamId } = await params;
    const { ticketId, creator, to, message, importance } = await req.json();
    const token = (await headers()).get("Authorization");

    //Verifies if the data is OK
    if(!teamId || !token || !ticketId) return NextResponse.json({
      message: "Data sent error",
      error: "Bad request"
    }, {
      status: 403
    });

    //Gets the user from Supabase Auth
    const { data: { user }, error: getUserError } = await supabase.auth.getUser(token);

    //Verifies if the user has been returned
    if(!user) return NextResponse.json({
      message: "User not found",
      error: "Not found"
    }, {
      status: 404
    });

    //Verifies if there's an error
    if(getUserError) return NextResponse.json({
      message: getUserError.message,
      error: getUserError
    }, {
      status: 500
    });

    //Gets the team data
    const { data: team, error: getTeamError } = await supabase
    .from("teams")
    .select("*")
    .eq("team_id", teamId)
    .maybeSingle();

    //Verifies if the team data has been gotten
    if(!team) return NextResponse.json({
      message: "The team doesn't exists",
      error: "Not found"
    }, {
      status: 404
    });

    //Verifies if there's no error
    if(getTeamError) return NextResponse.json({
      message: "Trying to get team error",
      error: getTeamError.message
    }, {
      status: 500
    });

    //Verifies if the user is in the team
    if(!team?.integrants_id.includes(user.id)) return NextResponse.json({
      message: "Oops... You aren't in the team",
      error: "Unauthorized"
    }, {
      status: 401
    });

    //Find and update ticket
    const tickets = team.tickets || [];
    const ticketIndex = tickets.findIndex((t: Ticket) => t.id === ticketId);

    if(ticketIndex === -1) return NextResponse.json({
      message: "Ticket not found",
      error: "Not found"
    }, {
      status: 404
    });

    //Update ticket fields if provided
    if(creator) tickets[ticketIndex].creator = creator;
    if(to) tickets[ticketIndex].to = to;
    if(message) tickets[ticketIndex].message = message;
    if(importance) tickets[ticketIndex].importance = importance;

    //Update team with modified tickets
    const { error: updateTeamError } = await supabase
    .from("teams")
    .update({
      tickets: tickets
    })
    .eq("team_id", teamId);

    //Verifies if there's no error
    if(updateTeamError) return NextResponse.json({
      message: "Trying to update team error",
      error: updateTeamError.message
    }, {
      status: 500
    });

    //If all is ok, returns success message
    return NextResponse.json({
      message: "Ticket updated successfully",
      ticket: tickets[ticketIndex]
    });
  } catch(e: any) {
    console.error(e);
    //Server errors
    return NextResponse.json({
      message: "An error has happened in the server",
      error: e.message
    }, {
      status: 500
    });
  }
}

//Delete a ticket
export async function DELETE(req: NextRequest, { params }: { params: { teamId: Promise<string | null | undefined> }}){
  try {
    //Gets the data
    const { teamId } = await params;
    const { ticketId } = await req.json();
    const token = (await headers()).get("Authorization");

    //Verifies if the data is OK
    if(!teamId || !token || !ticketId) return NextResponse.json({
      message: "Data sent error",
      error: "Bad request"
    }, {
      status: 403
    });

    //Gets the user from Supabase Auth
    const { data: { user }, error: getUserError } = await supabase.auth.getUser(token);

    //Verifies if the user has been returned
    if(!user) return NextResponse.json({
      message: "User not found",
      error: "Not found"
    }, {
      status: 404
    });

    //Verifies if there's an error
    if(getUserError) return NextResponse.json({
      message: getUserError.message,
      error: getUserError
    }, {
      status: 500
    });

    //Gets the team data
    const { data: team, error: getTeamError } = await supabase
    .from("teams")
    .select("*")
    .eq("team_id", teamId)
    .maybeSingle();

    //Verifies if the team data has been gotten
    if(!team) return NextResponse.json({
      message: "The team doesn't exists",
      error: "Not found"
    }, {
      status: 404
    });

    //Verifies if there's no error
    if(getTeamError) return NextResponse.json({
      message: "Trying to get team error",
      error: getTeamError.message
    }, {
      status: 500
    });

    //Verifies if the user is in the team
    if(!team?.integrants_id.includes(user.id)) return NextResponse.json({
      message: "Oops... You aren't in the team",
      error: "Unauthorized"
    }, {
      status: 401
    });

    //Find and remove ticket
    const tickets = team.tickets || [];
    const filteredTickets = tickets.filter((t: Ticket) => t.id !== ticketId);

    if(filteredTickets.length === tickets.length) return NextResponse.json({
      message: "Ticket not found",
      error: "Not found"
    }, {
      status: 404
    });

    //Update team with filtered tickets
    const { error: updateTeamError } = await supabase
    .from("teams")
    .update({
      tickets: filteredTickets
    })
    .eq("team_id", teamId);

    //Verifies if there's no error
    if(updateTeamError) return NextResponse.json({
      message: "Trying to update team error",
      error: updateTeamError.message
    }, {
      status: 500
    });

    //If all is ok, returns success message
    return NextResponse.json({
      message: "Ticket deleted successfully"
    });
  } catch(e: any) {
    console.error(e);
    //Server errors
    return NextResponse.json({
      message: "An error has happened in the server",
      error: e.message
    }, {
      status: 500
    });
  }
}
