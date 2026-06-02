---
Project name: Prismaflow
Frontend folder: src/app/*
Users service document: src/services/user.service.ts
Lib components: src/lib/client/*
---

# Index
[Do-Don't](#do---dont)

# Do - Dont
- **Do** a good error control usign snackbar component, set in src/components/ui/snackbar.ts. For example

``` tsx
// Do

// Prebuilt ui imports
import SnackBar, { showSnackbar } from "@components/ui/snackbar";

//React imports
import { useRef } from "react";

export default function Mypage() {
  const snackbar = useRef(null);

  const handleSubmit = async(e) => {
    e.preventDefault();
    const data = await fetch({
      // Some code...
    })

    // More code...
    const data = await res.json();

    if(res.status === 200) {
      return showSnackbar(data.message, "valid", snackbar)
    }

    return showSnackbar(data.message, res.status >= 500 ? "critic" : "warn", snackbar);

    //It can looks more complex, but in pratice saves errors and is easier to edit
  }

  return (
    <div>
      <Snackbar
      ref={snackbar} />
    </div>
  )
}

// Don't

// React imports
import { useState } from "react";

export default function MyPage() {
  const handleSubmit = async(e) => {
    setContent("");

    // Interesting code...

    setContent("This is a message");

    // More code...

    setContent("")
  }

  return (
    <div>
      <form>
        { /* Some inputs... */ }

        {
          content && (
            <p> {content} </p>
          )
        }
      </form>
    </div>
  )
}
```

- Making a fetch.

``` typescript
// Do
const res = await fetch('/api/', {
  method: 'METHOD', // Always in capital
  headers: {
    "Content-Type": "application/json",
    "x-api-key": process.env.NEXT_PUBLIC_API_KEY! // Always with "!" because the server handle api key errors
  },
  body: JSON.Stringify({
    // Body content
  })
});

// Don't do this
if(process.env.NEXT_PUBLIC_API_KEY) return showSnackbar("Api key not inserted", "critic", snackbar) // Unnecesary

const res = await fetch('/api/', {
  method: 'method',
  headers: {
    "Content-Type": "application/json",
    "x-api-key": process.env.NEXT_PUBLIC_API_KEY
  },
  body: JSON.Stringify({
    // Body content
  })
});

// Or something like this
const res = await fetch('/api/', {
  method: 'method',
  headers: {
    "Content-Type": "application/json",
    // Api key always is required, except for webhooks because only the apps sends specific data and don't need to handle a api key
  },
  body: JSON.Stringify({
    // Body content
  })
});
```

# Making components
When you make a new component (it don't need to be used in many pages) you need to know this:

- `src/app/lib/components`: Only for components imported from node modules that gives the components and only needs configuration.
- `src/components/forms`: Only for forms and their components.
- `src/components/layouts`: Prebuilt layouts (like main pages layout)
- `src/components/screens`: Only for objects that appears in all the screen.
- `src/components/ui`: UI components.
- `src/components/ui/buttons`: Buttons variations.
- `src/components`: Components that don't have a specific usage.