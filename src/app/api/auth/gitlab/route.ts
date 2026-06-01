//Next imports
import { type NextRequest, NextResponse } from "next/server";

//Lib imports
import supabase from "@/lib/db";


//Handlers imports
import * as Handler from "@/app/api/handlers";

export async function GET(req: NextRequest) {
  try {
    //Saves the API_URL
    const api_url = process.env.API_URL || "http://localhost:7000";

    //signs with google 
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "gitlab",
      options: {
        redirectTo: api_url + "/oauth/callback",
      }
    });

    //Verifies if there's an error
    if(error) return Handler.serverErrorHandler(error);

    //Returns the data
    return NextResponse.json({
      message: "Ready for start with gitlab",
      url: data?.url
    });
  } catch(e: unknown) {
    Handler.serverErrorHandler(e);
  }
}