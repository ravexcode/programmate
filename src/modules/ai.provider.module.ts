import { validateProviderService, listProvidersService } from "@/services/ai.provider.service";

export async function validateProvider(
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
  return validateProviderService(providerName, apiKey, customUrl, snackbarRef);
}

export async function listProviders(snackbarRef?: React.RefObject<null>): Promise<{
  success: boolean;
  providers?: Array<{ name: string; key: string }>;
  message?: string;
}> {
  return listProvidersService(snackbarRef);
}