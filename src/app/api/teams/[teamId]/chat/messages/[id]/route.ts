//Base code generated from Claude Haiku 4.5x


// Lib imports
import supabase from "@/lib/db";

// Dependencies imports
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

// User library imports
import { decode_jwt } from "@/functions/jsonwebtoken";
import { Decrypt, Encrypt } from "@/functions/crypto";

//Updater for messages
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ teamId: string; id: string }> }
) {
  try {
    //Gets the data inserted
    //From URL
    const { teamId, id } = await params;
    //From Headers
    const token = (await headers()).get("Authorization");
    //From body
    const { content, reactions } = await req.json();

    // Validate required fields
    if (!token || (!content && reactions === undefined))return NextResponse.json({
      message: "At least one field (content or reactions) is required",
      error: "Bad request",
    }, { status: 403 });

    // Decode and verify user
    const user_id = decode_jwt(token);

    // Verify team exists and user is a member
    const { data: team, error: teamError } = await supabase
    .from("teams")
    .select("*")
    .eq("team_id", teamId)
    .maybeSingle();

    //Error handlers
    //team not returned
    if (!team) return NextResponse.json({
        message: "Team not found",
        error: "Not found",
    }, { status: 404 });

    //Supabase Error
    if (teamError) return NextResponse.json({
        message: "Team not found",
        error: teamError.message
    }, { status: 404 });

    //Not in the team
    if (!team.users_id.includes(user_id)) return NextResponse.json({
      message: "You are not a member of this team",
      error: "Unauthorized",
    },{ status: 401 });

    // Fetch the message
    const { data: message, error: messageError } = await supabase
    .from("messages")
    .select("*")
    .eq("id", id)
    .eq("team_id", teamId)
    .maybeSingle();

    //Errors handlers
    //Message not returned
    if (!message) return NextResponse.json({
      message: "Message not found",
      error: "Not found",
    }, { status: 404 });

    //Supabase Error
    if (messageError) return NextResponse.json({
      message: "Error retrieving message",
      error: messageError.message,
    }, { status: 500 });

    // Verify the user is the sender (only sender can edit)
    if (message.sender !== user_id)return NextResponse.json({
      message: "You can only edit your own messages",
      error: "Unauthorized",
    }, { status: 401 });

    //Data object
    const updateData: Object = {
      "content": Encrypt(content),
      "reactions": reactions || undefined
    };

    // Update the message
    const { data: updatedMessage, error: updateError } = await supabase
    .from("messages")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

    //Supabase error
    if (updateError) return NextResponse.json({
      message: "Error updating message",
      error: updateError.message,
    }, { status: 500 });

    // Decrypt and return
    const decryptedContent = Decrypt(updatedMessage.message);

    return NextResponse.json({
      message: "Message updated successfully",
      data: {
        ...updatedMessage,
        content: decryptedContent,
      },
    });
  } catch (e: any) {
    return NextResponse.json({
      message: "An error occurred on the server",
      error: e.message,
    }, { status: 500 });
  }
}

//Messsage deleter
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ teamId: string; id: string }> }
) {
  try {
    const { teamId, id } = await params;
    const token = (await headers()).get("Authorization");

    // Verify token exists
    if (!token) return NextResponse.json({
      message: "Authorization token required",
      error: "Unauthorized",
    }, { status: 401 });

    // Decode and verify user
    const user_id = decode_jwt(token);

    // Verify team exists and user is a member
    const { data: team, error: teamError } = await supabase
      .from("teams")
      .select("*")
      .eq("team_id", teamId)
      .maybeSingle();

    if (!team) return NextResponse.json({
      message: "Team not found",
      error: "Not found",
    }, { status: 404 });

    if (!team.users_id.includes(user_id)) return NextResponse.json({
      message: "You are not a member of this team",
      error: "Unauthorized",
    },
    { status: 401 });

    // Fetch the message
    const { data: message, error: messageError } = await supabase
      .from("messages")
      .select("*")
      .eq("id", id)
      .eq("team_id", teamId)
      .maybeSingle();

    if (!message) return NextResponse.json({
      message: "Message not found",
      error: "Not found",
    }, { status: 404 });

    if (messageError) return NextResponse.json({
      message: "Error retrieving message",
      error: messageError.message,
    }, { status: 500 });

    // Verify the user is the sender (only sender can delete)
    if (message.sender !== user_id) return NextResponse.json({
      message: "You can only delete your own messages",
      error: "Unauthorized",
    }, { status: 401 });

    // Delete the message
    const { error: deleteError } = await supabase
      .from("messages")
      .delete()
      .eq("id", id);

    if (deleteError) {
      return NextResponse.json(
        {
          message: "Error deleting message",
          error: deleteError.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Message deleted successfully",
    });
  } catch (e: any) {
    return NextResponse.json({
      message: "An error occurred on the server",
      error: e.message,
    }, { status: 500 });
  }
}
