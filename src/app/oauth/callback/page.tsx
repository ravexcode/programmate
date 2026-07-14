//Client declaration
"use client";

//Components
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";

//React imports
import { useEffect } from "react";

//Next imports
import { useRouter } from "next/navigation";

//Icons imports
import { IconSparkleHighlight } from "@tabler/icons-react";

//Services imports
import { saveSession } from "@/services/session.service";

export default function OAuthCallback(){
  //Next router setup
  const router = useRouter();

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
      return router.push("/");
    }

    //Cleans the URL for preventing errors
    window.history.replaceState({}, document.title, window.location.pathname);
    //Waits 2 seconds before redirecting to dashboard
    setTimeout(() => {
      //Saves cookie and redirects to dashboard
      saveSession(access_token);
      return router.push("/dashboard");
    }, 2000);
  }, []);

  return (
    <div className="bg-background min-h-screen grid grid-rows-[auto_1fr_auto]">
      <Header />
      <main
      className="flex flex-col justify-center items-center min-h-130 animate-fade-in relative w-full overflow-hidden">

        <section
        className="px-6 py-10 bg-neutral-950 shadow-xl shadow-blue-900/20 min-w-90 rounded-md flex flex-col justify-center items-center gap-2 border border-neutral-800 text-center show-element text-zinc-50 z-2">

          <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-ultramarine-900/20">
            <div className="absolute inset-0 rounded-full bg-ultramarine-300/50 blur-xl animate-pulse" />
            <IconSparkleHighlight
            size={50}
            color="blue"
            className="animate-zoom-in animate-duration-250" />
          </div>

          <h1
          className="text-3xl font-bold">
            Welcome to NexZero!
          </h1>
          <p
          className="font-light text-lg opacity-80">
            Your authentication was successful!
          </p>
          <p
          className="mt-5 w-80">
            You will be redirected to the app, if there's an error report us it!
          </p>

        </section>

        <div
          className="pointer-events-none absolute inset-0 z-0 overflow-hidden w-screen">
            <div
            className="absolute aspect-square left-1/2 top-1/1 -translate-x-1/2 -translate-y-1/2 h-150 bg-main/60 blur-3xl rounded-full animate-pulse" />
            <div className="bg-linear-to-t from-background to-transparent w-screen h-50 left-0 bottom-0 absolute z-3 pointer-events-none"></div>
          </div>
      </main>
      <Footer />
    </div>
  )
}