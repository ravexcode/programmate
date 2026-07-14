//Lib imports
import supabase from "@/lib/db";

//Next imports
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

//Handlers imports
import {
  serverErrorHandler,
  notFoundErrorHandler,
  supabaseErrorHandler,
  unauthorizedErrorHandler,
  badRequestErrorHandler
} from "@/app/api/handlers";

export async function POST(req: NextRequest) {
  try {
    //User data for log in
    const token = (await headers()).get("Authorization");
    const { name, description, integrants, tags, status } = await req.json();

    //Verifies if the data is OK
    if(!name || !description || !integrants || !tags || !status) return badRequestErrorHandler();

    if(!token) return unauthorizedErrorHandler("Authorization token not inserted");

    //Gets the user from Supabase Auth
    const { data: { user }, error: getUserError } = await supabase.auth.getUserService({router});

    //Verifies if the user has been returned
    if(!user) return notFoundErrorHandler("User not found");

    //Verifies if there's an error
    if(getUserError) return unauthorizedErrorHandler(getUserError.message);

    //Gets the data
    const { data: profile } = await supabase
    .from("profiles")
    .select("id, plan")
    .eq("id", user.id)
    .maybeSingle();

    //Verifies if the user can create projects
    if(profile && profile.plan === "free") {
      const { data: teams } = await supabase
      .from("teams")
      .select("team_id")
      .contains("users_id", [user.id]);

      if(teams && teams.length >= 2) return unauthorizedErrorHandler("Projects limit reached");
    }
    
    //Creates the team
    const team = {
      name,
      description,
      integrants: integrants,
      integrants_id: integrants.map((integrant: any) => integrant.id),
      created_at: new Date(),
      tags,
      kanban_board: {
        "todo": [],
        "inprogress": [],
        "done": [],
        "verified": []
      },
      status
    };

    //Saves the team to user data
    const { data: newTeam, error: saveTeamError } = await supabase
    .from("teams")
    .insert([team])
    .select()
    .single();

    //Looks if there's an error
    if(saveTeamError) return supabaseErrorHandler(saveTeamError);

    //If all is OK returns success
    return NextResponse.json({
      message: "Team created successfully",
      team: newTeam
    })
  } catch(e: any) {
    //Server errors
    return NextResponse.json({
      message: "An error has happened in the server",
      error: e.message
    }, {
      status: 500
    });
  }
}


//Updates the team
export async function PUT(req: NextRequest){
  try {
    //Gets the data
    const { teamId, newName, newDescription, newStatus, newTags } = await req.json();

    const token = (await headers()).get("Authorization");

    //Verifies if the data is OK
    if(!teamId || (!newName && !newDescription && newStatus && newTags)) return badRequestErrorHandler();

    if(!token) return unauthorizedErrorHandler("Authorization token not inserted");

    //Gets the user from Supabase Auth
    const { data: { user }, error: getUserError } = await supabase.auth.getUserService({router});

    //Verifies if the user has been returned
    if(!user) return notFoundErrorHandler("User not found");

    //Verifies if there's an error
    if(getUserError) return unauthorizedErrorHandler(getUserError.message);

    //Gets the team data
    const { data: team, error: getTeamError } = await supabase
    .from("teams")
    .select("*")
    .eq("team_id", teamId)
    .maybeSingle();

    //Verifies if the team data has been gotten
    if(!team) return notFoundErrorHandler("Team not found");

    //Verifies if there's no error
    if(getTeamError) return supabaseErrorHandler(getTeamError);

    //Verifies if the user is in the team
    if(!team?.integrants_id.includes(user.id)) return unauthorizedErrorHandler("You're not in the team");

    //Saves the value in the DB
    const { error: updateTeamError } = await supabase
    .from("teams")
    .update({
      name: newName,
      description: newDescription,
      status: newStatus,
      tags: newTags,
    })
    .eq("team_id", teamId);

    //Verifies if there's no error
    if(updateTeamError) return supabaseErrorHandler(updateTeamError);

    //if all is ok returns success msg
    return NextResponse.json({
      message: "Team updated"
    });
  } catch(e: unknown) {
    serverErrorHandler(e);
  }
}