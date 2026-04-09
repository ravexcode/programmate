//lib imports
import supabase from "@/lib/db";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    //signs with google 
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
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
      message: "Ready for start with google",
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