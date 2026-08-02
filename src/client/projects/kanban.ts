import { getUser } from "@/modules/user.module";
import { getTeam } from "@/modules/project/main.module";

import { saveKanbanRequest } from "@/client/project";
import { getSessionStr } from "@/services/session.service";
import { showSnackbar } from "@/components/ui/snackbar";
import checkStatus from "@/utils/check-status";

import type { UserData } from "@/types/user.types";
import type Team from "@/types/team.types";
import type { Card } from "@/types/team.types";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export type KanbanList = keyof Team["kanban_board"];

type LoadResult = {
  user: UserData;
  team: Team;
};

export async function loadKanbanPage(
  id: number,
  router: AppRouterInstance,
  snackbar: React.RefObject<null>
): Promise<LoadResult | null> {
  const user = await getUser(router);

  if(!user) return null;

  const team = await getTeam({ id, router, snackbar });

  if(!team) return null;

  return { user, team };
}

export function moveCard(
  team: Team,
  sourceList: string,
  id: string,
  targetList: string
): Team {
  const source = sourceList as KanbanList;
  const target = targetList as KanbanList;

  const card = team.kanban_board[source]?.find((c) => c.id === id);
  if(!card) return team;

  return {
    ...team,
    kanban_board: {
      ...team.kanban_board,
      [source]: (team.kanban_board[source] || []).filter((c) => c.id !== id),
      [target]: [...(team.kanban_board[target] || []), card],
    },
  };
}

export function addCard(team: Team, list: KanbanList, createdBy: string): Team {
  const card: Card = {
    id: crypto.randomUUID(),
    title: "",
    created_by: createdBy,
  };

  return {
    ...team,
    kanban_board: {
      ...team.kanban_board,
      [list]: [...(team.kanban_board[list] || []), card],
    },
  };
}

export function updateCardTitle(
  team: Team,
  list: KanbanList,
  index: number,
  title: string
): Team {
  return {
    ...team,
    kanban_board: {
      ...team.kanban_board,
      [list]: (team.kanban_board[list] || []).map((card, i) =>
        i === index ? { ...card, title } : card
      ),
    },
  };
}

export async function saveKanban(
  team: Team,
  router: AppRouterInstance,
  snackbar: React.RefObject<null>
): Promise<boolean> {
  const token = getSessionStr();

  if(!token) return false;

  const res = await saveKanbanRequest(token, team.team_id, team.kanban_board);

  showSnackbar(res.data.message, checkStatus(res.status), snackbar);

  return res.status === 200;
}
