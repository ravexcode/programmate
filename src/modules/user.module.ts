import {
  getUserService,
  updateUserService,
  updateAiProvidersService
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

export async function updateAiProviders(
  router: AppRouterInstance,
  ai_providers: Array<{
    name: string;
    api_key: string;
    models: string[];
    url?: string;
  }>,
  snackbar: React.RefObject<null>
) {
  return updateAiProvidersService({
    router,
    ai_providers,
    snackbar
  });
}