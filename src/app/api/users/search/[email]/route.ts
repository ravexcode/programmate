//Lib imports
import supabase from "@/lib/server/db";

//Next imports
import { type NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{email: string}> }
) {
  try {
    //Gets the email inserted
    const { email } = await params;

    //Verifies if this is valid
    if(!email) return NextResponse.json({
      message: "Email inserted is not valid"
    }, {
      status: 403
    });

    //Searchs users
    const { data: users, error: getUsersError } = await supabase
    .from("profiles")
    .select("id, email, display_name")
    .ilike('email', `%${email}%`)
    .limit(5);

    if(getUsersError) return NextResponse.json({
      message: getUsersError.message,
      error: getUsersError
    }, {
      status: 500
    });

    //Returns all users data
    return NextResponse.json({
      message: "Users gotten",
      users
    })
  } catch(e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    //Error handler
    return NextResponse.json({
      message: "Error inside in the server",
      error: message
    }, {
      status: 500
    });
  }
}