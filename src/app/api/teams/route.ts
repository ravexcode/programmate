//Lib imports
import supabase from "@/lib/db";

//Next imports
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

//Types imports
import { PostgrestSingleResponse } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  try {
    //User data for log in
    const token = (await headers()).get("Authorization");
    const { name, description, integrants, tags, status } = await req.json();

    console.log(name, description, integrants, tags, status);

    //If isn't sent we return an error
    if(!token || !name || !description || !integrants || !tags || !status ) return NextResponse.json({
      message: "Data not sent correctly",
      error: "Bad request"
    }, {
      status: 403
    });

    //Gets the user from Supabase Auth
    const { data: { user }, error: getUserError } = await supabase.auth.getUser(token);

    //Verifies if the user has been returned
    if(!user) return NextResponse.json({
      message: "User not found",
      error: "Not found"
    }, {
      status: 404
    });

    //Verifies if there's an error
    if(getUserError) return NextResponse.json({
      message: getUserError.message,
      error: getUserError
    }, {
      status: 500
    });

    //Gets user profile to check plan and teams
    //Profile type
    interface Profile {
      id: string,
      plan: string
    }

    //Gets the data
    const { data: profile } = await supabase
    .from("profiles")
    .select("id, plan")
    .eq("id", user.id)
    .maybeSingle() as PostgrestSingleResponse<Profile> || null;

    //Verifies if the user can create projects
    if(profile && profile.plan === "free") {
      const { data: teams } = await supabase
      .from("teams")
      .select("team_id")
      .contains("users_id", [user.id]);

      if(teams && teams.length >= 2) return NextResponse.json({
        message: "Projects limit reached",
        error: "Bad request"
      }, {
        status: 403
      });
    }
    
    //We create the team
    const team = {
      name,
      description,
      integrants: integrants,
      integrants_id: integrants.map((integrant: any) => integrant.id),
      created_at: new Date(),
      tags,
      status
    };

    //Saves the team to user data
    const { data: newTeam, error: saveTeamError } = await supabase
    .from("teams")
    .insert([team])
    .select()
    .single();

    //Looks if there's an error
    if(saveTeamError) return NextResponse.json({
      message: "Can't save the teams, try again later.",
      error: saveTeamError.message
    }, {
      status: 500
    });

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
    if(!teamId || !token || (!newName && !newDescription && newStatus && newTags)) return NextResponse.json({
      message: "Data sent error",
      error: "Bad request"
    }, {
      status: 403
    });

    //Gets the user from Supabase Auth
    const { data: { user }, error: getUserError } = await supabase.auth.getUser(token);

    //Verifies if the user has been returned
    if(!user) return NextResponse.json({
      message: "User not found",
      error: "Not found"
    }, {
      status: 404
    });

    //Verifies if there's an error
    if(getUserError) return NextResponse.json({
      message: getUserError.message,
      error: getUserError
    }, {
      status: 500
    });

    //Gets the team data
    const { data: team, error: getTeamError } = await supabase
    .from("teams")
    .select("*")
    .eq("team_id", teamId)
    .maybeSingle();

    //Verifies if the team data has been gotten
    if(!team) return NextResponse.json({
      message: "The team doesn't exists",
      error: "Not found"
    }, {
      status: 404
    });

    //Verifies if there's no error
    if(getTeamError) return NextResponse.json({
      message: "Trying to get team error",
      error: getTeamError.message
    }, {
      status: 500
    });

    //Verifies if the user is in the team
    if(!team?.integrants_id.includes(user.id)) return NextResponse.json({
      message: "Oops... You aren't in the team",
      error: "Unauthorized"
    }, {
      status: 401
    });

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
    if(updateTeamError) return NextResponse.json({
      message: "Trying to update team error",
      error: updateTeamError.message
    }, {
      status: 500
    });

    //if all is ok returns success msg
    return NextResponse.json({
      message: "Team updated"
    });
  } catch(e: any) {
    console.error(e);

    //Server errors
    return NextResponse.json({
      message: "An error has happened in the server",
      error: e.message
    }, {
      status: 500
    });
  }
}