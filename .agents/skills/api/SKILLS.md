---
project name: Prismaflow
description: SaaS made for developers workflow
main: root/src/app/api
auth: /auth
ai: /ai
stripe: /payments/capture-payment, /webhooks/stripe
resend: /login-warn (In progress)
cancel signup: /security/cancel-signup/[token] (Deprecated)
teams CRUD: /teams/[teamId]
erd: /teams/[teamId]/erd
tickets: /teams/[teamId]/tickets
integrants: /teams/[teamId]/integrants
to do CRUD: /todos
delete account: /users/delete
get account data: /users/me
search account via email: /users/search/[email]
prebuilt error handlers: /handlers.ts
---

# Index

1. [Handlers](#handlers)
2. [Do-Don't](#do---dont)

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
  // Do

  // Imports
  // Database client
  import supabase from "@lib/db";
  // Resender
  import { resend } from "@lib/resend";

  
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
```

4. Now you can write the code, good luck on it!.