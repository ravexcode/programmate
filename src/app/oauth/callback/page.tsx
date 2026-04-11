//Client declaration
"use client";

//Components
import MainContainer from "@/components/containers/main";

//React imports
import { useEffect, useState } from "react";

export default function OAuthCallback(){
  const [ isValid, setIsValid ] = useState(true)

  //Starts the app
  useEffect(() => {
    //Gets the params deleting the hash separator
    const hash = window.location.hash.substring(1);
    //Params data
    const params = new URLSearchParams(hash);

    //Gets the access token from params
    const access_token = params.get("access_token");

    //If there's no params data returns to home
    if(!access_token) {
      window.location.href = "/"
    }

    //Cleans the URL for preventing errors
    window.history.replaceState({}, document.title, window.location.pathname);

    //Sends to the app with the access token
    //window.location.href = "myapp://auth" <- Not made yet

    //Tells the access token (only for debugging)
    console.log(access_token);
  }, []);

  return (
    <MainContainer>
      <main
      className="flex flex-col justify-center items-center px-4 py-6 min-h-130 appear-element">

        <section
        className="px-4 py-10 bg-amethyst-900 shadow-xl shadow-amethyst-700/20 min-w-90 rounded-md flex flex-col justify-center items-center gap-2 border border-amethyst-600/50 text-center show-element">

          <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-amethyst-50 dark:bg-amethyst-900/20">
            <div className="absolute inset-0 rounded-full bg-amethyst-300/30 blur-xl animate-pulse" />
            <img 
              src="/icons/party.svg" 
              alt="Icon made by StreamlineHQ"
              className="relative z-10 aspect-square w-12 drop-shadow-md"
            />
          </div>

          <h1
          className="text-3xl font-bold text-text">
            Welcome to PrismaFlow!
          </h1>
          <p
          className="text-amethyst-300 font-semibold">
            Thanks for trusting in us!
          </p>
          <p
          className="mt-5 text-amethyst-300 w-80">
            You will be redirected to the app, if there's an error report it!
          </p>

        </section>

      </main>
    </MainContainer>
  )
}