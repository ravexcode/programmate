//Client page
"use client";

//UI Components
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";

export default function AuthSuccess(){
  return (
    <div className="bg-background min-h-dvh grid grid-rows-[auto_1fr_auto]">
      <Header
      isAuthForm={true}/>

      <main className="flex flex-col justify-center items-center w-full h-full py-20 relative">

        <section
        className="px-4 py-10 bg-ultramarine-950 shadow-xl shadow-ultramarine-700/20 min-w-90 rounded-md flex flex-col justify-center items-center gap-2 border border-ultramarine-600/50 text-center show-element text-text z-2">

          <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-ultramarine-900/20">
            <div className="absolute inset-0 rounded-full bg-ultramarine-300/50 blur-xl animate-pulse" />
            <img 
              src="/icons/party.svg" 
              alt="Icon made by StreamlineHQ"
              className="relative z-2 aspect-square w-12 drop-shadow-md"
            />
          </div>

          <h1
          className="text-3xl font-bold">
            Signed up successfully!
          </h1>
          <p
          className="font-semibold">
            We sent you an email
          </p>
          
          <a
          href="https://mail.google.com"
          className="mt-5 w-full bg-main/50 py-2 rounded-md shadow-lg shadow-ultramarine-400/50 duration-200 hover:bg-main/70 hover:shadow-ultramarine-400">
            Go to GMail
          </a>

        </section>

        <div
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <div
          className="absolute aspect-square block left-1/2 top-1/1 -translate-x-1/2 -translate-y-1/2 h-150 bg-main/20 blur-3xl rounded-full animate-pulse" />
        </div>
      </main>

      <Footer />
    </div>
  )
}