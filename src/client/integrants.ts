import { apiFetch } from "@/utils/http";

export async function requestIntegrantRequest(
  token: string,
  id: number,
  reqEmail: string
) {
  return apiFetch(`/api/teams/${id}/integrants/request`, {
    method: "POST",
    token,
    body: {
      requested_email: reqEmail,
    },
  });
}

export async function changeRoleRequest(
  token: string,
  id: number,
  memberId: string,
  newRole: string
) {
  return apiFetch(`/api/teams/${id}/integrants/change-role`, {
    method: "PATCH",
    token,
    body: {
      member_id: memberId,
      new_role: newRole,
    },
  });
}

export async function removeMemberRequest(
  token: string,
  id: number,
  memberId: string
) {
  return apiFetch(`/api/teams/${id}/integrants/remove-member`, {
    method: "DELETE",
    token,
    body: {
      member_id: memberId,
    },
  });
}

export async function addIntegrantRequest(
  token: string,
  id: number,
  member: {
    id: string;
    email: string;
    username: string;
    type: string;
    avatar_url?: string;
  }
) {
  return apiFetch(`/api/teams/${id}/integrants`, {
    method: "POST",
    token,
    body: member,
  });
}
