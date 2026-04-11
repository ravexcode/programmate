//Next imports
import { type NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

//Lib imports
import { stripe } from "@/lib/stripe";
import supabase from "@/lib/db";

//Types
import type Plan from "@/modules/plan.types";

//DotEnv declarations
const proyectURL = process.env.NEXT_PUBLIC_NEXT_URL || "http://localhost:3000";

//Plans
const pro : Plan = {
  name: "Prismaflow pro plan",
  currency: "usd",
  cost: 400, //Dollar cents
  url_image: ""
};

const team : Plan = {
  name: "Prismaflow team plan",
  currency: "usd",
  cost: 1000, //Dollar cents
  url_image: ""
}

export async function POST(req: NextRequest) {
  try {
    //Get the payment data
    const { plan } = await req.json();
    const token : string | undefined = (await headers()).get("Authorization")?.replace("Bearer ", "");

    //If isn't sent we return an error
    if(!plan || !token) return NextResponse.json({
      message: "Data not sent correctly",
      error: "Bad request"
    }, {
      status: 403
    });

    //Gets the user data from the token
    const { data: { user }, error: getUserError } = await supabase.auth.getUser(token);

    //If doesn't exist returns error
    if(!user) return NextResponse.json({
      message: "User don't found",
      error: "Not found"
    }, {
      status: 400
    });

    //Gets the error
    if(getUserError) return NextResponse.json({
      message: getUserError.message,
      error: getUserError
    }, {
      status: 500
    });

    //Looks the plan type
    let paymentPlan;

    //Set the plan
    if(plan === "pro") {
      paymentPlan = {
        name: pro.name,
        currency: pro.currency,
        price: pro.cost,
        image: pro.url_image,
        paid_at: new Date(), //now
      };
    } else if(plan === "team") {
      paymentPlan = {
        name: team.name,
        currency: team.currency,
        price: team.cost,
        image: team.url_image,
        paid_at: new Date(), //now
      };
    } else { 
      return NextResponse.json({
        message: "Invalid plan type",
        error: "Bad request"
      }, {
        status: 403
      });
    };

    //Makes the checkout
    const session = await stripe.checkout.sessions.create({
      //URL if the user did the payment
      success_url: `${proyectURL}/payments/success/`,
      //Product data (can be many, but in this case is only one)
      line_items: [
        {
          price_data : {
            currency: "usd",
            unit_amount: paymentPlan.price, //Transformed to cents

            //Product info
            product_data : {
              name: paymentPlan.name,
              images: [
                paymentPlan.image
              ]
            },
          },

          quantity: 1,
        }
      ],
      //Payment type
      mode: "payment",
      metadata : {
        //Sends the data from the user
        email: user?.email!,
        user_id: user?.id,
        payment: (paymentPlan.price).toString(),
        plan
      }
    });

    //Return success message
    return NextResponse.json({
      message: "Checkout got successfully!",
      checkout_link: session.url
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