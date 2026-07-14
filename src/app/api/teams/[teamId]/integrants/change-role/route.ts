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

//Change member role
export async function PATCH(
  req: NextRequest,
  { params } : {
    params: Promise<{ teamId: string | number }>
  }
){
  try {
    //Gets the data
    const { member_id, new_role } = await req.json();
    const { teamId } = await params;
    const token = (await headers()).get("Authorization");

    //Verifies if the data is OK
    if(!teamId || !member_id || !new_role) return badRequestErrorHandler();

    //Validates role type
    if(!["admin", "member"].includes(new_role.toLowerCase())) {
      return badRequestErrorHandler();
    }

    if(!token) return unauthorizedErrorHandler("Authorization token not inserted");

    //Gets the user from Supabase Auth
    const { data: { user }, error: getUserError } = await supabase.auth.getUserService({router});

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

    //Verifies if the user is admin in the team
    const userIntegrant = team.integrants?.find((int: any) => int.id === user.id);
    if(!userIntegrant || userIntegrant.type !== "admin") {
      return unauthorizedErrorHandler("You don't have permission to change member roles");
    }

    //Finds the member to update
    const memberIndex = team.integrants?.findIndex((int: any) => int.id === member_id);
    
    if(memberIndex === -1 || memberIndex === undefined) {
      return notFoundErrorHandler("Member not found in team");
    }

    //Prevents admin from changing their own role
    if(member_id === user.id) {
      return unauthorizedErrorHandler("You cannot change your own role");
    }

    //Updates the member role
    const updatedIntegrants = [...team.integrants];
    updatedIntegrants[memberIndex].type = new_role.toLowerCase();

    const { error: updateError } = await supabase
    .from("teams")
    .update({
      integrants: updatedIntegrants
    })
    .eq("team_id", teamId);

    //Supabase error handler
    if(updateError) return supabaseErrorHandler(updateError);

    //Success
    return NextResponse.json({
      message: `Member role updated to ${new_role.toLowerCase()}`
    });
  } catch(e: unknown) {
    return serverErrorHandler(e);
  }
}
