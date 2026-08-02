import {
  createSessionService,
  listSessionsService,
  getSessionService,
  deleteSessionService,
  addMessageService
} from "@/services/ai.session.service";

import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export async function createSession(
  router: AppRouterInstance,
  title: string,
  provider: string,
  model: string,
  snackbarRef?: React.RefObject<null>
) {
  return createSessionService(router, title, provider, model, snackbarRef);
}

export async function listSessions(
  router: AppRouterInstance,
  snackbarRef?: React.RefObject<null>
) {
  return listSessionsService(router, snackbarRef);
}

export async function getSession(
  router: AppRouterInstance,
  sessionId: string,
  snackbarRef?: React.RefObject<null>
) {
  return getSessionService(router, sessionId, snackbarRef);
}

export async function deleteSession(
  router: AppRouterInstance,
  sessionId: string,
  snackbarRef?: React.RefObject<null>
) {
  return deleteSessionService(router, sessionId, snackbarRef);
}

export async function addMessage(
  router: AppRouterInstance,
  sessionId: string,
  sent_by: "user" | "assistant",
  content: string,
  snackbarRef?: React.RefObject<null>
) {
  return addMessageService(router, sessionId, sent_by, content, snackbarRef);
}
