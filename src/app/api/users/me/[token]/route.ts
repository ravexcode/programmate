//Next imports
import { type NextRequest, NextResponse } from "next/server";

//Lib imports
import supabase from "@/lib/db";
import { Decrypt } from "@/functions/crypto";

export async function GET(
  req: NextRequest,
  { params } : { params: Promise<{ token: string }> }
) {
  try {
    //Gets the user token
    const { token } = await params;

    //Verifies if the token has been inserted
    if(!token) return NextResponse.json({
      message: "Token not inserted",
      error: "Bad request"
    }, {
      status: 401
    });

    //Gets the user data from the token
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
    let ai_chat : Array<Object | null> = [];

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

    console.log(user);

    //Returns the user's data
    return NextResponse.json({
      message: "User data got",
      user,
      teams,
      payments,
      profile
    })
  } catch(e: any) {
    //Error handler
    return NextResponse.json({
      message: "Error inside in the server",
      error: e.message
    }, {
      status: 500
    });
  }
}