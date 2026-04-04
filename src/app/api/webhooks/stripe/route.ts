//Lib imports
import { stripe } from "@/lib/stripe";
import supabase from "@/lib/db";
import { sendEmail } from "@/lib/nodemailer";

//Types
import Payment from "@/modules/payment.types";
import User from "@/modules/user.types";

//Next imports
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

//DotEnv constants
const stripewh : string | undefined = process.env.WH_STRIPE;

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const headersList = await headers();
    const stripeSignature : string | null = headersList.get("stripe-signature");

    //Verifies if the data inserted is OK
    if(!body || !headersList || !stripeSignature) return NextResponse.json({
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
        const { data: paymentSaved, error: savePaymentError } = await supabase
        .from("payments")
        .insert([
          {
            user_id: event.data.object.metadata?.user_id,
            payment_type: "subscription",
            payment: event.data.object.metadata?.payment,
            paid_at: new Date(),
          }
        ])
        .select()
        .maybeSingle();

        //Detects the error
        if(savePaymentError) return NextResponse.json({
          message: "An error has happened while we tried to save the payment",
          error: savePaymentError.message
        }, {
          status: 500
        });

        //Last payments or null
        const lastPayments = event.data.object.metadata?.payments || [];

        //Saves in the DB
        const { error: savePlanError } = await supabase
        .from("users")
        .update({
          plan: event.data.object.metadata?.plan,
          payments: [
            ...lastPayments,
              paymentSaved.id
          ]
        })
        .eq("email", event.data.object.metadata?.email);

        //Debug
        //console.log(event.data.object.metadata);

        //Detects the error
        if(savePlanError) return NextResponse.json({
          message: "Plan don't saved because an error has happened",
          error: savePlanError.message
        }, {
          status: 500
        });

        //Content for email
        const content: string = "Thank you so much for helping us!, if you have a question or wanna report a bug tell us sending an email to help@prismaflow.dev"

        //Send a email to the user
        /* To be fixed!
        await sendEmail(
          event.data.object.metadata?.email,
          "Payment made successfully! 🎉",
          content
        );
        */

        return NextResponse.json({ message: "Payment did successfully!" });

      default:
        return NextResponse.json({
          message: "Method not supported"
        }, {
          status: 403
        });
    }
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