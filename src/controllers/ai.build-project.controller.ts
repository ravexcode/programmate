import {
  generateProjectSpecRequest,
  commitProjectSpecRequest,
} from "@/client/ai.build-project";

import type { AiBuildMessage } from "@/client/ai.build-project";
import type { AiProjectSpec } from "@/types/ai-project.types";
import type Team from "@/types/team.types";

type GenerateData = {
  token: string;
  provider: string;
  model: string;
  messages: AiBuildMessage[];
};

type CommitData = {
  token: string;
  spec: AiProjectSpec;
};

export async function generateProjectSpecController(data: GenerateData): Promise<{
  message: string;
  spec?: AiProjectSpec;
  status: number;
}> {
  const req = await generateProjectSpecRequest(data.token, {
    provider: data.provider,
    model: data.model,
    messages: data.messages,
  });

  return {
    message: req.data.message,
    spec: req.data.spec,
    status: req.status,
  };
}

export async function commitProjectSpecController(data: CommitData): Promise<{
  message: string;
  team?: Team;
  status: number;
}> {
  const req = await commitProjectSpecRequest(data.token, data.spec);

  return {
    message: req.data.message,
    team: req.data.team,
    status: req.status,
  };
}
