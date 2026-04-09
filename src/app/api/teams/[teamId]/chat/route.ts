// Lib imports
import supabase from "@/lib/db";

// Dependencies imports
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

// User library imports
import { decode_jwt } from "@/functions/jsonwebtoken";
import { Decrypt } from "@/functions/crypto";

//Function for getting the messages
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ teamId: string }> }
) {
  try {
    const { teamId } = await params;
    const token = (await headers()).get("Authorization");

    // Get pagination params
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = (page - 1) * limit;

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

    // Get total message count
    const { count: totalMessages, error: countError } = await supabase
      .from("messages")
      .select("*", { count: "exact", head: true })
      .eq("team_id", teamId);

    if (countError) {
      return NextResponse.json(
        {
          message: "Error counting messages",
          error: countError.message,
        },
        { status: 500 }
      );
    }

    // Fetch messages with pagination
    const { data: messages, error: messagesError } = await supabase
      .from("messages")
      .select("*")
      .eq("team_id", teamId)
      .order("sent_at", { ascending: true })
      .range(offset, offset + limit - 1);

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
      content: Decrypt(msg),
    }));

    // Calculate pagination info
    const totalPages = Math.ceil((totalMessages || 0) / limit);

    return NextResponse.json({
      message: "Chat retrieved successfully",
      data: {
        team_id: teamId,
        team_name: team.name,
        messages: decryptedMessages,
        pagination: {
          currentPage: page,
          pageSize: limit,
          totalMessages: totalMessages || 0,
          totalPages,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      },
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
 * POST /api/teams/[teamId]/chat
 * Initialize or create a chat for a team
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ teamId: string }> }
) {
  try {
    const { teamId } = await params;
    const token = (await headers()).get("Authorization");
    const body = await req.json();
    const { action } = body;

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

    // Different actions for POST
    if (action === "initialize") {
      // Initialize chat for the team
      const { error: updateError } = await supabase
        .from("teams")
        .update({ chat: [] })
        .eq("team_id", teamId);

      if (updateError) {
        return NextResponse.json(
          {
            message: "Error initializing chat",
            error: updateError.message,
          },
          { status: 500 }
        );
      }

      return NextResponse.json({
        message: "Chat initialized successfully",
        data: {
          team_id: teamId,
          chat: [],
        },
      });
    }

    if (action === "get-stats") {
      // Get chat statistics
      const { data: messages, error: messagesError } = await supabase
        .from("messages")
        .select("sender, sent_at")
        .eq("team_id", teamId);

      if (messagesError) {
        return NextResponse.json(
          {
            message: "Error retrieving chat stats",
            error: messagesError.message,
          },
          { status: 500 }
        );
      }

      // Calculate stats
      const totalMessages = messages.length;
      const uniqueSenders = new Set(messages.map((m: any) => m.sender)).size;
      const oldestMessage = messages.length > 0 ? messages[0].sent_at : null;
      const newestMessage = messages.length > 0 ? messages[messages.length - 1].sent_at : null;

      return NextResponse.json({
        message: "Chat statistics retrieved successfully",
        data: {
          team_id: teamId,
          stats: {
            totalMessages,
            uniqueSenders,
            oldestMessage,
            newestMessage,
          },
        },
      });
    }

    // Default action
    return NextResponse.json(
      {
        message: "Invalid action",
        error: "Bad request",
        availableActions: ["initialize", "get-stats"],
      },
      { status: 400 }
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

/**
 * DELETE /api/teams/[teamId]/chat
 * Delete entire chat history for a team
 */
export async function DELETE(
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

    // Delete all messages in the chat
    const { error: deleteError } = await supabase
      .from("messages")
      .delete()
      .eq("team_id", teamId);

    if (deleteError) {
      return NextResponse.json(
        {
          message: "Error deleting chat",
          error: deleteError.message,
        },
        { status: 500 }
      );
    }

    // Reset chat in team
    const { error: updateError } = await supabase
      .from("teams")
      .update({ chat: [] })
      .eq("team_id", teamId);

    if (updateError) {
      return NextResponse.json(
        {
          message: "Error updating team chat",
          error: updateError.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Chat deleted successfully",
      data: {
        team_id: teamId,
        deleted_messages: true,
      },
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