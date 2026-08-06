import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

import supabase from "@/lib/server/db";
import { OPENROUTER_MODELS } from "@/utils/openrouter-models";
import { buildChatRequest, parseChatResponse } from "@/utils/ai-chat";
import {
  buildProjectSpecMessages,
  extractProjectSpec,
} from "@/utils/ai-project-spec";

import type { Provider } from "@/types/user.types";

import {
  serverErrorHandler,
  unauthorizedErrorHandler,
  badRequestErrorHandler,
  notFoundErrorHandler,
} from "@/app/api/handlers";

const OPENROUTER_CHAT_URL = "https://openrouter.ai/api/v1/chat/completions";

/**
 * Generates a project spec with AI. Returns the validated spec only.
 * No DB write happens here — saving goes through /api/ai/build-project/commit.
 */
export async function POST(req: NextRequest) {
  try {
    const token = (await headers()).get("Authorization");
    if (!token) return unauthorizedErrorHandler("Authorization token not inserted");

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError) return unauthorizedErrorHandler(authError.message);
    if (!user) return unauthorizedErrorHandler("User not found");

    const { provider, model, messages } = await req.json();
    if (!provider || !model || !Array.isArray(messages) || messages.length === 0) {
      return badRequestErrorHandler();
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("plan, ai")
      .eq("id", user.id)
      .maybeSingle();

    const promptedMessages = buildProjectSpecMessages(messages);

    let content: string | null = null;

    if (provider === "openrouter") {
      // Built-in provider: app key lives server-side, paid plans only
      if (!profile || (profile.plan || "free").toLowerCase() === "free") {
        return NextResponse.json(
          { message: "OpenRouter requires a paid plan" },
          { status: 403 }
        );
      }

      if (!OPENROUTER_MODELS.includes(model)) {
        return NextResponse.json({ message: "Model not available" }, { status: 400 });
      }

      const apiKey = process.env.OPENROUTER_API_KEY;
      if (!apiKey) {
        return serverErrorHandler(new Error("OPENROUTER_API_KEY not configured"));
      }

      const res = await fetch(OPENROUTER_CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ model, messages: promptedMessages }),
      });

      const data = await res.json();

      if (!res.ok) {
        const message = data?.error?.message ?? "OpenRouter request failed";
        return NextResponse.json({ message }, { status: res.status });
      }

      content = data?.choices?.[0]?.message?.content ?? null;
    } else {
      // User-connected provider, key read from the user's own profile
      const aiProviders = (profile?.ai ?? []) as Provider[];
      const providerConfig = aiProviders.find((p) => p.name === provider);

      if (!providerConfig) return notFoundErrorHandler("Provider not found");

      const chatRequest = buildChatRequest({
        provider,
        model,
        messages: promptedMessages,
        apiKey: providerConfig.api_key,
        url: providerConfig.url,
      });

      if (!chatRequest) return badRequestErrorHandler();

      const res = await fetch(chatRequest.url, chatRequest.options);
      const data = await res.json();

      if (!res.ok) {
        const message = data?.error?.message ?? "AI request failed";
        return NextResponse.json({ message }, { status: res.status });
      }

      content = parseChatResponse(provider, data);
    }

    if (!content) {
      return NextResponse.json({ message: "Empty AI response" }, { status: 502 });
    }

    const spec = extractProjectSpec(content);
    if (!spec) {
      return NextResponse.json(
        { message: "AI did not return a valid project spec" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Project spec generated", spec },
      { status: 200 }
    );
  } catch (error) {
    return serverErrorHandler(error);
  }
}
