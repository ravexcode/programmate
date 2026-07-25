//Next imports
import { type NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

//Lib imports
import supabase from "@/lib/db";

//Handlers imports
import {
  serverErrorHandler,
  notFoundErrorHandler,
  supabaseErrorHandler,
  unauthorizedErrorHandler,
  badRequestErrorHandler
} from "@/app/api/handlers";

//Add the integrant
export async function POST(
  req: NextRequest,
  { params } : {
    params: Promise<{ teamId: string | number }>
  }
){
  try {
    //Gets the data
    const { id, email, username, type, avatar_url } = await req.json();
    const { teamId } = await params;
    const token = (await headers()).get("Authorization");

    //Verifies if the data is OK
    if(!teamId || !id || !email || !username || !type || !avatar_url) return badRequestErrorHandler();

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
    if(!team) return notFoundErrorHandler("Team not found");

    //Verifies if there's no error
    if(getTeamError) return supabaseErrorHandler(getTeamError);

    //Integrant
    const new_integrant = {
      id,
      email,
      username,
      type: type || "Member",
      avatar_url: avatar_url
    }

    //Save in the team
    const { error: saveIntegrantError } = await supabase
    .from("teams")
    .update({
      integrants: [
        ...team.integrants,
        new_integrant
      ],
      integrants_id: [
        ...team.integrants_id,
        new_integrant.id
      ],
    })
    .eq("team_id", teamId);

    //Supabase error handler
    if(saveIntegrantError) return supabaseErrorHandler(saveIntegrantError);

    //Success
    return NextResponse.json({
      message: "Integrant saved"
    });
  } catch(e: unknown) {
    serverErrorHandler(e);
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
    if(!teamId || !id) return badRequestErrorHandler();

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
    if(!team) return notFoundErrorHandler("Team not found");

    //Verifies if there's no error
    if(getTeamError) return supabaseErrorHandler(getTeamError);

    //Verifies if the user is in the team
    if(!team?.integrants_id.includes(user.id)) return unauthorizedErrorHandler("You're not in the team");

    //Check if user is admin
    const currentUserIntegrant = team.integrants.find((integrant: {id: string; type: string}) => integrant.id === user.id);
    
    if(!currentUserIntegrant || currentUserIntegrant.type !== "admin") return NextResponse.json({
      message: "You don't have permission to delete integrants",
      error: "Forbidden"
    }, {
      status: 403
    });

    //Filter out the integrant to delete
    const updatedIntegrants = team.integrants.filter((integrant: {id: string}) => integrant.id !== id);

    //Save in the team
    const { error: saveIntegrantError } = await supabase
    .from("teams")
    .update({
      integrants: updatedIntegrants
    })
    .eq("team_id", teamId);

    //Supabase error handler
    if(saveIntegrantError) return supabaseErrorHandler(saveIntegrantError);

    //Success
    return NextResponse.json({
      message: "Integrant deleted"
    })
  } catch(e: unknown) {
    serverErrorHandler(e);
  }
}