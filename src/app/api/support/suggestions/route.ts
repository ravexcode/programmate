//Next imports
import { type NextRequest, NextResponse } from "next/server";

//Lib imports
import supabase from "@/lib/server/db";

//Responses imports
import * as Handlers from "@/app/api/handlers";

export async function POST(req: NextRequest) {
  try {
    //Gets the suggestion data
    const { title, description, email } = await req.json();

    //Verifies if required data is inserted
    if (!title || !description) {
      return Handlers.badRequestErrorHandler();
    }

    //Inserts the suggestion into the database
    const { error: insertError } = await supabase
    .from("suggestions")
    .insert([
      {
        title,
        description,
        email: email || null,
        status: "New", //Default status
      },
    ]);

    //Verifies if there's an error
    if (insertError) return Handlers.supabaseErrorHandler(insertError);

    //Returns success response
    return NextResponse.json({
      message: "Suggestion submitted successfully",
    }, {
      status: 201,
    });
  } catch (e: unknown) {
    //Error handler
    return Handlers.serverErrorHandler(e);
  }
}
