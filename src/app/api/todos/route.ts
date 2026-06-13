//Next imports
import { type NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

//Lib imports
import supabase from "@/lib/db";

//Node modules imports
import { PostgrestSingleResponse } from "@supabase/supabase-js";

//Types imports
import { ToDoList, UserData } from "@/types/user.types";

//Responses imports
import * as Handlers from "@/app/api/handlers";

export async function POST(req: NextRequest) {
  try {
    //Gets the new list data
    const { list_title, list_description, tags } = await req.json();
    //Gets the auth token
    const token = (await headers()).get("Authorization");

    //Verifies if data is inserted
    if(!list_title || !list_description) return Handlers.badRequestErrorHandler();

    //Verifies if token is sent
    if(!token) return Handlers.unauthorizedErrorHandler("Authorization token not inserted");

    //Gets the user's data
    const { data: { user }, error: getUserError } = await supabase.auth.getUser(token);

    //Verifies if the user has been returned
    if(!user) return Handlers.notFoundErrorHandler("Account not found");

    //Verifies if there's an error
    if(getUserError) return Handlers.unauthorizedErrorHandler(getUserError.message);

    //User profile data
    const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle() as PostgrestSingleResponse<UserData> || null;

    //Profile data
    if(!profile) return Handlers.notFoundErrorHandler("Profile not found");

    //Inserts the new list
    const { error: insertNewListError } = await supabase
    .from("profiles")
    .update({
      to_do_list: [...profile.to_do_list || [], {
        title: list_title,
        description: list_description,
        tags
      }]
    })
    .eq("id", user.id);

    //Verifies if there's an error
    if(insertNewListError) return Handlers.supabaseErrorHandler(insertNewListError);

    //Returns success response
    return NextResponse.json({
      message: "List created successfully"
    }, {
      status: 200
    });

  } catch(e: unknown) {
    //Error handler
    return Handlers.serverErrorHandler(e);
  }
}

export async function PUT(req: NextRequest) {
  try {
    //Gets the new list data
    const { list_index, tasks, content } = await req.json();
    //Gets the auth token
    const token = (await headers()).get("Authorization");

    //Verifies if data is inserted
    if(
      list_index === undefined ||
      list_index === null
    ) return Handlers.badRequestErrorHandler();

    //Verifies if token is sent
    if(!token) return Handlers.unauthorizedErrorHandler("Authorization token not inserted");

    //Gets the user's data
    const { data: { user }, error: getUserError } = await supabase.auth.getUser(token);

    //Verifies if the user has been returned
    if(!user) return Handlers.notFoundErrorHandler("Account not found");

    //Verifies if there's an error
    if(getUserError) return Handlers.unauthorizedErrorHandler(getUserError.message);

    //User profile data
    const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle() as PostgrestSingleResponse<UserData> || null;

    if(!profile) return Handlers.notFoundErrorHandler("Profile not found");

    //Updates the list
    const updated_lists = profile.to_do_list || [];
    
    //Changes the update type
    if(content) {
      //List data
      updated_lists[list_index].title = content.title;
      updated_lists[list_index].description = content.description;
      updated_lists[list_index].tags = content.tags;
    } else if(tasks) {
      //List tasks
      updated_lists[list_index].tasks = tasks;
    }

    //Uploads the updated list
    const { error: updateListError } = await supabase
    .from("profiles")
    .update({
      to_do_list: updated_lists
    })
    .eq("id", user.id);

    //Verifies if there's an error
    if(updateListError) return Handlers.supabaseErrorHandler(updateListError);

    //Returns success response
    return NextResponse.json({
      message: "List updated successfully"
    });
  } catch(e: unknown) {
    return Handlers.serverErrorHandler(e);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    //Gets the list index
    const { list_index } = await req.json();
    //Gets the auth token
    const token = (await headers()).get("Authorization");

    //Verifies if list index is provided
    if(list_index === undefined || list_index === null) return Handlers.badRequestErrorHandler();

    //Verifies if token is sent
    if(!token) return Handlers.unauthorizedErrorHandler("Authorization token not inserted");

    //Gets the user's data
    const { data: { user }, error: getUserError } = await supabase.auth.getUser(token);

    //Verifies if the user has been returned
    if(!user) return Handlers.notFoundErrorHandler("Account not found");

    //Verifies if there's an error
    if(getUserError) return Handlers.unauthorizedErrorHandler(getUserError.message);

    //User profile data
    const { data: profile, error: getProfileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

    if(!profile) return Handlers.notFoundErrorHandler("Profile not found");
    if(getProfileError) return Handlers.supabaseErrorHandler(getProfileError);

    //Deletes the list
    const updated_list = profile.to_do_list.filter((_: any, i: number) => i !== list_index);

    //Uploads the updated list
    const { error: deleteListError } = await supabase
    .from("profiles")
    .update({
      to_do_list: updated_list
    })
    .eq("id", user.id);

    //Verifies if there's an error
    if(deleteListError) return Handlers.supabaseErrorHandler(deleteListError);

    //Returns success response
    return NextResponse.json({
      message: "List deleted successfully"
    }, {
      status: 200
    });
  } catch(e: unknown) {
    return Handlers.serverErrorHandler(e);
  }
}