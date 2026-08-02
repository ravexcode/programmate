import { getUser } from "@/modules/user.module";
import { getTeam, updateProject, deleteProjectControllerProject } from "@/modules/project/main.module";
import { removeMember } from "@/modules/project/integrants.module";

import type { UserData } from "@/types/user.types";
import type Team from "@/types/team.types";
import type { Status } from "@/types/team.types";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export const STATUS_OPTIONS = [
  { value: "Backlog", label: "Backlog", color: "bg-zinc-500" },
  { value: "Planning", label: "Planning", color: "bg-blue-400" },
  { value: "In progress", label: "In progress", color: "bg-orange-400" },
  { value: "On Hold", label: "On Hold", color: "bg-red-400" },
  { value: "Done", label: "Done", color: "bg-purple-500" },
] as const;

export const WARN_TEXTS = [
  "Are you sure you want to leave from this team?",
  "Are you sure you want to delete this team?",
];

type LoadResult = {
  user: UserData;
  team: Team;
  userIndex: number;
};

export async function loadSettingsPage(
  id: number,
  router: AppRouterInstance,
  snackbar: React.RefObject<null>
): Promise<LoadResult | null> {
  const user = await getUser(router);

  if(!user) return null;

  const team = await getTeam({ id, router, snackbar });

  if(!team) return null;

  const userIndex = team.integrants_id.indexOf(user.id);

  if(userIndex === -1) return null;

  return { user, team, userIndex };
}

export function addTag(team: Team, tag: string): Team {
  if(!tag || team.tags?.includes(tag)) return team;

  return {
    ...team,
    tags: [...(team.tags || []), tag],
  };
}

export function removeTag(team: Team, index: number): Team {
  return {
    ...team,
    tags: (team.tags || []).filter((_, i) => i !== index),
  };
}

export async function applySettings(
  router: AppRouterInstance,
  snackbar: React.RefObject<null>,
  team: Team
) {
  await updateProject({
    router,
    snackbar,
    project: {
      id: team.team_id,
      name: team.name,
      description: team.description,
      status: team.status as Status,
      tags: team.tags || [],
    },
  });
}

export async function deleteTeam(
  router: AppRouterInstance,
  snackbar: React.RefObject<null>,
  id: number
) {
  await deleteProjectControllerProject({ router, id, snackbar });
}

export async function leaveTeam(
  router: AppRouterInstance,
  snackbar: React.RefObject<null>,
  id: number,
  memberId: string
) {
  await removeMember({ id, memberId, router, snackbar });
}
