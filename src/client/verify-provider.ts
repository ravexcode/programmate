import {
  getSessionStr
} from "@/services/session.service";

import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

type Data = {
  provider_url?: string;
  provider_api_key: string;
  provider_name: string;
  router: AppRouterInstance;
}

export async function verifyProvider(data: Data) {
  const token = getSessionStr();
  const router = data.router;

  if(!token) return router.push("/auth/signin");

  const req = await fetch(
    "/api/ai/provider",
    {
      headers: {
        "Content-Type": "application/json",
        "nexzero-api-key": process.env.NEXT_PUBLIC_API_KEY!,
        "Authorization": token,
        "provider-api-key": data.provider_api_key,
        "provider": data.provider_name,
        "custom_url": data.provider_url || ""
      }
    }
  );

  const response = await req.json().catch((e) => {
    if (e instanceof Error) {
      return {
        message: e.message,
        error: true,
      };
    }

    return {
      message: "Server error",
      error: true,
    };
  });

  return {
    message: response.message,
    error: response.error,
    status: req.status,
  };
}