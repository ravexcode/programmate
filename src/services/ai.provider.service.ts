import { validateProviderController, listProvidersController } from "@/controllers/ai.provider.controller";
import { getSessionStr } from "@/services/session.service";
import { showSnackbar } from "@/components/ui/snackbar";

export async function validateProviderService(
  providerName: string,
  apiKey: string,
  customUrl?: string,
  snackbarRef?: React.RefObject<null>
): Promise<{
  success: boolean;
  message: string;
  provider?: string;
  models?: string[];
  url?: string;
}> {
  const token = getSessionStr();

  if (!token) {
    return {
      success: false,
      message: "Session expired. Please sign in again.",
    };
  }

  const response = await validateProviderController(providerName, apiKey, customUrl);

  if (response.status !== 200) {
    showSnackbar(response.message, response.status >= 500 ? "critic" : "warn", snackbarRef!);
    return {
      success: false,
      message: response.message,
      provider: response.provider,
      url: response.url,
    };
  }

  showSnackbar(`${response.provider} validated successfully`, "valid", snackbarRef!);

  return {
    success: true,
    message: response.message,
    provider: response.provider,
    models: response.models,
    url: response.url,
  };
}

export async function listProvidersService(snackbarRef?: React.RefObject<null>): Promise<{
  success: boolean;
  providers?: Array<{ name: string; key: string }>;
  message?: string;
}> {
  const token = getSessionStr();

  if (!token) {
    return {
      success: false,
      message: "Session expired. Please sign in again.",
    };
  }

  const response = await listProvidersController();

  if (response.status !== 200) {
    showSnackbar("Failed to list providers", "warn", snackbarRef!);
    return {
      success: false,
      message: "Failed to list providers",
    };
  }

  return {
    success: true,
    providers: response.providers,
  };
}