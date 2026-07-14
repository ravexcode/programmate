import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"

import { getSessionStr } from "../session.service"

import { getProjectController } from "@/controllers/project/main.controller";

import checkStatus from "@/utils/check-status";

import { showSnackbar } from "@/components/ui/snackbar";

type GetData = {
  router: AppRouterInstance;
  id: number;
  snackbar: React.RefObject<null>;
}

export async function getProjectService(data: GetData) {
  const token = getSessionStr();
  const router = data.router;

  if(!token) return router.push("/auth/signin");

  const res = await getProjectController({
    token,
    id: data.id
  });

  showSnackbar(
    res.message,
    checkStatus(res.status),
    data.snackbar
  )

  if(res.status >= 205) return router.push("/dashboard");

  return res.project;
}