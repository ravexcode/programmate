---
project name: NexZero
description: SaaS made for developers workflow
code language: TypeScript
text language: English (USA)
framework: NextJS v16.2.6
main: root/src/app/api
auth: /auth
ai: /ai
stripe: /payments/capture-payment, /webhooks/stripe
teams CRUD: /teams/[teamId]
erd: /teams/[teamId]/erd
tickets: /teams/[teamId]/tickets
integrants: /teams/[teamId]/integrants
integrants change role: /teams/[teamId]/integrants/change-role (PATCH)
integrants remove member: /teams/[teamId]/integrants/remove-member (DELETE)
to do CRUD: /todos
delete account: /users/delete
get account data: /users/me
search account via email: /users/search/[email]
prebuilt error handlers: /handlers.ts
database used: Supabase SQL Free Tier
database import: "@lib/db"
render import: "@lib/render"
tab spaces: 2
---

# Index

1. [Handlers](#handlers)
2. [Do-Don't](#do---dont)
3. [Supabase Arquitecture](#supabase)
4. [Team endpoint example](#team-example)

- Remeber ever asking if you don't know something about the project, stop your process and make the question.

# Handlers

- Location: @/app/api/handlers.ts

- **Important:** If you want to add a new handler, ask before for the update

1. Template ( Prevent usage when you have more options ):

``` typescript
  // Handle error
  if(error) return errorTemplate(
    "This is a error!",
    error,
    500 // Status error
  );
```

2. Server error ( Recomended to use in catch error types ):

``` typescript
  // Handle error
  try {
    // A really interesting code...
  } catch(e: Unknown) {
    return serverErrorHandler(e);
  }
```

3. Supabase error handler ( Don't use it in supabase auth errors ):

``` typescript
  // Handle error
  if(supabase_error) return supabaseErrorHandler(supabase_error);
```

4. Not found:

``` typescript
  // Handle error
  if(!content) return notFoundErrorHandler("Content not found!");
```

5. Unauthorized error ( You have 2 cases to use it ):

``` typescript
  // Token not inserted
  if(!token) return unauthorizedErrorHandler("Authorization token not inserted");

  // A really interesting code...

  // Supabase auth error
  if(supabase_auth_error) return unauthorizedErrorHandler(supabase_auth_error.message);
```

6. Bad request:

``` typescript
  // Handle error
  if(!content_inserted) return badRequestErrorHandler();
  //It sents the data automatically
```

7. Bad request:

``` typescript
  // Handle error
  if(resend_error) return resendErrorHandler(resend_error);
```


# Do - Don't

Handling a error:

``` typescript
  // Do

  import { serverErrorHandler } from "@api/handlers";

  export async function METHOD(req: NextRequest){
    try {
      //Code ...
    } catch(e: unknown) {
      //Setting error type as unknown is very important

      //Automatic error filter (from error to not handled error)
      return serverErrorHandler(e);
    }
  }

  // Don't

  import NextResponse from "next/server";

  export async function METHOD(req: NextRequest){
    try {
      //Code ...
    } catch(e: any) {
      return NextResponse.json({
        message: "Server error",
        error: e
      }, {
        status: 500
      });
    }
  }
```

Creating a new endpoint:

1. Make the route based in folders ( ex. endpoint **/api/status** located in **@/app/api/status** )

2. Take a look for techs to be used and import the respective error handlers for example:

  - I will send an email to user
  - I'm going to use Resend as email provider
  - I need to verify user authorization so i need to use Supabase and Supabase auth

``` typescript
  // Do

  // Imports
  import {
    serverErrorHandler, // Server errors
    resendErrorHandler, // Resend error
    unauthorizedErrorHandler, // In case that the user don't set the token auth or token is invalid
    notFoundErrorHandler // User not found
  } from "@api/handlers";

  // Don't

  import NextResponse from "next/server";

  // A interesting code!...

  // And then make the same code for the same error type without reason
  if(error_1) return NextResponse.json({
    //...
  })

  if(error_2) return NextResponse.json({
    //...
  })

  if(error_3) return NextResponse.json({
    //...
  })
```

3. Now import the node modules:

  - Always check in @/lib if a file for that especific module, like resend, openRouter, stripe and more!

``` typescript
  // Don't

  // Innecesary imports
  import { createClient } from "@supabase/supabase-js";

  // Verify credentials existing...

  // Make the client
  const client = createClient(
    // Credentials
  )

  import { Resend } from "resend";

  // Reverify credentials...

  const resend = new Resend(
    // Credentials
  )

  // Do

  // Imports
  // Database client
  import supabase from "@lib/db";
  // Resender
  import { resend } from "@lib/resend";
```

4. Comenting code:

  - Always try to go more to the point instead of comenting all the code lines, for example:

``` typescript
  //Don't

  //Next imports
  import { NextRequest, NextResponse } from "next/server";
  //Supabase imports
  import { supabase } from "@lib/db";
  //Resend imports
  import { resend } from "@lib/resend";
  //Server error hanlder imports
  import {
    serverErrorHandler
  } from "@api/handlers";

  //GET enpoint
  export async function GET(req) {
    //Try - catch for catching errors
    try {
      //Some stuff...

      //Gets the user's profile
      const { data: profile, error: getProfileError } = await supabase
      //Table
      .from("profiles")
      //Rows selected
      .select("*")
      //Validator
      .eq("id", id)
      //It can be single or null
      .maybeSingle();

      //And more code...

      //Error handler
    } catch(e) { 
      //Handler usage
      serverErrorHandler(e);
    }

  
  //Do

  //Next imports
  import { NextRequest, NextResponse } from "next/server";

  //Lib imports
  import { supabase } from "@lib/db";
  import { resend } from "@lib/resend";

  //Handlers imports
  import {
    serverErrorHandler
  } from "@api/handlers";

  export async function GET(req) {
    try {
      //Some stuff...

      const { data: profile, error: getProfileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .maybeSingle();

      //And more code...
    } catch(e) {
      serverErrorHandler(e);
    }
  }
```
 - The second example is less comments but it still having comments, more for using CTRL + F and find the code that is searching the dev.

# Supabase
  - Tables:
    1. profiles
    2. teams
    3. payments
    4. reports
    5. sugestions
  
  - Supabase is used with SupabaseAuth. Current providers included:
    1. Github
    2. Google
    3. GitLab
  
  - Tables definition
    1. **profiles**
    ``` sql
    create table public.profiles (
      id uuid not null,

      email character varying not null,

      created_at timestamp with time zone null default now(),

      display_name text null,

      daily_requests numeric not null default '0'::numeric,

      last_updated timestamp with time zone not null default (now() AT TIME ZONE 'utc+0'::text),

      ai_chat jsonb[] null,

      to_do_list jsonb[] null,

      requests jsonb[] null,

      avatar_url text null,

      constraint profiles_pkey primary key (id),

      constraint profiles_email_key unique (email),

      constraint profiles_id_fkey foreign KEY (id) references auth.users (id) on delete CASCADE
    ) TABLESPACE pg_default;
    ```
    
    2. **teams**
    ``` sql
    create table public.teams (
      team_id bigint generated by default as identity not null,

      integrants jsonb[] not null,

      chat jsonb[] null,

      kanban_board jsonb null,

      created_at timestamp with time zone not null default now(),

      description text null,

      name text null,

      integrants_id text[] null,

      tags text[] null,

      status text null,

      tickets jsonb[] null,

      calendar jsonb[] null,

      "ERD" jsonb[] null,

      "ERD_connections" jsonb[] null,

      json_views jsonb[] null,

      constraint teams_pkey primary key (team_id)
    ) TABLESPACE pg_default;
    ```

    3. **payments**
    ``` sql
    create table public.payments (
      id bigint generated by default as identity not null,

      user_id text not null,

      payment_type text not null,

      payment numeric not null,

      paid_at timestamp with time zone not null default now(),

      plan text not null default 'free'::text,

      constraint payments_pkey primary key (id)
    ) TABLESPACE pg_default;
    ```

    4. **reports**
    ``` sql
    create table public.reports (
      id bigint generated by default as identity not null,

      title text not null,

      description text null,

      steps text not null,

      version text null,

      error_date text not null,

      email text null,

      screenshot_url text null,

      status text not null default 'New'::text,
      reported_at timestamp with time zone not null default now(),

      constraint reports_pkey primary key (id)
    ) TABLESPACE pg_default;
    ```
    
    5. **sugestions**
    ``` sql
    create table public.sugestions (
      id bigint generated by default as identity not null,

      title text not null,

      description text null,

      email text null,

      status text null default 'New'::text,

      sent_at timestamp with time zone not null default now(),

      constraint sugestions_pkey primary key (id)
    ) TABLESPACE pg_default;
    ```

# Team example

  - This is only a example, you will add more or less code depending of the case

  ```typescript
  //Next imports
  import { NextRequest, NextResponse } from "next/server";
  import { headers } from "next/headers";

  //Handlers imports
  import {
    serverErrorHandler,
    badRequestErrorHandler,
    notFoundErrorHandler,
    supabaseErrorHandler,
    unauthorizedErrorHandler
  } from "@api/handlers"; 

  //Lib imports
  import supabase from "@/lib/db";

  //Types imports
  import { ParamsType } from "@api/teams/[teamId]/params.type";

  export async function GET({ params }: ParamsType, req: NextRequest) {
    try {
      const { teamId } = await params;
      const token = (await headers()).get("Authorization");
      
      if (!teamId) return badRequestErrorHandler();
      if(!token) return unauthorizedErrorHandler("Authorization token not inserted");

      const { data: { user }, error: getUserError } = await supabase.auth.getUser(token);

      if(!user) return notFoundErrorHandler("User data not found");
      if(getUserError) return unauthorizedErrorHandler("Authorization token expired");

      const { data: team, error: getTeamError } = await supabase
      .from("teams")
      .select("*")
      .eq("team_id", teamId)
      .maybeSingle();

      if(!team) return notFoundErrorHandler("Team not found");
      if(getTeamError) return supabaseErrorHandler(getTeamError);

      if(team.integrants_id.includes(user.id)) return unauthorizedErrorHandler("You're not in the team");

      return NextResponse.json({
        message: "Events got successfully!",
        calendar: team.calendar
      });
    } catch (error: unknown) {
      return serverErrorHandler(error);
    }
  }
  ```