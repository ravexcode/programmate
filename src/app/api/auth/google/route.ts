//lib imports
import supabase from "@/lib/db";
import { type NextRequest, NextResponse } from "next/server";

import * as Handler from "@/app/api/handlers";

export async function GET(req: NextRequest) {
  try {
    //Saves the API_URL
    const api_url = process.env.API_URL || "http://localhost:7000";

    //signs with google 
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: api_url + "/oauth/callback",
      }
    });

    //Verifies if there's an error
    if(error) return Handler.serverErrorHandler(error);

    //Returns the data
    return NextResponse.json({
      message: "Ready for start with google",
      url: data?.url
    });
  } catch(e: unknown) {
    Handler.serverErrorHandler(e);
  }
}