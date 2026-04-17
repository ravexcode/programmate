//Next imports
import { type NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

//Lib imports
import supabase from "@/lib/db";

export async function DELETE(req: NextRequest) {
  try {
    //Gets the user Auth token
    const token = (await headers()).get("Authorization");

    //Verifies if is inerted
    if(!token) return NextResponse.json({
      message: "Not token provided",
      error: "Unauthorized"
    }, {
      status: 401
    });

    //Gets the user data from token
    const { data: { user } } = await supabase.auth.getUser(token);

    if(!user || !user.id) return NextResponse.json({
      message: "Invalid token",
      error: "Unauthorized"
    }, {
      status: 401
    });

    //Deletes the user
    const { error } = await supabase.auth.admin.deleteUser(user.id);

    //Verifies if there is an error
    if(error) return NextResponse.json({
      message: "Error deleting the user",
      error: error.message
    }, {
      status: 500
    });

    return NextResponse.json({
      message: "User deleted successfully"
    })
  } catch(e) {
    //Error handler
    return NextResponse.json({
      message: "Error inside in the server",
      error: e
    }, {
      status: 500
    });
  }
}