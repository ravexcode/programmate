//Lib imports
import { stripe } from "@/lib/stripe";
import supabase from "@/lib/db";
import { resend } from "@/lib/resend";

//Next imports
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

//DotEnv constants
const stripewh : string | undefined = process.env.WH_STRIPE;

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const stripeSignature : string | null = (await headers()).get("stripe-signature");

    //Verifies if the data inserted is OK
    if(!body || !stripeSignature) return NextResponse.json({
      message: "Error sending the post",
      error: "Bad request"
    }, {
      status: 403
    });

    //Verifies if the stripe webhook key is declared
    if(!stripewh) throw new Error("Stripe webhook is not declared");

    //Hears the event
    const event = stripe.webhooks.constructEvent(
      body,
      stripeSignature,
      stripewh
    );

    //Looks at the event type
    switch(event.type) {
      case "checkout.session.completed": //Payment success
        //Saves the payment in the BD
        const { error: savePaymentError } = await supabase
        .from("payments")
        .insert([
          {
            user_id: event.data.object.metadata?.user_id,
            payment_type: "subscription",
            payment: event.data.object.metadata?.payment,
            plan: event.data.object.metadata?.plan,
            paid_at: new Date(),
          }
        ]);

        //Detects the error
        if(savePaymentError) return NextResponse.json({
          message: "An error has happened while we tried to save the payment",
          error: savePaymentError.message
        }, {
          status: 500
        });

        //Content for email
        const content: string = "Thank you so much for helping us!, if you have a question or wanna report a bug tell us sending an email to help@prismaflow.dev"

        //Send a email to the user
        //TODO: Add logic

        break;

        

      default:
        return NextResponse.json({
          message: "Method not supported"
        }, {
          status: 403
        });
    }

    return NextResponse.json({ message: "Success" });
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