//Client side
"use client";

//Prebuilt ui components
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import LandingGradient from "@/components/ui/gradients/landing";
import MiniCode from "@/components/ui/mini-code";

//Hooks imports
import SmoothProvider from "@/lib/components/lennis";

//Icons imports
import { IconArrowDown } from "@tabler/icons-react";

//Components

//Architecture component
function ArticleComponent(props: {
  title: string;
  content: string;
}){
  return (
    <p
    className="w-full max-w-7xl rounded-xl bg-neutral-950 p-5 text-lg flex flex-col md:flex-row justify-center items-center border border-transparent hover:border-main duration-300 hover:-translate-y-1 cursor-default timeline-view-y animate-fade-in animate-range-[entry_0%_cover_10%]">
      { props.title }
      <span
      className="md:ml-auto text-gray-400"> {  props.content } </span>
    </p>
  )
}

export default function DevsPage(){
  return (
    <div
    className="min-h-screen grid grid-rows-[auto_1fr_auto] bg-background">
      <Header />

      <main
      className="flex flex-col justify-center items-center text-text">
        <SmoothProvider />

        <section
        className="relative px-4 w-full min-h-200 flex flex-col justify-center items-center animate-fade-in-up overflow-hidden">
          <LandingGradient />
          <h1
          className="text-6xl font-bold z-2 text-center">
            Explore NexZero <br />
            from the <span className="text-main"> inside </span>
          </h1>
          <p
          className="opacity-80 z-2">
            Learn about our project!
          </p>

          <MiniCode />
        </section>

        <section
        className="px-4 w-full flex flex-col justify-center items-center pt-20 pb-10 timeline-view-y animate-fade-in animate-range-[entry_0%_cover_30%]"
        id="arch">
          <p
          className="text-4xl font-medium tracking-wide z-2 text-center">
            Architecture Overview
          </p>

          <article
          className="flex flex-col gap-3 w-full items-center justify-center">
            <p
            className="text-xl opacity-80 font-light tracking-wider mb-4">
              Our app workflow
            </p>

            <ArticleComponent  title="Frontend"   content="NextJS Client" />
            <IconArrowDown
            className="opacity-70" />
            <ArticleComponent  title="API"        content="NextJS Server" />
            <IconArrowDown
            className="opacity-70" />
            <ArticleComponent  title="Database"   content="Supabase" />
          </article>
        </section>

        <section
        className="px-4 w-full flex flex-col justify-center items-center pt-20 pb-10 timeline-view-y animate-fade-in animate-range-[entry_0%_cover_30%]"
        id="techs">
          <p
          className="text-4xl font-medium tracking-wide z-2 text-center">
            Core Stack
          </p>
          
          <article
          className="flex flex-col gap-3 w-full items-center justify-center">
            <p
            className="text-xl opacity-80 font-light tracking-wider mb-4">
              The best technologies for your team
            </p>

            <ArticleComponent  title="Frontend"   content="NextJS + React JS" />
            <ArticleComponent  title="Backend (API)"   content="NextJS Server" />
            <ArticleComponent  title="Database"   content="Supabase" />
            <ArticleComponent  title="Auth"   content="Supabase Auth" />
            <ArticleComponent  title="Providers"   content="Google, Github & Gitlab" />
            <ArticleComponent  title="Infraestucture"   content="Vercel" />
          </article>
        </section>

        
        <section
        className="px-4 w-full flex flex-col justify-center items-center pt-20 pb-10 timeline-view-y animate-fade-in animate-range-[entry_0%_cover_30%]"
        id="lnt">
          <p
          className="text-4xl font-medium tracking-wide z-2 text-center">
            Libraries & Tooling
          </p>
          
          <article
          className="flex flex-col gap-3 w-full items-center justify-center">
            <p
            className="text-xl opacity-80 font-light tracking-wider mb-4">
              Services for make better your experience
            </p>

            <ArticleComponent  title="Lenis"   content="A better scroll experience" />
            <ArticleComponent  title="Resend"   content="Emails gestor" />
            <ArticleComponent  title="Stripe"   content="Payments gestor" />
            <ArticleComponent  title="CryptoJS"   content="Encrypt text" />
            <ArticleComponent  title="Tailwind Animations"   content="Animations that makes better your experience" />
          </article>
        </section>

        <div
        className="bg-linear-to-t to-transparent from-black w-screen h-20 z-3 pointer-events-none">

        </div>
      </main>

      <Footer />
    </div>
  )
}