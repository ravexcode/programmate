//Next imports
import { NextResponse } from "next/server";

//Lib imports
import supabase from "@/lib/server/db";


//Handlers imports
import * as Handler from "@/app/api/handlers";

export async function GET() {
  try {
    //Saves the API_URL
    const callback_url = process.env.IS_PRODUCTION ? "https://nex0.ravexcode.com/oauth/callback" : "http://localhost:7000/oauth/callback";

    //signs with google 
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: callback_url,
      }
    });

    //Verifies if there's an error
    if(error) return Handler.serverErrorHandler(error);

    //Returns the data
    return NextResponse.json({
      message: "Ready for start with github",
      url: data?.url
    });
  } catch(e: unknown) {
    return Handler.serverErrorHandler(e);
  }
}