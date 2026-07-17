import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

import { captureService } from "@/services/payments/payment.service";

export async function capture(router: AppRouterInstance, snackbar: React.RefObject<null>, plan: "pro" | "enterprise") {
  const data = await captureService({
    router,
    snackbar,
    plan
  });

  return data;
}