//Client page
"use client";

//Next router
import { useRouter } from "next/navigation";

//Prebuilt ui imports
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import MainButton from "@/components/ui/buttons/main";

//Icons imports
import { IconMail } from "@tabler/icons-react";

export default function AuthSuccess(){
  const router = useRouter();

  return (
    <div className="bg-background min-h-screen grid grid-rows-[auto_1fr_auto] text-zinc-50">
      <Header />

      <main className="flex flex-col justify-center items-center h-full py-20 relative">

        <section
        className="flex flex-col items-center justify-center w-100 max-w-9/10 rounded-xl bg-neutral-950 border border-neutral-800 z-2 py-8 text-center gap-3 animate-fade-in-up">
          <IconMail
          size={40}
          stroke={2}
          color="blue" />

          <h1
          className="text-3xl font-bold">
            Signed up successfully!
          </h1>
          <p
          className="font-semibold">
            We sent you an email
          </p>
          
          <MainButton
          size="w-50 mt-4"
          action={() => {
            window.location.href = "https://mail.google.com";
            return;
          }}>
            Go to Gmail
          </MainButton>

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