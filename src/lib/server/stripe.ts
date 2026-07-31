//Node modules imports
import Stripe from "stripe";

//Function for verify the stripeSK
function getStripeSK() {
  //Declares the SK
  const stripesk = process.env.STRIPE_SK || undefined;

  //If is undefined returns error
  if(!stripesk) throw new Error("Stripe Secret Key is not declared.");

  //Else, returns the SK
  return stripesk;
}

//Exports the stripe conector
export const stripe = new Stripe(getStripeSK());