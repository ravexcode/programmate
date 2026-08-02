import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { validateProviderController, listProvidersController } from "@/controllers/ai.provider.controller";

export async function GET() {
  try {
    const response = await listProvidersController();
    
    return NextResponse.json(
      { providers: response.providers },
      { status: response.status }
    );
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to list providers" },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    const headers_list = await headers();
    const token = headers_list.get("Authorization");
    const provider_api_key = headers_list.get("provider-api-key");
    const provider_name = headers_list.get("provider");
    const custom_url = headers_list.get("custom-url");

    if (!token) {
      return NextResponse.json(
        { message: "Authorization token not inserted" },
        { status: 401 }
      );
    }

    if (!provider_api_key || !provider_name) {
      return NextResponse.json(
        { message: "Provider API key and name required" },
        { status: 400 }
      );
    }

    const response = await validateProviderController(provider_name, provider_api_key, custom_url || undefined);

    return NextResponse.json(response, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Provider validation error" },
      { status: 500 }
    );
  }
}