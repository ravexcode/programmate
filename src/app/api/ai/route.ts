//Connections imports
//OpenRouter Client ID
import openRouter from "@/lib/ai";
//Supabase Client ID
import supabase from "@/lib/db";

//NextJS imports
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { PostgrestSingleResponse } from "@supabase/supabase-js";

//Exports function for making ai requests
export async function POST(req: NextRequest){
  try {
    //Gets the message
    const { message } = await req.json();
    //Gets the auth token
    const token = (await headers()).get("Authorization");

    //Verifies if the data sent is OK
    if(!message || !token) return NextResponse.json({
      message: "Data don't sent correctly",
      error: "Bad request"
    }, {
      status: 403
    });

    //Gets the data
    const { data: { user }, error: getUserError } = await supabase.auth.getUser(token);

    //Verifies if the user has been returned
    if(!user) return NextResponse.json({
      message: "User not found",
      error: "Not found"
    }, {
      status: 404
    });

    //Verifies if there's an error
    if(getUserError) return NextResponse.json({
      message: getUserError.message,
      error: getUserError
    }, {
      status: 500
    });

    //Payment data type
    interface Payment {
      id: number,
      user_id: string,
      payment_type: string,
      payment: number,
      paid_at: string,
      plan: string
    }

    //User last payment
    const { data: payments } = await supabase
    .from("payments")
    .select("*")
    .eq("user_id", user.id) as PostgrestSingleResponse<Array<Payment>> || null;

    //Profile data type
    interface Profile {
      id: string,
      email: string,
      created_at: string,
      display_name: string,
      daily_requests: number,
      last_updated: string,
    }

    //User profile data
    const { data: profile } = await supabase
    .from("profiles")
    .select("id, daily_requests, last_updated")
    .eq("id", user.id)
    .maybeSingle() as PostgrestSingleResponse<Profile> || null;

    //Profile data
    if(!profile) return NextResponse.json({
      message: "User don't found",
      error: "Not found"
    }, {
      status: 404
    });

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
        model: "deepseek/deepseek-chat-v3.1",
        messages: [
          {
            role: "user",
            content: message
          }
        ],
        stream: true
      }
    });

    let response = "";
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        response += content;
        process.stdout.write(content);
      }

      // Usage information comes in the final chunk
      if (chunk.usage) {
        console.log("\nReasoning tokens:", chunk.usage.totalTokens);
      }
    }

    //Updated the user profile
    const { error: updateUserError } = await supabase
    .from("profiles")
    .update({
      daily_requests: profile.daily_requests! + 1,
    })
    .eq("id", profile.id);

    //Verifies if there's an error
    if(updateUserError) return NextResponse.json({
      message: updateUserError.message,
      error: updateUserError
    }, {
      status: 500
    });

    //Result
    return NextResponse.json({
      message: "AI response got",
      result: response
    });
  } catch(e: any) {
    //Error handler
    return NextResponse.json({
      message: "Error inside in the server",
      error: e
    }, {
      status: 500
    });
  }
}