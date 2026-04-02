//Lib imports
import redis from "@/lib/redis";
import supabase from "@/lib/db";

//Dependences imports
import { NextRequest, NextResponse } from "next/server";

//User library imports
import * as jwt from "jsonwebtoken";
import { compare } from "bcrypt-ts";
import User from "@/modules/user.types";


//Env constants
const jwtSecret : string | undefined = process.env.JWT_SECRET;

//User verifying function
async function verifyUser(
  password: string,
  passwordHashed: string,
  id: Number){
  //Verify if we sent the correct data
  if(
    !password ||
    !passwordHashed ||
    !id
  ) {
    //If sent bad returns error
    throw new Error("VerifyUser bad request");
  }

  //Else, we compare passwords
  const match = await compare(password, passwordHashed);
  //If don't match send error
  if(!match) return {
    message: "Passwords don't match",
    error: "Not autorized",
    status: 401
  };

  //Else, create the token

  //Verifies if JWT sk exists
  if(!jwtSecret) throw new Error("JWT secret key not declared");
  //If exists save the token and return success message
  const token = jwt.sign({ id }, jwtSecret);
  return {
    message: "Log in successfully!",
    token
  };
}


//Main LogIn function
export async function POST(req: NextRequest) {
  try {
    //User data for log in
    const { email, password } = await req.json();

    //If isn't sent we return an error
    if(!email || !password) return NextResponse.json({
      message: "Data not sent correctly",
      error: "Bad request"
    }, {
      status: 403
    });

    //Get user cached from redis
    const userCached : string | null = await redis.get(email);

    //Declared verified variable
    let verified : any;

    //Verify if user is cached
    if(userCached) {
      
      //Parse the JSON String
      const userCachedParsed : User = JSON.parse(userCached);

      //Verifies if the user has ID
      if(!userCachedParsed.id) throw new Error("User cached without ID, report it to us");

      //Verifies user
      verified = await verifyUser(
        password,
        userCachedParsed.password,
        userCachedParsed.id
      );

    } else {

      //If not cached we use Supabase
      const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      //Maybe single if don't exists
      .maybeSingle();

      //If doesn't exist send error
      if(!data) return NextResponse.json({
        message: "User not found",
        error: "Not found"
      }, {
        status: 404
      });

      //If we have error, we send it
      if(error) throw new Error("An error has happened while we tried to get your data.\nError:" + error.message);

      //If all is ok we verify the user
      verified = await verifyUser(
        password,
        data.password,
        data.id
      );
    }

    //Take a look if we have errors
    if(verified.error) return NextResponse.json({
      message: verified.message,
      error: verified.error
    }, {
      status: verified.status
    });

    //If we don't have error, send success message
    return NextResponse.json({ message: verified.message, token: verified.token });
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