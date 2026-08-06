import { getSessionStr, logOut } from "@/services/session.service";

import {
  generateProjectSpecController,
  commitProjectSpecController,
} from "@/controllers/ai.build-project.controller";

import { showSnackbar } from "@/components/ui/snackbar";
import checkStatus from "@/utils/check-status";

import type { AiBuildMessage } from "@/client/ai.build-project";
import type { AiProjectSpec } from "@/types/ai-project.types";
import type Team from "@/types/team.types";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

type GenerateData = {
  router: AppRouterInstance;
  snackbar: React.RefObject<null>;
  provider: string;
  model: string;
  messages: AiBuildMessage[];
};

type CommitData = {
  router: AppRouterInstance;
  snackbar: React.RefObject<null>;
  spec: AiProjectSpec;
};

export async function generateProjectSpecService(
  data: GenerateData
): Promise<AiProjectSpec | null> {
  const token = getSessionStr();

  if (!token) {
    logOut(data.router);
    return null;
  }

  const res = await generateProjectSpecController({
    token,
    provider: data.provider,
    model: data.model,
    messages: data.messages,
  });

  if (res.status === 401) {
    logOut(data.router);
    return null;
  }

  if (res.status >= 205) {
    showSnackbar(res.message, checkStatus(res.status), data.snackbar);
    return null;
  }

  return res.spec ?? null;
}

export async function commitProjectSpecService(
  data: CommitData
): Promise<Team | null> {
  const token = getSessionStr();

  if (!token) {
    logOut(data.router);
    return null;
  }

  const res = await commitProjectSpecController({ token, spec: data.spec });

  if (res.status === 401) {
    logOut(data.router);
    return null;
  }

  if (res.status >= 205) {
    showSnackbar(res.message, checkStatus(res.status), data.snackbar);
    return null;
  }

  // Invalidate the user cache so the new project appears on the dashboard
  window.localStorage.removeItem("user");
  window.localStorage.removeItem("cached_at");

  return res.team ?? null;
}
