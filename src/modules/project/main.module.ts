import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"

import { getProjectService } from "@/services/project/main.service"

type GetData = {
  router: AppRouterInstance;
  id: number;
  snackbar: React.RefObject<null>;
}

export function getProject(data: GetData) {
  const res = getProjectService(data);

  return res;
}