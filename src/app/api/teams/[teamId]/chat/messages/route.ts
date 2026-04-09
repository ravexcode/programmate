// Lib imports
import supabase from "@/lib/db";

// Dependencies imports
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

// User library imports
import { decode_jwt } from "@/functions/jsonwebtoken";
import { Decrypt, Encrypt } from "@/functions/crypto";

//Get the messages
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ teamId: string }> }
) {
  try {
    const { teamId } = await params;
    const token = (await headers()).get("Authorization");

    // Verify token exists
    if (!token) {
      return NextResponse.json(
        {
          message: "Authorization token required",
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    // Decode and verify user
    const user_id = decode_jwt(token);

    // Verify team exists and user is a member
    const { data: team, error: teamError } = await supabase
      .from("teams")
      .select("*")
      .eq("team_id", teamId)
      .maybeSingle();

    if (!team) {
      return NextResponse.json(
        {
          message: "Team not found",
          error: "Not found",
        },
        { status: 404 }
      );
    }

    if (!team.users_id.includes(user_id)) {
      return NextResponse.json(
        {
          message: "You are not a member of this team",
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    // Fetch all messages
    const { data: messages, error: messagesError } = await supabase
      .from("messages")
      .select("*")
      .eq("team_id", teamId)
      .order("sent_at", { ascending: true });

    if (messagesError) {
      return NextResponse.json(
        {
          message: "Error retrieving messages",
          error: messagesError.message,
        },
        { status: 500 }
      );
    }

    // Decrypt messages
    const decryptedMessages = messages.map((msg: any) => ({
      ...msg,
      content: Decrypt(msg.content),
    }));

    return NextResponse.json({
      message: "Messages retrieved successfully",
      data: decryptedMessages,
    });
  } catch (e: any) {
    return NextResponse.json(
      {
        message: "An error occurred on the server",
        error: e.message,
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/teams/[teamId]/chat/messages
 * Creates a new message with encryption
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ teamId: string }> }
) {
  try {
    const { teamId } = await params;
    const token = (await headers()).get("Authorization");
    const { content } = await req.json();

    // Validate required fields
    if (!token || !content || !teamId) {
      return NextResponse.json(
        {
          message: "Missing required fields",
          error: "Bad request",
        },
        { status: 403 }
      );
    }

    // Decode and verify user
    const user_id = decode_jwt(token);

    // Verify team exists and user is a member
    const { data: team, error: teamError } = await supabase
      .from("teams")
      .select("*")
      .eq("team_id", teamId)
      .maybeSingle();

    if (!team) {
      return NextResponse.json(
        {
          message: "Team not found",
          error: "Not found",
        },
        { status: 404 }
      );
    }

    if (!team.users_id.includes(user_id)) {
      return NextResponse.json(
        {
          message: "You are not a member of this team",
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    // Encrypt the message content
    const encryptedContent = Encrypt(content);

    // Create message object
    const message = {
      content: encryptedContent,
      sender: user_id,
      team_id: teamId,
      reactions: [],
      sent_at: new Date().toISOString(),
    };

    // Save to database
    const { data: savedMessage, error: saveError } = await supabase
      .from("messages")
      .insert([message])
      .select()
      .single();

    if (saveError) {
      return NextResponse.json(
        {
          message: "Error saving message",
          error: saveError.message,
        },
        { status: 500 }
      );
    }

    // Return decrypted message
    return NextResponse.json(
      {
        message: "Message created successfully",
        data: {
          ...savedMessage,
          content: content, // Return original content to sender
        },
      },
      { status: 201 }
    );
  } catch (e: any) {
    return NextResponse.json(
      {
        message: "An error occurred on the server",
        error: e.message,
      },
      { status: 500 }
    );
  }
}
