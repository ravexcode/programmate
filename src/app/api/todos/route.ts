//Next imports
import { type NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

//Lib imports
import supabase from "@/lib/db";

//Node modules imports
import { PostgrestSingleResponse } from "@supabase/supabase-js";

//Types imports
import { UserData } from "@/types/user.types";

//------------- Create list handler -------------//
export async function POST(req: NextRequest) {
  try {
    //Gets the new list data
    const { list_title, list_description } = await req.json();
    //Gets the auth token
    const token = (await headers()).get("Authorization");

    //Verifies if data is inserted
    if(!list_title || !list_description) return NextResponse.json({
      message: "Data hasn't been sent correctly",
      error: "Bad request"
    }, {
      status: 403
    });
    //Verifies if token is sent
    if(!token) return NextResponse.json({
      message: "Token hasn't been sent correctly",
      error: "Unauthorized"
    }, {
      status: 401
    });

    //Gets the user's data
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

    //User profile data
    const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle() as PostgrestSingleResponse<UserData> || null;

    //Profile data
    if(!profile) return NextResponse.json({
      message: "User don't found",
      error: "Not found"
    }, {
      status: 404
    });

    //Inserts the new list
    const { error: insertNewListError } = await supabase
    .from("profiles")
    .update({
      to_do_list: [...profile.to_do_list || [], {
        title: list_title,
        description: list_description
      }]
    })
    .eq("id", user.id);

    //Verifies if there's an error
    if(insertNewListError) return NextResponse.json({
      message: insertNewListError.message,
      error: insertNewListError
    }, {
      status: 500
    });

    //Returns success response
    return NextResponse.json({
      message: "List created successfully"
    }, {
      status: 200
    });
  } catch(e: any) {
    //Error handler
    return NextResponse.json({
      message: "Error inside in the server",
      error: e
    }, {
      status: 500
    });
  }
}




//------------- Update list handler -------------//
export async function PUT(req: NextRequest) {
  try {
    //Gets the new list data
    const { list_title, list_description, list_index } = await req.json();
    //Gets the auth token
    const token = (await headers()).get("Authorization");

    //Verifies if data is inserted
    if(!list_title || !list_description || list_index === undefined || list_index === null) return NextResponse.json({
      message: "Data hasn't been sent correctly",
      error: "Bad request"
    }, {
      status: 403
    });
    //Verifies if token is sent
    if(!token) return NextResponse.json({
      message: "Token hasn't been sent correctly",
      error: "Unauthorized"
    }, {
      status: 401
    });

    //Gets the user's data
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

    //User profile data
    const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle() as PostgrestSingleResponse<UserData> || null;

    //Profile data
    if(!profile) return NextResponse.json({
      message: "User don't found",
      error: "Not found"
    }, {
      status: 404
    });

    //Updates the list
    const updated_lists = profile.to_do_list || [];
    updated_lists[list_index] = {
      title: list_title,
      description: list_description
    };

    //Uploads the updated list
    const { error: updateListError } = await supabase
    .from("profiles")
    .update({
      to_do_list: updated_lists
    })
    .eq("id", user.id);

    //Verifies if there's an error
    if(updateListError) return NextResponse.json({
      message: updateListError.message,
      error: updateListError
    }, {
      status: 500
    });

    //Returns success response
    return NextResponse.json({
      message: "List updated successfully"
    });
  } catch(e: any) {
    console.error("Error creating new list:", e);
    //Error handler
    return NextResponse.json({
      message: "Error inside in the server",
      error: e
    }, {
      status: 500
    });
  }
}




//------------- Delete list handler -------------//
export async function DELETE(req: NextRequest) {
  try {
    //Gets the list index
    const { list_index } = await req.json();
    //Gets the auth token
    const token = (await headers()).get("Authorization");

    //Verifies if list index is provided
    if(list_index === undefined || list_index === null) return NextResponse.json({
      message: "List index hasn't been sent correctly",
      error: "Bad request"
    }, {
      status: 403
    });

    //Verifies if token is sent
    if(!token) return NextResponse.json({
      message: "Token hasn't been sent correctly",
      error: "Unauthorized"
    }, {
      status: 401
    });

    //Gets the user's data
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

    //User profile data
    const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle() as PostgrestSingleResponse<UserData> || null;

    //Profile data
    if(!profile) return NextResponse.json({
      message: "User don't found",
      error: "Not found"
    }, {
      status: 404
    });

    //Deletes the list
    const updated_lists = profile.to_do_list || [];
    
    //Verifies if index is valid
    if(list_index < 0 || list_index >= updated_lists.length) return NextResponse.json({
      message: "List index is out of bounds",
      error: "Bad request"
    }, {
      status: 403
    });

    //Removes the list at the specified index
    updated_lists.splice(list_index, 1);

    //Uploads the updated list
    const { error: deleteListError } = await supabase
    .from("profiles")
    .update({
      to_do_list: updated_lists
    })
    .eq("id", user.id);

    //Verifies if there's an error
    if(deleteListError) return NextResponse.json({
      message: deleteListError.message,
      error: deleteListError
    }, {
      status: 500
    });

    //Returns success response
    return NextResponse.json({
      message: "List deleted successfully"
    }, {
      status: 200
    });
  } catch(e: any) {
    console.error("Error deleting list:", e);
    //Error handler
    return NextResponse.json({
      message: "Error inside in the server",
      error: e
    }, {
      status: 500
    });
  }
}