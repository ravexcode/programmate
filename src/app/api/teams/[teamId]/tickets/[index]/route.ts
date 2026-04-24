//Next imports
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

//Lib imports
import supabase from "@/lib/db";

//Types
interface Ticket {
  id: string;
  creator: string;
  to: string;
  message: string;
  importance: string;
  created_at: string;
}

//Delete a ticket by index
export async function DELETE(
  req: NextRequest,
  {
    params
  }: {
    params:
    {
      teamId: string | undefined,
      index: number
    }
  } ) {
  try {
    //Gets the data
    const { teamId, index } = await params;
    const token = (await headers()).get("Authorization");
    
    //Verifies if the data is OK
    if(!teamId || !token || !index) return NextResponse.json({
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
    const filteredTickets = tickets.splice(index, 1);

    console.log(filteredTickets);

    if(filteredTickets.length > tickets.length) return NextResponse.json({
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