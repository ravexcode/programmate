import {
  getSessionStr,
  logOut
} from "@/services/session.service";

import {
  createSessionController,
  listSessionsController,
  getSessionController,
  deleteSessionController,
  addMessageController
} from "@/controllers/ai.session.controller";

import { showSnackbar } from "@/components/ui/snackbar";
import checkStatus from "@/utils/check-status";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import type { AiChatSession } from "@/types/ai.types";

type ServiceResponse<T = void> = {
  success: boolean;
  data?: T;
  message?: string;
};

export async function createSessionService(
  router: AppRouterInstance,
  title: string,
  provider: string,
  model: string,
  snackbarRef?: React.RefObject<null>
): Promise<ServiceResponse<AiChatSession>> {
  const token = getSessionStr();

  if (!token) {
    router.push("/auth/signin");
    return { success: false, message: "No session" };
  }

  const res = await createSessionController({ token, title, provider, model });

  if (res.status === 401) {
    router.push("/auth/signin");
    return { success: false, message: "Unauthorized" };
  }

  if (res.status >= 205) {
    if (snackbarRef) showSnackbar(res.message, checkStatus(res.status), snackbarRef);
    return { success: false, message: res.message };
  }

  return { success: true, data: res.session };
}

export async function listSessionsService(
  router: AppRouterInstance,
  snackbarRef?: React.RefObject<null>
): Promise<ServiceResponse<AiChatSession[]>> {
  const token = getSessionStr();

  if (!token) {
    router.push("/auth/signin");
    return { success: false, message: "No session" };
  }

  const res = await listSessionsController(token);

  if (res.status === 401) {
    router.push("/auth/signin");
    return { success: false, message: "Unauthorized" };
  }

  if (res.status >= 205) {
    if (snackbarRef) showSnackbar(res.message, checkStatus(res.status), snackbarRef);
    return { success: false, message: res.message };
  }

  return { success: true, data: res.sessions ?? [] };
}

export async function getSessionService(
  router: AppRouterInstance,
  sessionId: string,
  snackbarRef?: React.RefObject<null>
): Promise<ServiceResponse<AiChatSession>> {
  const token = getSessionStr();

  if (!token) {
    router.push("/auth/signin");
    return { success: false, message: "No session" };
  }

  const res = await getSessionController({ token, sessionId });

  if (res.status === 401) {
    router.push("/auth/signin");
    return { success: false, message: "Unauthorized" };
  }

  if (res.status >= 205) {
    if (snackbarRef) showSnackbar(res.message, checkStatus(res.status), snackbarRef);
    return { success: false, message: res.message };
  }

  return { success: true, data: res.session };
}

export async function deleteSessionService(
  router: AppRouterInstance,
  sessionId: string,
  snackbarRef?: React.RefObject<null>
): Promise<ServiceResponse> {
  const token = getSessionStr();

  if (!token) {
    router.push("/auth/signin");
    return { success: false, message: "No session" };
  }

  const res = await deleteSessionController({ token, sessionId });

  if (res.status === 401) {
    router.push("/auth/signin");
    return { success: false, message: "Unauthorized" };
  }

  if (res.status >= 205) {
    if (snackbarRef) showSnackbar(res.message, checkStatus(res.status), snackbarRef);
    return { success: false, message: res.message };
  }

  return { success: true };
}

export async function addMessageService(
  router: AppRouterInstance,
  sessionId: string,
  sent_by: "user" | "assistant",
  content: string,
  snackbarRef?: React.RefObject<null>
): Promise<ServiceResponse<AiChatSession>> {
  const token = getSessionStr();

  if (!token) {
    router.push("/auth/signin");
    return { success: false, message: "No session" };
  }

  const res = await addMessageController({ token, sessionId, sent_by, content });

  if (res.status === 401) {
    router.push("/auth/signin");
    return { success: false, message: "Unauthorized" };
  }

  if (res.status >= 205) {
    if (snackbarRef) showSnackbar(res.message, checkStatus(res.status), snackbarRef);
    return { success: false, message: res.message };
  }

  return { success: true, data: res.session };
}
