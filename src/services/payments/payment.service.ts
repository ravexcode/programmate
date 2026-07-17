import { getSessionStr } from "@/services/session.service";

import { captureController } from "@/controllers/payments/payment.controller";

import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { showSnackbar } from "@/components/ui/snackbar";
import checkStatus from "@/utils/check-status";

type CaptureData = {
  plan: "pro" | "enterprise";
  router: AppRouterInstance;
  snackbar: React.RefObject<null>;
}

export async function captureService(data: CaptureData) {
    const snackbar = data.snackbar;
    const router = data.router;
  
    const token = getSessionStr();
  
    if(!token) {
      router.push("/auth/signup")
      return false;
    };
  
    const response = await captureController({
      plan: data.plan,
      token
    });
  
    showSnackbar(
      response.message,
      checkStatus(response.status),
      snackbar
    );
  
    if(response.status >= 205) return;
  
    return response.link;
}