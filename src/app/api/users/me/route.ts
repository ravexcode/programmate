//Next imports
import { type NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

//Lib imports
import supabase from "@/lib/db";
import { Decrypt } from "@/functions/crypto";

//Handlers imports
import * as Handler from "@/app/api/handlers";

export async function GET( req: NextRequest ) {
  try {
    //Gets the user token
    const token = (await headers()).get("Authorization");

    //Verifies if the token has been inserted
    if(!token) return Handler.unauthorizedErrorHandler("Authorization token not inserted");

    //Gets the user data from the token
    const { data: { user }, error: getUserError } = await supabase.auth.getUser(token);

    //Verifies if the user has been returned
    if(!user) return Handler.notFoundErrorHandler("User not found");

    //Verifies if there's an error
    if(getUserError) return Handler.unauthorizedErrorHandler(getUserError.message);

    //Gets the user's extra data
    const { data: teams } = await supabase
    .from("teams")
    .select("*")
    .contains("integrants_id", [ user.id ]);

    const { data: payments } = await supabase
    .from("payments")
    .select("*")
    .eq("user_id", user.id);

    //Gets user's ai chat messages
    interface AiChatMessages {
      //Sender
      sent_by: string,
      //Message (AES Encrypted)
      message: string,
    }

    //Data from supabase
    const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

    //Declare's the AI chat data
    const ai_chat : Array<object | null> = [];

    //Verifies if the user had a chat with ai before
    if(profile && profile.ai_chat && profile.ai_chat.length >= 1) {
      //Decrypt all the messages
      profile.ai_chat.map((value: AiChatMessages) => {
        //Decrypts and saves in the same place
        value.message = Decrypt(value.message)

        //Puts in the chat
        ai_chat.push(value);
      });
    }

    if(profile.display_name === null) {
      await supabase
      .from("profiles")
      .update({"display_name": user.user_metadata.display_name ?? "User"})
      .eq("id", profile.id)
      .select("*");
    };

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