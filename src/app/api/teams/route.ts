//Lib imports
import supabase from "@/lib/db";

//Dependences imports
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

//User library imports
import * as jwt from "jsonwebtoken";
import Team from "@/modules/team.types";

//Env constants
const jwtSecret : string | undefined = process.env.JWT_SECRET;

export async function POST(req: NextRequest) {
  try {
    //User data for log in
    const headersList = await headers();
    const token = headersList.get("Authorization");
    const { name, description } = await req.json();

    //If isn't sent we return an error
    if(!token || !name || !description ) return NextResponse.json({
      message: "Data not sent correctly",
      error: "Bad request"
    }, {
      status: 403
    });

    //Looks if jwtSecret key is inserted
    if(!jwtSecret) throw new Error("JWT Secret Key no inserted");
    const decoded = jwt.verify(token, jwtSecret) as { id: string };
    //If the token is wrong returns error
    if(!decoded?.id) return NextResponse.json({
      message: "Invalid token",
      error: "Unauthorized"
    }, {
      status: 401
    });

    //Searchs the user
    const { data : user } = await supabase
    .from("users")
    .select("id, plan, teams")
    .eq("id", decoded.id)
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
      [ parseInt(decoded.id) ], //Users id
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