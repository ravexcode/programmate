//Lib imports
import supabase from "@/lib/db";

//Dependences imports
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

//Gets the team data
export async function GET(
  req: NextRequest,
  { params } : { params: Promise<{ teamId: Number }> }
) {
  try{
    //Gets the user data
    const { teamId } = await params;
    const token = (await headers()).get("Authorization");

    //Verifies if the data has been send correctly
    if(!teamId || !token) return NextResponse.json({
      message: "Data required don't sent!",
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
    const { data: team, error: getTeamData } = await supabase
    .from("teams")
    .select("*")
    .eq("team_id", teamId)
    .maybeSingle();

    //If team is null returns error
    if(!team) return NextResponse.json({
      message: "Team don't found",
      error: "Not found"
    }, {
      status: 404
    });

    //If supabase req has an error returns error
    if(getTeamData) return NextResponse.json({
      message: "An error has happened while we was trying to get the team data!",
      error: getTeamData.message
    }, {
      status: 500
    });

    //Verifies if the user is in the team
    if(!team?.users_id.includes(user.id)) return NextResponse.json({
      message: "Oops... You aren't in the team",
      error: "Unauthorized"
    }, {
      status: 401
    });
    
    //If all is ok returns success message
    return NextResponse.json({
      message: "Team data found!",
      data: team
    });
    
  } catch(e: any) {
    //Server errors
    return NextResponse.json({
      message: "An error has happened in the server",
      error: e.message
    }, {
      status: 500
    });
  }
}