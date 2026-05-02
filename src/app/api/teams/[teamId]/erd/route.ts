//Lib imports
import supabase from "@/lib/db";

//Next imports
import { type NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

export async function POST(
  req: NextRequest,
  { params }: { params: { teamId: Promise<string | null | undefined> }}
){
  try {
    //Gets the data
    const { erd, connections } = await req.json();
    const { teamId } = await params;
    const token = (await headers()).get("Authorization");

    if(!teamId || !token || !erd || !connections) return NextResponse.json({
      message: "Data send error",
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

    //Saves the ERD
    const { error: updateERDError } = await supabase
    .from("teams")
    .update( { ERD: erd, ERD_connections: connections } )
    .eq("team_id", teamId);

    //Error handler
    if(updateERDError) return NextResponse.json({
      message: updateERDError.message,
      error: updateERDError
    }, {
      status: 500
    });

    return NextResponse.json({
      message: "ERD updated successfully"
    })
  } catch(e: any) {
    return NextResponse.json({
      message: "An error has happened in the server",
      error: e.message
    }, {
      status: 500
    });
  }
}