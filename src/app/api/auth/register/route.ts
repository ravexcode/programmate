//Lib imports
import supabase from "@/lib/db";
import { sendRegistedEmail } from "@/lib/nodemailer";

//Dependences imports
import { NextRequest, NextResponse } from "next/server";

//User library imports
import * as jwt from "jsonwebtoken";
import { hash } from "bcrypt-ts";
import { randomBytes } from "crypto";

//Types imports
import User from "@/modules/user.types";

//Env constants
const jwtSecret : string | undefined = process.env.JWT_SECRET;

export async function POST(req: NextRequest) {
  try {
    //User data for create the user
    const { email, password, username } = await req.json();
    
    //Search if the user exists
    const { data: alreadyExists } = await supabase
    .from("users")
    .select("email")
    .eq("email", email)
    .maybeSingle();

    //If already exists return error
    if(alreadyExists) return NextResponse.json({
      message: "El usuario ya está registrado",
      error: "Already exists"
    }, {
      status: 409
    });

    //Hash the password
    const saltRounds = 12;
    const hashed = await hash(password, saltRounds);

    //Generate the token with CryptoJS
    const cancelToken : string = randomBytes(64).toString();
    //Automatically now
    const cancelTokenExpires: Date = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

    //Create the user
    const user = new User(
      //id
      username,
      //email
      email,
      //password
      hashed,
      //Cancel SignUp token
      cancelToken,
      //Cancel SignUp token expiration date
      cancelTokenExpires,
    );

    //Creates the email
    const cancelSignUpURL =
    process.env.NEXT_PUBLIC_NEXT_URL || "http://localhost:3000"
    +"/security/cancel-sign-up/"
    +cancelToken;

    //Send the email
    await sendRegistedEmail(
      email,
      "Welcome to PrismaFlow 🚀",
      cancelSignUpURL
    )
    .catch(e => {
      throw new Error("An error has ocurred while we sent you an email.\nError: "+e.message);
    });

    //Saves the user in the db
    const { data: userSaved, error: saveUserError } = await supabase
    .from("users")
    .insert([user])
    .select()
    .single();

    //If an error happens return error
    if(saveUserError) return NextResponse.json({
      message: "An error has ocurred white saving the user",
      error: saveUserError.message
    }, {
      status: 500
    });

    //Verifies if JWT sk exists
    if(!jwtSecret) throw new Error("JWT secret key not declared");
    //If exists save the token
    const token = await jwt.sign({ id: userSaved.id }, jwtSecret);

    //Sends success message
    return NextResponse.json({
      message: "Signed Up successfully, welcome!",
      token
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