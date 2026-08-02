import { getUser } from "@/modules/user.module";
import { getProject } from "@/modules/project/main.module";
import {
  requestIntegrant,
  changeRole,
  removeMember,
  searchUsers,
} from "@/modules/project/integrants.module";

import { isUserAdmin } from "@/utils/team-admin";

import type { UserData } from "@/types/user.types";
import type Team from "@/types/team.types";
import type { IntegrantData } from "@/types/team.types";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export type SearchedUser = {
  email: string;
  display_name: string;
};

type LoadResult = {
  user: UserData;
  team: Team;
};

export async function loadIntegrantsPage(
  id: number,
  router: AppRouterInstance,
  snackbar: React.RefObject<null>
): Promise<LoadResult | null> {
  const user = await getUser(router);
  const team = await getProject({ router, id, snackbar });

  if(!user || !team) return null;

  return { user, team };
}

export function canManageTeam(team: Team | null, userId: string | undefined) {
  return isUserAdmin(team, userId);
}

export function toggleRole(currentRole: string) {
  return currentRole === "admin" ? "member" : "admin";
}

export async function saveIntegrants(
  id: number,
  added: SearchedUser[],
  router: AppRouterInstance,
  snackbar: React.RefObject<null>
) {
  for(const item of added) {
    await requestIntegrant({ id, reqEmail: item.email, router, snackbar });
  }
}

export async function applyRoleChange(
  id: number,
  memberId: string,
  newRole: string,
  router: AppRouterInstance,
  snackbar: React.RefObject<null>
): Promise<boolean> {
  const success = await changeRole({ id, memberId, newRole, router, snackbar });

  return success === true;
}

export async function removeTeamMember(
  id: number,
  memberId: string,
  router: AppRouterInstance,
  snackbar: React.RefObject<null>
): Promise<boolean> {
  const success = await removeMember({ id, memberId, router, snackbar });

  return success === true;
}

export async function findUsers(
  query: string,
  snackbar: React.RefObject<null>
): Promise<SearchedUser[]> {
  const users = await searchUsers({ query, snackbar });

  return users;
}

export function applyRoleChangeToTeam(
  team: Team,
  memberId: string,
  newRole: string
): Team {
  return {
    ...team,
    integrants: team.integrants.map((member: IntegrantData) =>
      member.id === memberId ? { ...member, type: newRole } : member
    ),
  };
}

export function removeMemberFromTeam(team: Team, memberId: string): Team {
  return {
    ...team,
    integrants: team.integrants.filter((member: IntegrantData) => member.id !== memberId),
  };
}
