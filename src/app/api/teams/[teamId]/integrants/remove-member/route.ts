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

//Delete member from team
export async function DELETE(
  req: NextRequest,
  { params } : {
    params: Promise<{ teamId: string | number }>
  }
){
  try {
    //Gets the data
    const { member_id } = await req.json();
    const { teamId } = await params;
    const token = (await headers()).get("Authorization");

    //Verifies if the data is OK
    if(!teamId || !member_id) return badRequestErrorHandler();

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

    //Verifies if the user is admin in the team
    const userIntegrant = team.integrants?.find((int: any) => int.id === user.id);
    if(!userIntegrant || userIntegrant.type !== "admin") {
      return unauthorizedErrorHandler("You don't have permission to remove members");
    }

    //Prevents admin from removing themselves
    if(member_id === user.id) {
      return unauthorizedErrorHandler("You cannot remove yourself from the team");
    }

    //Finds the member to delete
    const memberIndex = team.integrants?.findIndex((int: any) => int.id === member_id);
    
    if(memberIndex === -1 || memberIndex === undefined) {
      return notFoundErrorHandler("Member not found in team");
    }

    //Prevents removing other admins (optional - only the team owner can remove admins)
    const memberToDelete = team.integrants[memberIndex];
    if(memberToDelete.type === "admin" && userIntegrant.id !== team.owner_id) {
      return unauthorizedErrorHandler("Only the team owner can remove admin members");
    }

    //Removes the member
    const updatedIntegrants = team.integrants.filter((int: any, idx: number) => idx !== memberIndex);
    const updatedIntegrantsId = team.integrants_id.filter((id: string, idx: number) => idx !== memberIndex);

    const { error: updateError } = await supabase
    .from("teams")
    .update({
      integrants: updatedIntegrants,
      integrants_id: updatedIntegrantsId
    })
    .eq("team_id", teamId);

    //Supabase error handler
    if(updateError) return supabaseErrorHandler(updateError);

    //Success
    return NextResponse.json({
      message: "Member removed from team"
    });
  } catch(e: unknown) {
    return serverErrorHandler(e);
  }
}
