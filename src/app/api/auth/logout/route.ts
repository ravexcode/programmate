//Lib imports
import supabase from "@/lib/db";

//Dependences imports
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    //Sign out with Supabase Auth
    const { error } = await supabase.auth.signOut();

    //If error occurs, return it
    if (error) return NextResponse.json({
      message: error.message,
      error: error.message
    }, {
      status: 400
    });

    //Send success message
    return NextResponse.json({
      message: "Logged out successfully!"
    });
  } catch(e: any) {
    //Server errors
    return NextResponse.json({
      message: "An error has happened in the server",
      error: e.message
    }, {
      status: 500
    });
  }
}