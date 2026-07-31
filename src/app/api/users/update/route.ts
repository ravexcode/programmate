import {
  NextRequest,
  NextResponse
} from "next/server";
import { headers } from "next/headers";

import {
  badRequestErrorHandler,
  serverErrorHandler,
  supabaseErrorHandler,
  unauthorizedErrorHandler
} from "@api/handlers";
import supabase from "@/lib/server/db";
import { Encrypt } from "@/lib/server/crypto";

export async function PUT(req: NextRequest) {
  try {
    const { name, avatar_url } = await req.json();
    const token = (await headers()).get("Authorization");

    if(!name || !avatar_url) return badRequestErrorHandler();
    if(!token) return unauthorizedErrorHandler("Authorization key not inserted");

    const { data: auth, error: getUserError } = await supabase.auth.getUser(token);

    if(getUserError) return unauthorizedErrorHandler(getUserError.message);

    const { error: updateProfileError } = await supabase
    .from("profiles")
    .update({
      name,
      avatar_url
    })
    .eq("id", auth.user.id);

    if(updateProfileError) return supabaseErrorHandler(updateProfileError);

    return NextResponse.json({
      message: "Profile updated successfully"
    });
  } catch(e) {
    serverErrorHandler(e);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { ai } = await req.json();
    const token = (await headers()).get("Authorization");

    if(!token) return unauthorizedErrorHandler("Authorization key not inserted");
    if(!ai || !Array.isArray(ai)) return badRequestErrorHandler();

    const { data: auth, error: getUserError } = await supabase.auth.getUser(token);

    if(getUserError) return unauthorizedErrorHandler(getUserError.message);

    const encrypted = ai.map((p: { name: string; api_key: string; models: string[]; url?: string }) => ({
      name: p.name,
      api_key: p.api_key ? Encrypt(p.api_key) : "",
      models: p.models,
      url: p.url || "",
    }));

    const { error: updateError } = await supabase
    .from("profiles")
    .update({ ai: encrypted })
    .eq("id", auth.user.id);

    if(updateError) return supabaseErrorHandler(updateError);

    return NextResponse.json({
      message: "AI providers updated successfully"
    });
  } catch(e) {
    serverErrorHandler(e);
  }
}