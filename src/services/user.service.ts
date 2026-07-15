import {
  getSessionStr,
  logOut
} from "@/services/session.service";

import { fetchProfile, UpdateUserController } from "@/controllers/user.controller";

import type { UserData } from "@/types/user.types";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { showSnackbar } from "@/components/ui/snackbar";
import checkStatus from "@/utils/check-status";

type GetData = {
  router: AppRouterInstance;
}

type UpdateData = {
  router: AppRouterInstance;
  updatable: {
    name: string;
    avatar_url: string;
  };
  snackbar: React.RefObject<null>;
}

export async function getUserService(data: GetData) {
  const token = getSessionStr();
  const router = data.router;

  if(!token) return router.push("/auth/signin");

  const req = await fetchProfile({ token });

  if(req.status === 401) return router.push("/auth/signin");
  if(req.status >= 205) return logOut(router);

  let plan : string = "Free";
  let teams = [];

  const oAuthUser = req.data.user;
  const profile = req.data.profile;
  const payments = req.data.payments;

  console.log(req.data);

  if(payments && payments.length >= 1) {
    const lastPayment = payments[payments.length - 1];
    const expires = new Date(lastPayment.paid_at);
    expires.setDate(expires.getDate() + 30);
    const now = new Date();

    if(now <= expires) {
      plan = lastPayment.plan;
      plan = plan.replaceAll('"', '');
      plan = plan.charAt(0).toUpperCase() + plan.slice(1);
    }
  }
  
  if(req.data.projects && req.data.projects.length >= 1) {
    teams = req.data.projects;
  }

  const username = oAuthUser.user_metareq? oAuthUser.user_metareq.data.display_name : profile.display_name;

  const user : UserData = {
    "id": profile.id,
    "email": profile.email,
    "name": username,
    "plan": plan,
    "teams": teams,
    "ai_chat": profile.ai_chat,
    "to_do_list": profile.to_do_list,
    "created_at": profile.created_at,
    "last_sign_in": oAuthUser.last_sign_in_at,
    "avatar_url": profile.avatar_url,
    "ai_providers": profile.ai_providers
  }

  const now = new Date();

  window.localStorage.setItem("user", JSON.stringify(user));
  window.localStorage.setItem("cached_at", now.toString());
  return user;
}

export async function updateUserService(data: UpdateData) {
  const token = getSessionStr();
  const router = data.router;

  if(!token) return router.push("/auth/signin");

  const req = await UpdateUserController({
    token,
    updatable: data.updatable
  });

  if(req.status === 401) return router.push("/auth/signin");
  
  return showSnackbar(
    req.message,
    checkStatus(req.status),
    data.snackbar
  );
}