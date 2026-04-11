//Lib imports
import supabase from "@/lib/db";
import redis from "@/lib/redis";

//NextJS imports
import { type NextRequest, NextResponse } from "next/server";

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

    //Searchs the user in Redis
    const user : any = await redis.get(email);

    //----------- Redis -----------
    if(user) {
      //Parses the user data to string
      const userParsed = JSON.parse(user);

      //Success message
      return NextResponse.json({
        message: "Logged in from Redis successfully",
        token: userParsed.session?.access_token
      });
    }

    //----------- Supabase -----------
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    //Verifies if there's an error
    if(error) return NextResponse.json({
      message: error.message,
      error: error
    }, {
      status: 500
    });

    //Debug
    console.log(data);

    //If supabase is ok returns the token
    return NextResponse.json({
      message: "Logged in from Supabase successfully",
      token: data.session?.access_token
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