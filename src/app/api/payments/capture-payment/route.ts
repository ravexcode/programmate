//Functions imports
import { NextRequest, NextResponse } from "next/server";
import * as jwt from "jsonwebtoken";

//Lib imports
import { stripe } from "@/lib/stripe";
import supabase from "@/lib/db";

//Types
import Payment from "@/modules/payment.types";
import { headers } from "next/headers";

//DotEnv declarations
const proyectURL = process.env.NEXT_PUBLIC_NEXT_URL || "http://localhost:3000";
const jwtSecret : string | undefined = process.env.JWT_SECRET;


//Plans
const plans = {
  pro: {
    name: "PrismaFlow pro subscription",
    price: 400, // 4$ USD
  },
  team: {
    name: "PrismaFlow team subscription",
    price: 1000, // 10$ USD
  }
};

export async function POST(req: NextRequest) {
  try {
    //Get the payment data
    const { plan } = await req.json();
    const headersList = await headers();
    const token =  headersList.get("Authorization");

    //If isn't sent we return an error
    if(!plan || !token) return NextResponse.json({
      message: "Data not sent correctly",
      error: "Bad request"
    }, {
      status: 403
    });

    //Looks if jwtSecret key is inserted
    if(!jwtSecret) throw new Error("JWT Secret Key no inserted");
    const decoded = jwt.verify(token, jwtSecret) as { id: string };
    //If the token is wrong returns error
    if(!decoded?.id) return NextResponse.json({
      message: "Invalid token",
      error: "Unauthorized"
    }, {
      status: 401
    });

    //Searchs for the user
    const { data: exists } = await supabase
    .from("users")
    .select("email")
    .eq("id", decoded.id)
    .maybeSingle();

    //If doesn't exist returns error
    if(!exists) return NextResponse.json({
      message: "User don't found",
      error: "Not found"
    }, {
      status: 400
    });

    //Looks the plan type
    let paymentPlan : Payment;

    //Set the plan
    if(plan === "pro") {
      paymentPlan = new Payment(
        plans.pro.name,
        "usd",
        plans.pro.price,
        "https://i.imgur.com/a4AVev2.jpeg",
        new Date()
      );
    } else if(plan === "team") {
      paymentPlan = new Payment(
        plans.team.name,
        "usd",
        plans.team.price,
        "https://i.imgur.com/a4AVev2.jpeg",
        new Date()
      );
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
            unit_amount: paymentPlan.cost, //Transformed to cents

            //Product info
            product_data : {
              name: paymentPlan.name,
              images: [
                paymentPlan.url_image
              ]
            },
          },

          quantity: 1,

          metadata : {
            //Sends the email
            email: exists.email
          }
        }
      ],
      //Payment type
      mode: "payment"
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