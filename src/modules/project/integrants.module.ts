import {
  requestIntegrantService,
  changeRoleService,
  removeMemberService,
  addIntegrantService,
  searchUsersService
} from "@/services/project/integrants.service";

import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

//-------- Request integrant --------
export async function requestIntegrant(data: {
  id: number;
  reqEmail: string;
  router: AppRouterInstance;
  snackbar: React.RefObject<null>;
}) {
  return await requestIntegrantService(data);
}

//-------- Change role --------
export async function changeRole(data: {
  id: number;
  memberId: string;
  newRole: string;
  router: AppRouterInstance;
  snackbar: React.RefObject<null>;
}) {
  return await changeRoleService(data);
}

//-------- Remove member --------
export async function removeMember(data: {
  id: number;
  memberId: string;
  router: AppRouterInstance;
  snackbar: React.RefObject<null>;
}) {
  return await removeMemberService(data);
}

//-------- Add integrant --------
export async function addIntegrant(data: {
  id: number;
  member: { id: string; email: string; username: string; type: string; avatar_url?: string };
  router: AppRouterInstance;
  snackbar: React.RefObject<null>;
}) {
  return await addIntegrantService(data);
}

//-------- Search users --------
export async function searchUsers(data: {
  query: string;
  snackbar: React.RefObject<null>;
}) {
  return await searchUsersService(data);
}
