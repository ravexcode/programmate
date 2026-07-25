//Next imports
import { NextResponse } from "next/server";
import { headers } from "next/headers";

//Lib imports
import supabase from "@/lib/db";

//Handlers imports
import * as Handlers from "@api/handlers";

//Types imports
import { UserBasic } from "@/types/user.types";

export async function DELETE() {
  try {
    //Gets the user Auth token
    const token = (await headers()).get("Authorization");

    //Verifies if is inerted
    if(!token) return Handlers.unauthorizedErrorHandler("Access token not provided");

    //Gets the user data from token
    const { data: { user }, error: getUserError } = await supabase.auth.getUser(token);

    if(!user || !user.id) return Handlers.unauthorizedErrorHandler("Invalid access token");

    if(getUserError) return Handlers.unauthorizedErrorHandler(getUserError.message);

    //Gets teams data
    const { data: teams } = await supabase
    .from("teams")
    .select("team_id, integrants, integrants_id");

    //Deletes the user
    const { error } = await supabase.auth.admin.deleteUser(user.id);

    //Verifies if there is an error
    if(error) return Handlers.errorTemplate(error.message, error, 502);

    //Only when the user is removed, now we can remove all data from the user
    if (teams) {
      for (const team of teams) {
        const isOnlyUser = team.integrants_id.length === 1 && team.integrants_id[0] === user.id;

        if (isOnlyUser) {
          const { error: deleteTeamError } = await supabase
            .from("teams")
            .delete()
            .eq("team_id", team.team_id);

          if (deleteTeamError) return Handlers.supabaseErrorHandler(deleteTeamError);
        } else {
          const { error: updateTeamError } = await supabase
            .from("teams")
            .update({
              integrants: team.integrants.filter(
                (integrant: UserBasic) => integrant.id !== user.id
              ),
              integrants_id: team.integrants_id.filter(
                (integrant_id: string) => integrant_id !== user.id
              )
            })
            .eq("team_id", team.team_id);

          if (updateTeamError) return Handlers.supabaseErrorHandler(updateTeamError);
        }
      }
    }

    return NextResponse.json({
      message: "User and user's data deleted successfully"
    });
  } catch(e: unknown) {
    return Handlers.serverErrorHandler(e);
  }
}