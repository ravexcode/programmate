import { getSessionStr } from "@/services/session.service";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

type VerifyPayload = {
  provider_name: string;
  provider_api_key: string;
  provider_url?: string;
};

type VerifyResponse = {
  message: string;
  error: boolean;
  status: number;
  provider?: string;
  models?: string[];
  url?: string;
};

export async function verifyProvider(
  data: VerifyPayload,
  router: AppRouterInstance
): Promise<VerifyResponse> {
  const token = getSessionStr();

  if (!token) {
    router.push("/auth/signin");
    return {
      message: "Session expired",
      error: true,
      status: 401,
    };
  }

  const req = await fetch("/api/ai/provider", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "nexzero-api-key": process.env.NEXT_PUBLIC_API_KEY ?? "",
      Authorization: token,
      "provider-api-key": data.provider_api_key,
      provider: data.provider_name,
      "custom-url": data.provider_url ?? "",
    },
  });

  const response: VerifyResponse = await req.json().catch((e) => ({
    message: e instanceof Error ? e.message : "Server error",
    error: true,
    status: 500,
  }));

  return {
    message: response.message,
    error: response.error ?? req.status >= 400,
    status: req.status,
    provider: response.provider,
    models: response.models,
    url: response.url,
  };
}
