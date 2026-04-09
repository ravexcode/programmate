//Lib imports
import supabase from "@/lib/db";
import redis from "@/lib/redis";

//NextJS imports
import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    //Gets data sent
    const { email, password, name } = await req.json();

    //Data verifier
    if(!email || !password || !name) return NextResponse.json({
      message: "Data not sent correctly",
      error: "Bad request"
    }, {
      status: 403
    });

    //signs up the user in supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: name
        }
      }
    });

    //Verifies if there's an error
    if(error) return NextResponse.json({
      message: error.message,
      error: error
    }, {
      status: 500
    });

    //Saves the user in Redis for preventing the db saturation
    await redis.set(email, JSON.stringify(data));

    //If everything is ok returns the token
    return NextResponse.json({
      message: "Signed up successfully",
      token: data.session?.access_token
    }, {
      status: 201
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