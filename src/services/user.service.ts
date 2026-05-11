//Next imports
import { deleteCookie, getCookie } from "cookies-next/client";

//Types imports
import { UserData } from "@/types/user.types";

export default async function UpdateUserData(token: string) {
  //Fetch to user api
  const res = await fetch('/api/users/me', {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
      "Authorization": token
    }
  });

  //Gets the user data
  const data = await res.json();
  
  //Verifies if status is OK
  if(res.status !== 200) {
    //If there's an error
    //Deletes token auth
    deleteCookie("token");
    //Deletes cache
    localStorage.clear();
    //Returns to log in page
    window.location.href = "/auth/login";
  }

  //Plan default
  let plan : string = "Free";
  //Teams
  let teams : Array<Object | null> = [];

  //Payments section
  if(data.payments && data.payments.length >= 1) {
    //Gets the latest payment
    const lastPayment = data.payments[data.payments.length - 1]; //Minus 1 because the array is 1 spot before the data
    //Expiration date
    const expires = new Date(lastPayment.paid_at);
    //Now
    const now = new Date();

    //Verifies if the payment isn't expired
    if(now <= expires) {
      //Plan
      plan = lastPayment.plan;
      //Deletes the "" ("pro" -> pro)
      plan = plan.replaceAll('"', '');
      //First letter to capital (pro -> Pro)
      plan = plan.charAt(0).toUpperCase() + plan.slice(1);
    }
  }
  
  //Teams updater
  if(data.teams && data.teams.length >= 1) {
    teams = data.teams;
  }

  //Creates the user object
  const user : UserData = {
    "id": data.profile.id,
    "email": data.profile.email,
    "name": data.profile.display_name,
    "plan": plan,
    "teams": teams,
    "ai_chat": data.profile.ai_chat,
    "to_do_list": data.profile.to_do_list,
    "created_at": data.user.identities[0].created_at,
    "last_sign_in": data.user.last_sign_in_at
  }

  //Saves in cache
  localStorage.setItem("user", JSON.stringify(user));
  //Returns as user
  return user;
}