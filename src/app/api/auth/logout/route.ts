//Lib imports
import redis from "@/lib/redis";

//Dependences imports
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    //User data to save
    const { email, data } = await req.json();

    //If isn't sent we return an error
    if(!email || !data) return NextResponse.json({
      message: "Data not sent correctly",
      error: "Bad request"
    }, {
      status: 403
    });

    //Save the user in redis
    await redis.set(email, data)
    //If we have an error, returns it
    .catch(e => {
      throw new Error("An error has happened in redis", e.message);
    });

    //If all is ok, return success message
    return NextResponse.json({
      message: "Logged Out successfully!"
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