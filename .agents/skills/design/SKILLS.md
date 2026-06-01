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

- Main containers
1. Pages:
``` tsx
return (
  <div
  className="bg-background text-zinc-50 min-h-screen grid grid-rows-[auto_1fr_auto]" >

    <Header />

      <main
      className="other-clases" >
      <SmoothProvider>
        {/* Interesting code... */}
      </main>

    <Footer />

  </div>
)
```

2. Main component:
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
      Content
    </p>
    <p
    className="text-neutral-500 text-base font-normal tracking-normal" >
      Gray content
    </p>

    {/* Interesting code... */}
  </section>
)
```


3. Dashboard component:
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

4. Secondary component (ussually tinier than main component):

``` tsx
return (
  <article
  className="w-your-width px-4 py-2 bg-neutral-950 rounded-md" >
    {/* Interesting code... */}
  </article>
)
```

5. Card component:

``` tsx
return (
  <div
  className="w-your-width px-4 py-2 bg-neutral-950 rounded-md border border-neutral-800 duration-300 hover:border-main hover:-translate-y-1" >
    {/* Interesting code... */}
  </div>
)
```

6. Main button:

``` tsx
return (
  <button
  className="px-4 py-2 rounded-md text-zinc-50 bg-main duration-400 hover:bg-main/80 active:bg-main/80 active:size-[0.95] min-w-10" 
  /* Interesting code... */>
    Click me!
  </button>
)
```

7. Secondary button:

``` tsx
return(
  <button
  className="px-4 py-2 rounded-md text-zinc-50 bg-neutral-700 duration-400 hover:bg-neutral-800 active:bg-neutral-900 active:size-[0.95] min-w-10"
  /* Interesting code... */>
    Click me!
  </button>
)
```

8. Ghost button:

``` tsx
return (
  <button
  className="px-4 py-2 rounded-md text-zinc-50 duration-400 border-neutral-800 hover:bg-neutral-800 active:bg-neutral-800 active:size-[0.95] min-w-10"
  /* Interesting code... */>
    Click me!
  </button>
)
```

9. Forms:
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