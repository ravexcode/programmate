import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
type RequestData = {
  id: number;
  reqEmail: string;
  router: AppRouterInstance;
  snackbar: React.RefObject<null>;
}

import { requestIntegrantController } from "@/controllers/project/integrants.controller";

import { showSnackbar } from "@/components/ui/snackbar";

import checkStatus from "@/utils/check-status";

import {
  getSessionStr
} from "../session.service";

export async function requestIntegrantService(data: RequestData) {
  const token = getSessionStr();
  const router = data.router;

  if(!token) return router.push("/auth/signin");

  const response = await requestIntegrantController({
    id: data.id,
    token,
    reqEmail: data.reqEmail
  });

  showSnackbar(
    response.message,
    checkStatus(response.status),
    data.snackbar
  );

  if(response.status <= 205) return false;

  return true;
}