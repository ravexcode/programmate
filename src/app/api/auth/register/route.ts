//Lib imports
import supabase from "@/lib/db";

import { serverErrorHandler, badRequestErrorHandler } from "../../handlers";

//NextJS imports
import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    //Gets data sent
    const { email, password, name } = await req.json();

    //Data verifier
    if(!email || !password || !name) return badRequestErrorHandler();

    //signs up the user in supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: name,
        },
        emailRedirectTo: `${process.env.API_URL || "http://localhost:7000"}/oauth/callback`,
      }
    });

    //Verifies if there's an error
    if(error) return serverErrorHandler(error);

    //If everything is ok returns the token
    return NextResponse.json({
      message: "Signed up successfully",
      token: data.session?.access_token
    }, {
      status: 201
    });
  } catch(e: unknown) {
    serverErrorHandler(e);
  }
}