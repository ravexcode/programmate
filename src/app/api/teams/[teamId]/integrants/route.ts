//Next imports
import { type NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

//Lib imports
import supabase from "@/lib/db";

//Add the integrant
export async function POST(
  req: NextRequest,
  { params } : {
    params: Promise<{ teamId: string | number }>
  }
){
  try {
    //Gets the data
    const { id, email, username, type } = await req.json();
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

    //Integrant
    const new_integrant = {
      id,
      email,
      username,
      type: type || "Member",
    }

    //Save in the team
    const { error: saveIntegrantError } = await supabase
    .from("teams")
    .update({
      integrants: [
        ...team.integrants,
        new_integrant
      ]
    })
    .eq("team_id", teamId);

    //Supabase error handler
    if(saveIntegrantError) return NextResponse.json({
      message: saveIntegrantError.message,
      error: saveIntegrantError
    }, {
      status: 401
    });

    //Success
    return NextResponse.json({
      message: "Integrant saved"
    })
  }  catch(e: any) {
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


//Delete function
export async function DELETE(
  req: NextRequest,
  { params } : {
    params: Promise<{ teamId: string | number }>
  }
){
  try {
    //Gets the data
    const { id } = await req.json();
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

    //Check if user is admin
    const currentUserIntegrant = team.integrants.find((integrant: any) => integrant.id === user.id);
    
    if(!currentUserIntegrant || currentUserIntegrant.type !== "admin") return NextResponse.json({
      message: "You don't have permission to delete integrants",
      error: "Forbidden"
    }, {
      status: 403
    });

    //Filter out the integrant to delete
    const updatedIntegrants = team.integrants.filter((integrant: any) => integrant.id !== id);

    //Save in the team
    const { error: saveIntegrantError } = await supabase
    .from("teams")
    .update({
      integrants: updatedIntegrants
    })
    .eq("team_id", teamId);

    //Supabase error handler
    if(saveIntegrantError) return NextResponse.json({
      message: saveIntegrantError.message,
      error: saveIntegrantError
    }, {
      status: 401
    });

    //Success
    return NextResponse.json({
      message: "Integrant deleted"
    })
  }  catch(e: any) {
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