//Next imports
import { NextResponse } from "next/server";
import { headers } from "next/headers";

//Lib imports
import supabase from "@/lib/server/db";

//Handlers imports
import * as Handler from "@/app/api/handlers";

export async function GET() {
  try {
    //Gets the user token
    const token = (await headers()).get("Authorization");

    //Verifies if the token has been inserted
    if(!token) return Handler.unauthorizedErrorHandler("Authorization token not inserted");

    //Gets the user data from the token
    const { data: { user }, error: getUserError } = await supabase.auth.getUser(token);

    //Verifies if there's an error
    if(getUserError) return Handler.unauthorizedErrorHandler(getUserError.message);

    //Verifies if the user has been returned
    if(!user) return Handler.unauthorizedErrorHandler("User not found");

    //Gets the user's extra data
    const { data: teams } = await supabase
    .from("teams")
    .select("*")
    .contains("integrants_id", [ user.id ]);

    const { data: payments } = await supabase
    .from("payments")
    .select("*")
    .eq("user_id", user.id);

    //Gets user's profile
    const { data: fetchedProfile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

    //Verifies if there's an error
    if(profileError) return Handler.supabaseErrorHandler(profileError);

    //Upserts the profile if the user doesn't have one yet
    let profile = fetchedProfile;

    //Creates the profile if the user doesn't have one yet
    if(!profile) {
      const { data: created, error: insertError } = await supabase
      .from("profiles")
      .insert({
        id: user.id,
        email: user.email,
        display_name: user.user_metadata?.display_name ?? "User",
        avatar_url: user.user_metadata?.avatar_url ?? "",
        to_do_list: []
      })
      .select("*")
      .maybeSingle();

      //Verifies if there's an error
      if(insertError) return Handler.supabaseErrorHandler(insertError);

      profile = created;
    } else if(profile.display_name === null) {
      //Fills the display name with the auth metadata
      const display_name = user.user_metadata?.display_name ?? "User";

      const { error: updateError } = await supabase
      .from("profiles")
      .update({ display_name })
      .eq("id", profile.id);

      //Verifies if there's an error
      if(updateError) return Handler.supabaseErrorHandler(updateError);

      profile.display_name = display_name;
    }

    //Returns the user's data
    return NextResponse.json({
      message: "User data got",
      user,
      teams,
      payments,
      profile
    })
  } catch(e: unknown) {
    return Handler.serverErrorHandler(e);
  }
}
