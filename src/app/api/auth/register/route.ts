//Lib imports
import supabase from "@/lib/server/db";

import { serverErrorHandler, badRequestErrorHandler } from "@/app/api/handlers";

//NextJS imports
import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json();

    if(!email || !password || !name) return badRequestErrorHandler();

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

    if(error) return serverErrorHandler(error);

    //Creates the profile row for the new user
    if(data.user) {
      const { error: profileError } = await supabase
      .from("profiles")
      .insert({
        id: data.user.id,
        email,
        display_name: name,
        to_do_list: []
      });

      //Profile creation must not block signup
      //The /api/users/me route creates it lazily if missing
      if(profileError) console.error("Profile insert failed:", profileError.message);
    }

    return NextResponse.json({
      message: "Signed up successfully",
      token: data.session?.access_token
    }, {
      status: 201
    });
  } catch(e: unknown) {
    return serverErrorHandler(e);
  }
}