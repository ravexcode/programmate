//Next imports
import { type NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

//Lib imports
import { stripe } from "@/lib/stripe";
import supabase from "@/lib/db";

//Types
import type Plan from "@/modules/plan.types";

//Handlers imports
import * as Handler from "@/app/api/handlers";

//DotEnv declarations
const proyectURL = process.env.API_URL || "http://localhost:3000";

//Plans
const pro : Plan = {
  name: "Prismaflow pro plan",
  currency: "usd",
  cost: 400, //Dollar cents
  url_image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDl2gg4N0WhybinSClgsZD6KePMVZ0B39thQ&s"
};

const team : Plan = {
  name: "Prismaflow team plan",
  currency: "usd",
  cost: 1000, //Dollar cents
  url_image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDl2gg4N0WhybinSClgsZD6KePMVZ0B39thQ&s"
}

export async function POST(req: NextRequest) {
  try {
    //Get the payment data
    const { plan } = await req.json();
    const token : string | undefined = (await headers()).get("Authorization")?.replace("Bearer ", "");

    //If isn't sent we return an error
    if(!plan) return Handler.badRequestErrorHandler();

    if(!token) return Handler.unauthorizedErrorHandler("Authorization token not inserted");

    //Gets the user data from the token
    const { data: { user }, error: getUserError } = await supabase.auth.getUser(token);

    //If doesn't exist returns error
    if(!user) return Handler.notFoundErrorHandler("User not found");

    //Gets the error
    if(getUserError) return Handler.unauthorizedErrorHandler(getUserError.message);

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
      //Invoice enabled
      invoice_creation: {
        enabled: true,
      },
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
  } catch(e: unknown) {
    console.error(e);
    return Handler.serverErrorHandler(e);
  }
}