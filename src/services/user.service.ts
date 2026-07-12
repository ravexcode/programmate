import {
  getSessionStr,
  logOut
} from "@/services/session.service";

import { fetchProfile } from "@/controllers/user.controller";

import type { UserData } from "@/types/user.types";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

type GetData = {
  router: AppRouterInstance;
}

export default async function getUserService(data: GetData) {
  const token = getSessionStr();
  const router = data.router;

  if(!token) return router.push("/auth/signin");

  const req = await fetchProfile({ token });

  if(req.status === 401) return router.push("/auth/signin");
  if(req.status >= 205) return logOut(router);

  let plan : string = "Free";
  let teams = [];

  if(req.data.payments && req.data.payments.length >= 1) {
    const lastPayment = req.data.payments[req.data.payments.length - 1];
    const expires = new Date(lastPayment.paid_at);
    expires.setDate(expires.getDate() + 30);
    const now = new Date();

    if(now <= expires) {
      plan = lastPayment.plan;
      plan = plan.replaceAll('"', '');
      plan = plan.charAt(0).toUpperCase() + plan.slice(1);
    }
  }
  
  //Teams updater
  if(req.data.teams && req.data.teams.length >= 1) {
    teams = req.data.teams;
  }

  const username = req.data.user.user_metareq.data.display_name ?? req.data.profile.display_name;

  const user : UserData = {
    "id": req.data.profile.id,
    "email": req.data.profile.email,
    "name": username,
    "plan": plan,
    "teams": teams,
    "ai_chat": req.data.profile.ai_chat,
    "to_do_list": req.data.profile.to_do_list,
    "created_at": req.data.user.identities[0].created_at,
    "last_sign_in": req.data.user.last_sign_in_at,
    "avatar_url": req.data.profile.avatar_url,
    "ai_providers": req.data.profile.ai_providers
  }

  const now = new Date();

  window.localStorage.setItem("user", JSON.stringify(user));
  window.localStorage.setItem("cached_at", now.toString());
  return user;
}