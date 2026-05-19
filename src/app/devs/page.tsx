//Client side
"use client";

//Prebuilt ui components
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";

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
    className="w-full max-w-7xl rounded-xl bg-neutral-900 p-5 text-lg flex flex-col md:flex-row justify-center items-center border border-transparent hover:border-main duration-300 hover:-translate-y-1 cursor-default timeline-view-y animate-fade-in animate-range-[entry_0%_cover_10%]">
      { props.title }
      <span
      className="md:ml-auto text-gray-400"> {  props.content } </span>
    </p>
  )
}

export default function DevsPage(){
  return (
    <div
    className="min-h-screen grid grid-rows-[auto_1fr_auto]">
      <Header />

      <main
      className="flex flex-col justify-center items-center text-text">
        <SmoothProvider />

        <section
        className="relative px-4 w-full min-h-screen flex flex-col justify-center items-center animate-fade-in-up overflow-hidden">

          <div
          className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
            <div
            className="aspect-square block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-100 md:h-230 bg-main/60 blur-3xl rounded-full animate-pulse" />
            <div className="bg-linear-to-t from-background to-transparent w-screen h-50 left-0 bottom-0 absolute z-3 pointer-events-none"></div>
            <div className="bg-linear-to-b from-background to-transparent w-screen h-20 left-0 top-0 absolute z-3 pointer-events-none"></div>
          </div>

          <h1
          className="text-6xl font-bold z-2 text-center">
            Explore Prismaflow <br />
            from the inside
          </h1>
          <p
          className="opacity-80 z-2">
            Learn about API, techs used and more!
          </p>
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
            <IconArrowDown
            className="opacity-70" />
            <ArticleComponent  title="Storage"    content="Supabase Auth / Realtime" />
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
            <ArticleComponent  title="OpenRouter"   content="AI gestor" />
            <ArticleComponent  title="CryptoJS"   content="Encrypt text" />
            <ArticleComponent  title="Tailwind Animations"   content="Animations that makes better your experience" />
          </article>
        </section>
      </main>

      <Footer />
    </div>
  )
}