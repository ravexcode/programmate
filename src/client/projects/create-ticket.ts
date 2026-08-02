import { getUser } from "@/modules/user.module";
import { getProject } from "@/modules/project/main.module";
import { createTicket } from "@/modules/project/ticket.module";

import type { UserData } from "@/types/user.types";
import type Team from "@/types/team.types";
import type { Ticket } from "@/types/team.types";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export const IMPORTANCE_OPTIONS = ["Low", "Medium", "High"];

export function createEmptyTicket(importance: string): Ticket {
  return {
    creator: "",
    creator_id: "",
    to: "",
    title: "",
    message: "",
    importance: importance as "Low",
  };
}

type LoadResult = {
  user: UserData;
  team: Team;
};

export async function loadCreateTicketPage(
  id: number,
  router: AppRouterInstance,
  snackbar: React.RefObject<null>
): Promise<LoadResult | null> {
  const user = await getUser(router);
  const team = await getProject({ router, id, snackbar });

  if(!user || !team) return null;

  return { user, team };
}

export async function submitNewTicket(
  id: number,
  ticket: Ticket,
  importance: string,
  user: UserData,
  router: AppRouterInstance,
  snackbar: React.RefObject<null>
) {
  await createTicket({
    router,
    snackbar,
    ticket: {
      ...ticket,
      importance: importance as "Low" | "Medium" | "High",
      creator: user.name,
      creator_id: user.id,
    },
    id,
  });
}
