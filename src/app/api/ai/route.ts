//Connections imports
//OpenRouter Client ID
import openRouter from "@/lib/ai";
//Supabase Client ID
import supabase from "@/lib/db";

//NextJS imports
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

//Node modules imports
import { Encrypt } from "@/functions/crypto";

//Handlers imports
import {
  serverErrorHandler,
  notFoundErrorHandler,
  supabaseErrorHandler,
  unauthorizedErrorHandler,
  badRequestErrorHandler
} from "@/app/api/handlers";

//Exports function for making ai requests
export async function POST(req: NextRequest){
  try {
    //Gets the message
    const { message } = await req.json();
    //Gets the auth token
    const token = (await headers()).get("Authorization");

    //Verifies if the data is OK
    if(!message) return badRequestErrorHandler();

    if(!token) return unauthorizedErrorHandler("Authorization token not inserted");

    //Gets the user's data
    const { data: { user }, error: getUserError } = await supabase.auth.getUser(token);

    //Verifies if the user has been returned
    if(!user) return notFoundErrorHandler("User not found");

    //Verifies if there's an error
    if(getUserError) return unauthorizedErrorHandler(getUserError.message);

    //User last payment
    const { data: payments } = await supabase
    .from("payments")
    .select("*")
    .eq("user_id", user.id);

    //User profile data
    const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

    //Profile data
    if(!profile) return notFoundErrorHandler("Profile not found");

    //Now date
    const now = new Date();

    //Verifies last updated
    if(new Date(profile.last_updated) < new Date(Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      0, 0, 0, 0
    ))) {
      //Restores the user usages
      profile.daily_requests = 0;
    }

    //OpenRouter max requests and model
    let max_requests = 20;
    let model = "deepseek-chat";

    //Verifies if there's an payment
    if(payments && payments.length >= 1) {
      const lastPayment = payments[payments.length -1];

      //Verifies if isn't expired
      if(new Date(lastPayment.paid_at) < now){
        max_requests = 50;
        model = "deepseek-reasoner";
      }
    }

    //Makes the request
    const stream = await openRouter.chat.send({
      chatRequest: {
        model: "nex-agi/deepseek-v3.1-nex-n1",
        messages: [
          {
            role: "user",
            content: message
          }
        ],
        stream: true,
        reasoning: {
          effort: "low",
        }
      }
    });

    let response = "";
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        response += content;
        process.stdout.write(content);
      }
    }

    //Updated the user profile
    const { error: updateUserError } = await supabase
    .from("profiles")
    .update({
      daily_requests: profile.daily_requests! + 1,
      ai_chat: [
        ...profile.ai_chat || [],
        {
          "sent_by": "user",
          "message": Encrypt(message)
        },
        {
          "sent_by": "ai",
          "message": Encrypt(response)
        }
      ]
    })
    .eq("id", profile.id);

    //Verifies if there's an error
    if(updateUserError) return supabaseErrorHandler(updateUserError);

    //Result
    return NextResponse.json({
      message: "AI response got",
      result: response
    });
  } catch(e: unknown) {
    serverErrorHandler(e);
  }
}