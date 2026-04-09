//Lib imports
import supabase from "@/lib/db";

//Dependences imports
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

//User library imports
import * as jwt from "jsonwebtoken";
import Team from "@/modules/team.types";


//Functions imports
import { decode_jwt } from "@/functions/jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    //User data for log in
    const token = (await headers()).get("Authorization");
    const { name, description } = await req.json();

    //If isn't sent we return an error
    if(!token || !name || !description ) return NextResponse.json({
      message: "Data not sent correctly",
      error: "Bad request"
    }, {
      status: 403
    });

    //Looks if jwtSecret key is inserted
    const user_id = decode_jwt(token)

    //Searchs the user
    const { data : user } = await supabase
    .from("users")
    .select("id, plan, teams")
    .eq("id", user_id)
    .maybeSingle();

    //Looks if the user exists
    if(!user) return NextResponse.json({
      message: "User not found",
      error: "Not found"
    }, {
      status: 404
    });

    //Looks if the user can create proyects
    const teamsCount = Array.isArray(user.teams) ? user.teams.length : 0;
    if(user.plan === "free" && teamsCount >= 2) return NextResponse.json({
      message: "Proyects limit reached",
      error: "Bad request"
    }, {
      status: 403
    });

    //We create the team
    const team = new Team(
      name, //Name
      description, //Description
      [ user_id ], //Users id
      new Date(), //Creation date
    );

    //Saves the team to user data
    const { data: savedTeamData, error: saveTeamError } = await supabase
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

    //Puts the updatedTeams
    const updatedTeams = Array.isArray(user.teams) 
      ? [...user.teams, savedTeamData.team_id] 
      : [savedTeamData.team_id];

    //Saves the team in the user data
    const { error: updateUserTeamsError } = await supabase
    .from("users")
    .update({ teams: updatedTeams })
    .eq("id", user.id);

    //Looks if there's an error
    if(updateUserTeamsError) return NextResponse.json({
      message: "An error has happened while we tried to update your user.",
      error: updateUserTeamsError.message
    }, {
      status: 500
    });

    //If all is OK returns success
    return NextResponse.json({
      message: "Team created successfully",
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
    const { teamId, newName, newDescription } = await req.json();
    const token = (await headers()).get("Authorization");

    //Verifies if the darta is OK
    if(!teamId || !token || (!newName && !newDescription)) return NextResponse.json({
      message: "Data sent error",
      error: "Bad request"
    }, {
      status: 403
    });

    //Verifies the token
    const user_id = decode_jwt(token);

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
    if(!team?.users_id.includes(user_id)) return NextResponse.json({
      message: "Oops... You aren't in the team",
      error: "Unauthorized"
    }, {
      status: 401
    });

    //Do the function from the data inserted
    if(newName && newDescription) {
      //Saves the value in the DB
      const { error: updateTeamError } = await supabase
      .from("teams")
      .update({
        name: newName,
        description: newDescription
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
        message: "Team updated in both data"
      });
    };


    if(newName) {
      //Saves the value in the DB
      const { error: updateTeamError } = await supabase
      .from("teams")
      .update({
        name: newName
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
        message: "Team name updated"
      });
    };


    if(newDescription) {
      //Saves the value in the DB
      const { error: updateTeamError } = await supabase
      .from("teams")
      .update({
        description: newDescription
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
        message: "Team description updated"
      });
    };

    //Error handler
    return NextResponse.json({
      message: "An error has happened",
      error: "Bad request",
      data_inserted: {
        name: newName,
        description: newDescription
      }
    }, {
      status: 500
    });
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

//Delete the team function
export async function DELETE(req: NextRequest){
  try {
    //Gets the data
    const { teamId } = await req.json();
    const token = (await headers()).get("Authorization");

    //Verifies if the darta is OK
    if(!teamId || !token) return NextResponse.json({
      message: "Data sent error",
      error: "Bad request"
    }, {
      status: 403
    });

    //Verifies the token
    const user_id = decode_jwt(token);

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
    if(!team?.users_id.includes(user_id)) return NextResponse.json({
      message: "Oops... You aren't in the team",
      error: "Unauthorized"
    }, {
      status: 401
    });

    //If all is ok, deletes the team
    const { error: deleteTeamError } = await supabase
    .from("teams")
    .delete()
    .eq("team_id", teamId);

    //Verifies if there's no error
    if(deleteTeamError) return NextResponse.json({
      message: "Trying to get team error",
      error: deleteTeamError.message
    }, {
      status: 500
    });

    //If everything is fine, returns success message
    return NextResponse.json({
      message: "Team deleted successfully"
    });
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