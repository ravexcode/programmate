type CreateData = {
  id: number;
  router: AppRouterInstance;
  snackbar: React.RefObject<null>;
  ticket: Ticket;
}

import { createTicketController } from "@/controllers/project/ticket.controller";

import { showSnackbar } from "@/components/ui/snackbar";

import checkStatus from "@/utils/check-status";

import {
  getSessionStr
} from "../session.service";

import type { Ticket } from "@/types/team.types";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export async function createTicketService(data: CreateData) {
  const token = getSessionStr();
  const router = data.router;

  if(!token) return router.push("/auth/signin");

  const response = await createTicketController({
    id: data.id,
    token,
    ticket: data.ticket
  });

  showSnackbar(
    response.message,
    checkStatus(response.status),
    data.snackbar
  );

  if(response.status <= 205) return null;

  return true;
}