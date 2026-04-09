"use client";

import { useSearchParams, useRouter } from "next/navigation";
import MainContainer from "@/components/containers/main";

export default function WelcomePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const source = searchParams.get("source");

  const isFromRegister = source === "register";

  return (
    <MainContainer>
      <main className="flex flex-col justify-center items-center min-h-[70vh] py-10 pb-3 gap-10 appear-element">
        <section className="flex flex-col gap-6 p-10 bg-amethyst-950 rounded-xl border border-amethyst-500 shadow-lg text-text text-center max-w-lg w-full show-element">
          
          <h2 className="text-4xl md:text-5xl font-bold text-amethyst-400 w-full mb-4">
            {isFromRegister ? "Check your inbox" : "Welcome back!"}
          </h2>

          <p className="text-lg text-text/80 mb-6">
            {isFromRegister 
              ? "We've sent a confirmation link to your email. Please confirm it to access all PrismaFlow features." 
              : "We're glad to see you again. Let's get to work!"}
          </p>

          {isFromRegister ? (
            <button 
              onClick={() => window.location.href = "https://mail.google.com"}
              className="w-full py-3 px-6 bg-amethyst-600 hover:bg-amethyst-500 text-white font-bold rounded-md transition-colors cursor-pointer"
            >
              Open Gmail
            </button>
          ) : (
            <button 
              onClick={() => router.push("/")}
              className="w-full py-3 px-6 bg-amethyst-600 hover:bg-amethyst-500 text-white font-bold rounded-md transition-colors cursor-pointer"
            >
              Go to Dashboard
            </button>
          )}

        </section>
      </main>
    </MainContainer>
  );
}