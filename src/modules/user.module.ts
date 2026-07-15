import {
  getUserService,
  updateUserService
} from "@/services/user.service";

import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export async function getUser(router: AppRouterInstance) {
  const data = await getUserService({ router });

  return data;
}

export async function updateUser(router: AppRouterInstance, updatable: { name: string; avatar_url: string; }, snackbar: React.RefObject<null>) {
  const data = await updateUserService({
    router,
    updatable,
    snackbar
  })

  return data;
}