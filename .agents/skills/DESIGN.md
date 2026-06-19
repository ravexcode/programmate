---
CSS libraries: TailwindCSS v4, Tailwind Animations by Midudev
Animations file: root/src/app/animations.css
Settings file: root/src/app/config.css
Tailwind file: root/src/app/global.css
External prebuilt components: Not imported
Internal prebuilt components: root/src/components
---

# Do - Don't

1. **Always** use NextJS components like Image from "next/image" or Link from "next/link" like NextJS Docs sets the usage and component data requirements
2. **Always** check the @components/ folder before doing a new component or add a new before repeating it.
3. **Never** show important keys in frontend, always in .env


# Desing

1. Setting pages
``` tsx
"use client"; //Important!

import PageLayout from "@components/layouts/page";
import SmoothProvider from "@/lib/components/lennis";

export default function ThisPage() {
  return (
    <PageLayout>
      <SmoothProvider />

      <main>

        {/* Page content */}

      </main>
    </PageLayout>
  )
}
```

2. Building a component:
``` tsx
return (
  <section
  className="w-your-width px-4 py-2 bg-neutral-950 rounded-xl border border-neutral-800 duration-300 hover:border-main hover:-translate-y-1" >
    {/* Use p for prevent SEO problems */}
    <p
    className="text-3xl font-semibold tracking-wider" >
      Title
    </p>
    <p
    className="text-xl font-medium tracking-wide" >
      Subitle
    </p>
    <p
    className="text-base font-normal tracking-normal" >
    {/* The classes aren't important, is just for example */}
      Content
    </p>
    <p
    className="text-neutral-500 text-base font-normal tracking-normal" >
      Gray content
    </p>
  </section>
)
```


3. Creating a new dashboard:
``` tsx
{
  content ? (
    <div
    className="bg-background text-zinc-50 h-screen grid grid-cols-[auto_1fr]" >
      <Sidebar />

      <main
      className="other-clases relative min-h-screen overflow-y-auto" >
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <div className="absolute left-1/2 top-1/2 aspect-square block w-200 -translate-x-1/2 -translate-y-1/2 rounded-full bg-main/15 blur-3xl animate-pulse" />
        </div>

        {/* Interesting code... */}
      </main>

    </div>
  ) : (
    <LoadingScreen />
  )
}
```

4. Setting a card/content container:

``` tsx
return (
  <article
  className="w-your-width px-4 py-2 bg-neutral-950 rounded-md border border-neutral-800 duration-300 hover:bg-main" >
    {/* Interesting code... */}
  </article>
)
```

5. Creating buttons:

- Main button
- Usage: Prefered options
``` tsx
import MainButton from "@components/ui/buttons/main";

export function ExampleUsage() {
  return (
    <MainButton
    size="w-60" //Required
    type="submit" //For normal buttons you can skip this or use reset option
    action={ () => window.alert("Hello world! 👋") }
    className="more-classes"
    isLoading={isWaiting}
    isDisabled={isAutorized} >
      Click me!
    </MainButton>
  )
}
```
- Secondary
- Usage: Not prefered options
``` tsx
import AltButton from "@components/ui/buttons/alternate";

export function ExampleUsage() {
  return (
    <AltButton
    size="w-60" //Required
    action={ () => window.alert("Clicked!") }
    className="more-classes"
    isLoading={isWaiting}>
      You can click here...
    </AltButton>
  )
}
```

- Hazard:
- Usage: Important options
``` tsx
import HazardButton from "@components/ui/buttons/hazard";

export function ExampleUsage() {
  return (
    <HazardButton
    size="w-60" //Required
    action={ () => window.alert("Button clicked ⚠️") }
    className="more-classes"
    isLoading={isWaiting}
    isDisabled={isAutorized} >
      Click me!
    </HazardButton>
  )
}
```

6. Forms:
- You can use it in two ways

- Without CreatorForm (Only for necessary cases)
``` tsx
return (
  <form
  className="px-4 py-2 rounded-md text-zinc-50 duration-400 bg-neutral-950 border-neutral-800 flex flex-col gap-2"
  /* Interesting code... */>

    <input
    type="text"
    className="w-full rounded-sm p-2 bg-neutral-800 border border-transparent duration-400 hover:bg-neutral-900 focus:border-main placeholder:bg-neutral-500"
    /* Interesting input settings... */ />

    {/* Interesting code... */}

  </form>
)
```

- With CreatorForm
``` tsx
const [ value, setValue ] = useState() //Always use this when you use a custom input

return (
  <div
  className="w-screen h-screen fixed flex top-0 left-0 justify-center items-start py-10 z-10 backdrop-blur bg-black/50">

    <CreatorForm
    title="Form title"
    action={ (e) => {   } } // Form submit function
    hideAction={ hideForm } // Cancel button
    actionIsDisabled={ boolean } // Submit disabled
    /* Interesting code... */>

      <CreatorInput
      label="Indicator"
      placeholder="e.g. Cool value"
      value={value || ""}
      onChange={(e) => setValue(e.target.value)}
      required // Put only if is required ( adds a red * character and marks the input as required )
      />

      {/* Interesting code... */}

    </CreatorForm>

  </div>
)
```