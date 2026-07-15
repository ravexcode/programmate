import getUserService from "@/services/user.service";

import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export async function getUser(router: AppRouterInstance) {
  const data = await getUserService({ router });

  return data;
}