import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

import supabase from "@/lib/server/db";
import { OPENROUTER_MODELS } from "@/utils/openrouter-models";

import {
  serverErrorHandler,
  unauthorizedErrorHandler,
  badRequestErrorHandler,
} from "@/app/api/handlers";

const OPENROUTER_CHAT_URL = "https://openrouter.ai/api/v1/chat/completions";

export async function POST(req: NextRequest) {
  try {
    // Auth
    const token = (await headers()).get("Authorization");
    if (!token) return unauthorizedErrorHandler("Authorization token not inserted");

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError) return unauthorizedErrorHandler(authError.message);
    if (!user) return unauthorizedErrorHandler("User not found");

    // Paid plan gate — missing plan counts as free (plan normalized to lowercase)
    const { data: profile } = await supabase
      .from("profiles")
      .select("plan")
      .eq("id", user.id)
      .maybeSingle();

    if (!profile || (profile.plan || "free").toLowerCase() === "free") {
      return NextResponse.json(
        { message: "OpenRouter requires a paid plan" },
        { status: 403 }
      );
    }

    // Body
    const { model, messages } = await req.json();
    if (!model || !messages || !Array.isArray(messages)) {
      return badRequestErrorHandler();
    }

    // Allowlist gate — only curated models
    if (!OPENROUTER_MODELS.includes(model)) {
      return NextResponse.json({ message: "Model not available" }, { status: 400 });
    }

    // App key, never exposed to client
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
      body: JSON.stringify({ model, messages }),
    });

    const data = await res.json();

    if (!res.ok) {
      const message =
        data?.error?.message ?? "OpenRouter request failed";
      return NextResponse.json({ message }, { status: res.status });
    }

    const content = data?.choices?.[0]?.message?.content ?? null;

    if (!content) {
      return NextResponse.json({ message: "Empty AI response" }, { status: 502 });
    }

    return NextResponse.json({ content }, { status: 200 });
  } catch (error) {
    return serverErrorHandler(error);
  }
}
