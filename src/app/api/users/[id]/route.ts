//Next imports
import { NextRequest, NextResponse } from "next/server";

//Lib imports
import supabase from "@/lib/server/db";

//Handlers imports
import {
  notFoundErrorHandler,
  supabaseErrorHandler,
  serverErrorHandler,
  badRequestErrorHandler
} from "@api/handlers";

//Function for getting the user data
export async function GET(
  req: NextRequest,
  { params }: {
      params: Promise<{
      id: string
    }>
  }
){
  try {
    const { id } = await params;

    if(!id) return badRequestErrorHandler();

    const { data: user, error: getProfileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .maybeSingle();

    if(!user) return notFoundErrorHandler("User not found");
    if(getProfileError) return supabaseErrorHandler(getProfileError);

    const { data: teams, error: getTeamsError } = await supabase
    .from("teams")
    .select("*")
    .contains( "integrants_id", [ id ] );

    if( teams !== null && teams !== undefined && teams.length < 1 && getTeamsError ) return supabaseErrorHandler(getTeamsError)

    const { data: payments, error: getPaymentsError } = await supabase
    .from("payments")
    .select("*")
    .eq("user_id", id);

    if( payments !== null && payments !== undefined && payments.length < 1 && getPaymentsError ) return supabaseErrorHandler(getPaymentsError)

    return NextResponse.json({
      message: "User data got",
      user: user,
      teams: teams || [],
      payments: payments || []
    })
  } catch(e) {
    return serverErrorHandler(e);
  }
}