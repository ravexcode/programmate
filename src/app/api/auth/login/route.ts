//Lib imports
import supabase from "@/lib/db";

//NextJS imports
import { type NextRequest, NextResponse } from "next/server";

import { badRequestErrorHandler, serverErrorHandler } from "@/app/api/handlers";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if(!email || !password) return badRequestErrorHandler();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if(error) return serverErrorHandler(error);

    return NextResponse.json({
      message: "Logged in from Supabase successfully",
      token: data.session?.access_token
    });
  } catch(e: unknown) {
    return serverErrorHandler(e);
  }
}