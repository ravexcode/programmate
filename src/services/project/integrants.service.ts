import { getSessionStr } from "../session.service";

import {
  requestIntegrantController,
  changeRoleController,
  removeMemberController,
  addIntegrantController,
  searchUsersController
} from "@/controllers/project/integrants.controller";

import { showSnackbar } from "@/components/ui/snackbar";

import checkStatus from "@/utils/check-status";

import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

//-------- Request integrant --------
export async function requestIntegrantService(data: {
  id: number;
  reqEmail: string;
  router: AppRouterInstance;
  snackbar: React.RefObject<null>;
}) {
  const token = getSessionStr();
  if(!token) return data.router.push("/auth/signin");

  const res = await requestIntegrantController({
    id: data.id,
    token,
    reqEmail: data.reqEmail
  });

  showSnackbar(
    res.message,
    checkStatus(res.status),
    data.snackbar
  );

  return res.status === 200;
}

//-------- Change role --------
export async function changeRoleService(data: {
  id: number;
  memberId: string;
  newRole: string;
  router: AppRouterInstance;
  snackbar: React.RefObject<null>;
}) {
  const token = getSessionStr();
  if(!token) return data.router.push("/auth/signin");

  const res = await changeRoleController({
    id: data.id,
    token,
    memberId: data.memberId,
    newRole: data.newRole
  });

  showSnackbar(
    res.message,
    checkStatus(res.status),
    data.snackbar
  );

  return res.status === 200;
}

//-------- Remove member --------
export async function removeMemberService(data: {
  id: number;
  memberId: string;
  router: AppRouterInstance;
  snackbar: React.RefObject<null>;
}) {
  const token = getSessionStr();
  if(!token) return data.router.push("/auth/signin");

  const res = await removeMemberController({
    id: data.id,
    token,
    memberId: data.memberId
  });

  showSnackbar(
    res.message,
    checkStatus(res.status),
    data.snackbar
  );

  return res.status === 200;
}

//-------- Add integrant (accept request) --------
export async function addIntegrantService(data: {
  id: number;
  member: { id: string; email: string; username: string; type: string; avatar_url?: string };
  router: AppRouterInstance;
  snackbar: React.RefObject<null>;
}) {
  const token = getSessionStr();
  if(!token) return data.router.push("/auth/signin");

  const res = await addIntegrantController({
    id: data.id,
    token,
    member: data.member
  });

  showSnackbar(
    res.message,
    checkStatus(res.status),
    data.snackbar
  );

  return res.status === 200;
}

//-------- Search users --------
export async function searchUsersService(data: {
  query: string;
  snackbar: React.RefObject<null>;
}) {
  const res = await searchUsersController({
    query: data.query
  });

  if(res.status !== 200) {
    showSnackbar(
      res.message,
      checkStatus(res.status),
      data.snackbar
    );
    return [];
  }

  return res.users;
}
