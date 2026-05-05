//Lib imports
import supabase from "@/lib/db";

//Next imports
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { Ticket } from "@/types/team.types";
import { Decrypt } from "@/functions/crypto";

//Get the team function
export async function GET(req: NextRequest, { params }: { params: Promise<{ teamId: string | undefined }>}){
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
      message: "Team retrieved successfully",
      team: team
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

//Delete the team function
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ teamId: string | undefined }>}){
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

    //If all is ok, deletes the team
    const { error: deleteTeamError } = await supabase
    .from("teams")
    .delete()
    .eq("team_id", teamId);

    //Verifies if there's no error
    if(deleteTeamError) return NextResponse.json({
      message: "Trying to get team error",
      error: deleteTeamError.message
    }, {
      status: 500
    });

    //If everything is fine, returns success message
    return NextResponse.json({
      message: "Team deleted successfully"
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

