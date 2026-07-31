import {
  requestIntegrantRequest,
  changeRoleRequest,
  removeMemberRequest,
  addIntegrantRequest,
} from "@/client/integrants";
import { searchUsersRequest } from "@/client/user";

//-------- Integrants functions --------

export async function requestIntegrantController(data: { id: number; token: string; reqEmail: string }) {
  const req = await requestIntegrantRequest(data.token, data.id, data.reqEmail);

  return {
    message: req.data.message,
    status: req.status
  }
}

export async function changeRoleController(data: { id: number; token: string; memberId: string; newRole: string }) {
  const req = await changeRoleRequest(data.token, data.id, data.memberId, data.newRole);

  return {
    message: req.data.message,
    status: req.status
  }
}

export async function removeMemberController(data: { id: number; token: string; memberId: string }) {
  const req = await removeMemberRequest(data.token, data.id, data.memberId);

  return {
    message: req.data.message,
    status: req.status
  }
}

export async function addIntegrantController(data: { id: number; token: string; member: { id: string; email: string; username: string; type: string; avatar_url?: string } }) {
  const req = await addIntegrantRequest(data.token, data.id, data.member);

  return {
    message: req.data.message,
    status: req.status
  }
}

export async function searchUsersController(data: { query: string }) {
  const req = await searchUsersRequest(data.query);

  return {
    message: req.data.message,
    users: req.data.users || [],
    status: req.status
  }
}
