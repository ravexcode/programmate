import { getUser } from "@/modules/user.module";
import { addIntegrant } from "@/modules/project/integrants.module";

import type { UserData } from "@/types/user.types";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export async function loadAcceptRequestPage(
  router: AppRouterInstance
): Promise<UserData | null> {
  const user = await getUser(router);

  return user ?? null;
}

export async function acceptTeamInvite(
  id: number,
  user: UserData,
  router: AppRouterInstance,
  snackbar: React.RefObject<null>
): Promise<boolean> {
  const success = await addIntegrant({
    id,
    member: {
      id: user.id,
      email: user.email,
      username: user.name,
      type: "member",
      avatar_url: user.avatar_url,
    },
    router,
    snackbar,
  });

  return success === true;
}
