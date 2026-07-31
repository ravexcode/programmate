//Lib imports
import { stripe } from "@/lib/server/stripe";
import supabase from "@/lib/server/db";
import { resend } from "@/lib/server/resend";
import { PaymentTemplate } from "@/lib/server/email-templates";

//Next imports
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

//Handlers imports
import * as Handler from "@/app/api/handlers";

//DotEnv constants
const stripewh : string | undefined = process.env.WH_STRIPE;

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const stripeSignature : string | null = (await headers()).get("stripe-signature");

    //Verifies if the data inserted is OK
    if(!body || !stripeSignature) return Handler.badRequestErrorHandler();

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
        if(savePaymentError) return Handler.supabaseErrorHandler(savePaymentError);

        const { error: resendError } = await resend
        .emails
        .send({
          from: 'NexZero <noreply@ravexcode.com>',
          to: event.data.object.metadata?.email ?? "",
          subject: "Request recivied",
          react: PaymentTemplate({
            amount: Number(event.data.object.metadata?.payment ?? 0),
            recipt_link: event.data.object.invoice?.toString() ?? "",
            orderId: event.data.object.id
          })
        });

        if(resendError){
          return Handler.resendErrorHandler(resendError)
        };

        break;

      default:
        return NextResponse.json({
          message: "Method not supported"
        }, {
          status: 403
        });
    }

    return NextResponse.json({ message: "Success" });
  } catch(e: unknown) {
    return Handler.serverErrorHandler(e);
  }
}