//Next imports
import { type NextRequest, NextResponse } from "next/server";

//Lib imports
import supabase from "@/lib/db";

//Responses imports
import * as Handlers from "@/app/api/handlers";

export async function POST(req: NextRequest) {
  try {
    //Gets the bug report data
    const { title, description, steps, version, error_date, email, screenshot_url } = await req.json();

    //Verifies if required data is inserted
    if (!title || !description || !steps || !version || !error_date) {
      return Handlers.badRequestErrorHandler();
    }

    //Inserts the bug report into the database
    const { error: insertError } = await supabase
    .from("bug_reports")
    .insert([
      {
        title,
        description,
        steps,
        version,
        error_date,
        email: email || null,
        screenshot_url: screenshot_url || null,
        created_at: new Date().toISOString(),
        status: "New", //Default status
      },
    ]);

    //Verifies if there's an error
    if (insertError) return Handlers.supabaseErrorHandler(insertError);

    //Returns success response
    return NextResponse.json({
      message: "Bug reportado exitosamente",
    }, {
      status: 201,
    });
  } catch (e: unknown) {
    //Error handler
    return Handlers.serverErrorHandler(e);
  }
}
