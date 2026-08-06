import {
  generateProjectSpecService,
  commitProjectSpecService,
} from "@/services/ai.build-project.service";

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

export async function generateProjectSpec(
  data: GenerateData
): Promise<AiProjectSpec | null> {
  return generateProjectSpecService(data);
}

export async function commitProjectSpec(
  data: CommitData
): Promise<Team | null> {
  return commitProjectSpecService(data);
}
