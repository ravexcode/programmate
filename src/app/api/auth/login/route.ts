//Lib imports
import supabase from "@/lib/db";

//NextJS imports
import { type NextRequest, NextResponse } from "next/server";

import { serverErrorHandler } from "@/app/api/handlers";

export async function POST(req: NextRequest) {
  try {
    //Gets data sent
    const { email, password } = await req.json();

    //Data verifier
    if(!email || !password ) return NextResponse.json({
      message: "Data not sent correctly",
      error: "Bad request"
    }, {
      status: 403
    });

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    //Verifies if there's an error
    if(error) return serverErrorHandler(error);

    //If supabase is ok returns the token
    return NextResponse.json({
      message: "Logged in from Supabase successfully",
      token: data.session?.access_token
    });

  } catch(e: unknown) {
    serverErrorHandler(e);
  }
}