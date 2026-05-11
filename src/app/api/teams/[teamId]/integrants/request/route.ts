//Next imports
import { type NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

//Lib imports
import supabase from "@/lib/db";
import { resend } from "@/lib/resend";

//Resend templates
import { RequestTemplate } from "@/resend/templates";

//Types imports
import { ParamsType } from "@/app/api/teams/[teamId]/params.type";

//Handlers imports
import {
  serverErrorHandler,
  notFoundErrorHandler,
  supabaseErrorHandler,
  unauthorizedErrorHandler,
  badRequestErrorHandler,
  resendErrorHandler
} from "@/app/api/handlers";

//Send request
export async function POST(req: NextRequest, { params }: ParamsType) {
  try {
    //Gets the data
    const token = (await headers()).get("Authorization");
    const { requested_email } = await req.json();
    const { teamId } = await params;

    if(!requested_email || !teamId) return badRequestErrorHandler();

    if(!token) return unauthorizedErrorHandler("Authorization token not inserted");

    //Gets the user from Supabase Auth
    const { data: { user }, error: getUserError } = await supabase.auth.getUser(token);

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
    if(!team) return notFoundErrorHandler("Team don't found");

    //Verifies if there's no error
    if(getTeamError) return supabaseErrorHandler(getTeamError);

    //Verifies if the user is in the team
    if(!team?.integrants_id.includes(user.id)) return unauthorizedErrorHandler("You aren't in the team");

    //Searchs the user
    const { data: requested, error: getRequestedError } = await supabase
    .from("profiles")
    .select("*")
    .eq("email", requested_email)
    .maybeSingle();

    //Error handlers
    if(!requested) return notFoundErrorHandler("Profile don't found");

    console.log(requested)

    //Sends the email
    const { error: resendError } = await resend
    .emails
    .send({
      from: 'Prismaflow <noreply@ravexcode.com>',
      to: requested_email,
      subject: "Request recivied",
      react: RequestTemplate({
        username: requested.display_name,
        link: `${process.env.API_URL ?? "http://localhost:3000"}/teams/${teamId}/accept-request`
      })
    });

    //Error handlers
    if(resendError) return resendErrorHandler(resendError);

    //Updates user
    const { error: saveRequestError } = await supabase
    .from("profiles")
    .update({
      requests: [
        ...requested.requests || [],
        {
          name: team.name,
          id: teamId,
          sent_at: new Date()
        }
      ]
    })
    .eq("id", user.id);

    if(saveRequestError) return supabaseErrorHandler(saveRequestError);

    //Success response
    return NextResponse.json({ message: "Request sent successfully!" });
  } catch(e: unknown) {
    console.error(e);

    serverErrorHandler(e);
  }
}

export async function DELETE(req: NextRequest, { params }: ParamsType) {
  try {
    //Gets the data
    const token = (await headers()).get("Authorization");
    const { request_index } = await req.json();
    const { teamId } = await params;

    if(!request_index || !teamId) return badRequestErrorHandler();

    if(!token) return unauthorizedErrorHandler("Authorization token not inserted");

    //Gets the user from Supabase Auth
    const { data: { user }, error: getUserError } = await supabase.auth.getUser(token);

    //Verifies if the user has been returned
    if(!user) return notFoundErrorHandler("User not found");

    //Verifies if there's an error
    if(getUserError) return unauthorizedErrorHandler(getUserError.message);

    //Searchs the user
    const { data: profile, error: getRequestedError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

    //Error handlers
    if(!profile) return notFoundErrorHandler("Profile don't found");

    if(getRequestedError) return supabaseErrorHandler(getRequestedError);

    //Delete request
    const updatedRequests = profile.request.filter(
      (
        _ : unknown,
        index : number
      ) => index !== request_index
    );

    //Sets the value in the user
    const { error: updateUserError } = await supabase
    .from("profiles")
    .update({
      requests: updatedRequests
    })
    .eq("id", user.id);

    if(updateUserError) return supabaseErrorHandler(updateUserError);

    //Returns success
    return NextResponse.json({ message: "Request deleted successfully" });
  } catch(e: unknown) {
    return serverErrorHandler(e);
  }
}