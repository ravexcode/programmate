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
import supabase from "@/lib/db";

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