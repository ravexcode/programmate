//Next imports
import { type NextRequest, NextResponse } from "next/server";

//Lib imports
import supabase from "@/lib/db";

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

    //Returns the user's data
    return NextResponse.json({
      message: "User data got",
      user
    })
  } catch(e) {

  }
}