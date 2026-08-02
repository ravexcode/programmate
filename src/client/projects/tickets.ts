import { getUser } from "@/modules/user.module";
import { getProject } from "@/modules/project/main.module";

import type { UserData } from "@/types/user.types";
import type Team from "@/types/team.types";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

type LoadResult = {
  user: UserData;
  team: Team;
};

export async function loadTicketsPage(
  id: number,
  router: AppRouterInstance,
  snackbar: React.RefObject<null>
): Promise<LoadResult | null> {
  const user = await getUser(router);
  const team = await getProject({ router, id, snackbar });

  if(!user || !team) return null;

  return { user, team };
}
