import { getUser } from "@/modules/user.module";
import {
  getTicket,
  updateTicket,
  deleteTicket,
} from "@/modules/project/ticket.module";

import type { UserData } from "@/types/user.types";
import type { Ticket } from "@/types/team.types";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export const IMPORTANCE_OPTIONS = ["Low", "Medium", "High"];

export function getImportanceColor(importance: string) {
  if(importance === "Low") return "bg-blue-500";
  if(importance === "Medium") return "bg-orange-500";
  return "bg-red-500";
}

type LoadResult = {
  user: UserData;
  ticket: Ticket;
};

export async function loadTicketPage(
  id: number,
  index: number,
  router: AppRouterInstance,
  snackbar: React.RefObject<null>
): Promise<LoadResult | null> {
  const user = await getUser(router);

  if(!user) return null;

  const data = await getTicket({ id, index, router, snackbar });

  if(!data?.ticket) return null;

  return { user, ticket: data.ticket };
}

export async function editTicket(
  id: number,
  index: number,
  ticket: Ticket,
  importance: string,
  router: AppRouterInstance,
  snackbar: React.RefObject<null>
) {
  await updateTicket({
    id,
    index,
    router,
    snackbar,
    ticket: {
      ...ticket,
      importance: importance as "Low" | "Medium" | "High",
    },
  });
}

export async function removeTicket(
  id: number,
  index: number,
  router: AppRouterInstance,
  snackbar: React.RefObject<null>
) {
  await deleteTicket({ id, index, router, snackbar });
}
