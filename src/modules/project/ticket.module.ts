type CreateData = {
  id: number;
  router: AppRouterInstance;
  snackbar: React.RefObject<null>;
  ticket: Ticket;
}

import type { Ticket } from "@/types/team.types";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

import { createTicketService } from "@/services/project/ticket.service";

export async function createTicket(data: CreateData) {
  const valid = await createTicketService(data);

  if(valid) return data.router.push(`/projects/${data.id}/tickets`);

  return;
}