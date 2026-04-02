//Lib imports
import supabase from "@/lib/db";

//Dependences imports
import { NextRequest, NextResponse } from "next/server";

//User library imports
import User from "@/modules/user.types";

export async function DELETE(req: NextRequest, { params } : { params: Promise<{ token: string }> }) {
  try {
    //Get the token from the URL params
    const { token } = await params;

    //If the token isn't inserted returns error
    if(!token) return NextResponse.json({
      message: "Delete token not inserted.",
      error: "Bad Request"
    }, {
      status: 403
    });

    //Searchs the user from all the tokens
    const { data: user, error: userGetError } = await supabase
    .from("users")
    .select("*")
    .eq("cancel_token", token)
    .maybeSingle();

    //If the user doesn't exist return error
    if(!user) return NextResponse.json({
      message: "User doesn't exist",
      error: "Not found"
    }, {
      status: 404
    });

    //If there's and error returns error
    if(userGetError) return NextResponse.json({
      message: "An error has happened while we was trying to get the user data",
      error: userGetError.message
    }, {
      status: 500
    });

    //Verifies if the expire date is not more older than now
    const now = new Date;
    if(user.cancel_token_expires <= now) return NextResponse.json({
      message: "The token is already expired",
      error: "Invalid request"
    }, {
      status: 403
    });

    //Delete the user account
    const { error: deleteUserError } = await supabase
    .from("users")
    .delete()
    .eq("cancel_token", token);

    //If there's and error returns error
    if(deleteUserError) return NextResponse.json({
      message: "An error has happened while we was trying to get the user data",
      error: deleteUserError.message
    }, {
      status: 500
    });

    //Returns success message
    return NextResponse.json({
      message: "Account deleted successfully"
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