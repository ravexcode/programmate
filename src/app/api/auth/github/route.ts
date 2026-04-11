//Next imports
import { type NextRequest, NextResponse } from "next/server";

//Lib imports
import supabase from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    //Saves the API_URL
    const api_url = process.env.API_URL || "http://localhost:3000";

    //signs with google 
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: api_url + "/oauth/callback",
      }
    });

    //Verifies if there's an error
    if(error) return NextResponse.json({
      message: error.message,
      error: error
    }, {
      status: 500
    });

    //Returns the data
    return NextResponse.json({
      message: "Ready for start with github",
      url: data?.url
    });

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