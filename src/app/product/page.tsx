"use client";

//React imports
import { lazy, Suspense } from "react";

//Next imports
import Link from "next/link";
import Image from "next/image";

//Prebuilt ui components imports
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import SmoothProvider from "@/components/ui/smooth-provider";
import SectionHeading from "@/components/marketing/section-heading";
import FeatureShowcase from "@/components/marketing/showcase/feature-showcase";

//Lazy loading
//Each showcase is an interactive mini page with its own state
const DashboardShowcase = lazy(() => import("@/components/marketing/showcase/dashboard/main"));
const TicketsShowcase = lazy(() => import("@/components/marketing/showcase/tickets/main"));
const KanbanShowcase = lazy(() => import("@/components/marketing/showcase/kanban/main"));
const ErdShowcase = lazy(() => import("@/components/marketing/showcase/erd/main"));
const CalendarShowcase = lazy(() => import("@/components/marketing/showcase/calendar/main"));
const AiShowcase = lazy(() => import("@/components/marketing/showcase/ai/main"));

const showcaseFallback = (
  <div
  className="w-full aspect-video rounded-md border border-neutral-800 bg-neutral-950 flex items-center justify-center text-text/40">
    Loading demo...
  </div>
);

export default function ProductPage() {
  return (
    <div
    className="min-h-screen grid grid-rows-[auto_1fr_auto] items-center">
      <Header />

      <main
      className="w-full flex flex-col items-center justify-start h-full py-10">
        <SmoothProvider />

        <section
        className="relative w-full flex flex-col gap-5 md:flex-row items-center justify-center overflow-hidden px-4 py-20 min-h-100">

          <div
          className="relative z-2 w-full flex items-center justify-center flex-col gap-5">
            <p
            className="text-6xl font-black tracking-wide w-full text-start animate-blurred-fade-in animate-duration-700">
              Build for developers <br />
              Designed for projects <br />
              Powered by <span className="text-main">AI</span> <br />
            </p>
            <p
            className="w-full text-start animate-blurred-fade-in animate-duration-700">
              A closer look at the ideas, philosophy and people behind NexZero.
            </p>

            <div
            className="w-full sm:w-100 gap-3 mr-auto grid grid-cols-2 text-center">
              <Link
              href="/auth/signup"
              className="w-full py-2 text-sm rounded-sm bg-main duration-400 hover:brightness-75 cursor-pointer outline-none animate-fade-in-up animate-delay-100">
                Start building
              </Link>
              <Link
              href="/pricing"
              className="w-full py-2 text-sm rounded-sm border border-neutral-800 duration-400 hover:bg-neutral-800 cursor-pointer outline-none animate-fade-in-up animate-delay-200">
                Look pricing
              </Link>
            </div>
          </div>

          <div
          className="relative z-2 w-full md:w-70 flex items-center justify-center h-full">
            <Image
            src="/logos/logo.svg"
            alt="NexZero logo"
            width={800}
            height={800}
            loading="lazy"
            className="animate-fade-in-left animate-duration-600 animate-ease-in-out aspect-square max-w-70" />
          </div>
        </section>

        <FeatureShowcase
        overline="Organize"
        title={<>Every project, <span className="text-main">one dashboard</span></>}
        description="Get a clear overview of everything your team is working on. Track status at a glance, keep descriptions and tags in context, and jump straight back into work."
        bullets={[
          "Status tracking from backlog to done",
          "Tags, descriptions and quick access",
          "Create new projects in seconds",
        ]}
        link="/auth/signup"
        linkLabel="Start building">
          <Suspense fallback={showcaseFallback}>
            <DashboardShowcase />
          </Suspense>
        </FeatureShowcase>

        <FeatureShowcase
        reverse
        overline="Track"
        title={<>Issues that keep your <span className="text-main">team aligned</span></>}
        description="Capture bugs, tasks and ideas as issues. Describe them with markdown, set priorities and assign them to the right person — all tied to the build."
        bullets={[
          "Markdown-supported issue descriptions",
          "High, medium and low priorities",
          "Clear assignees and authors",
        ]}
        link="/auth/signup"
        linkLabel="Try it free">
          <Suspense fallback={showcaseFallback}>
            <TicketsShowcase />
          </Suspense>
        </FeatureShowcase>

        <FeatureShowcase
        overline="Plan"
        title={<>From backlog to verified, <span className="text-main">drag and drop</span></>}
        description="Move work through the pipeline the way your team actually works. Four stages, real drag and drop, and cards you can rename and reorganize on the fly."
        bullets={[
          "Four workflow stages",
          "Native drag and drop",
          "Inline task creation",
        ]}
        link="/auth/signup"
        linkLabel="Try it free">
          <Suspense fallback={showcaseFallback}>
            <KanbanShowcase />
          </Suspense>
        </FeatureShowcase>

        <FeatureShowcase
        reverse
        overline="Design"
        title={<>Design your database <span className="text-main">visually</span></>}
        description="Model entities and relationships on a canvas, drag tables around and keep columns organized. Then export the whole thing as SQL or JSON."
        bullets={[
          "Draggable table nodes",
          "Typed columns and live rows",
          "SQL and JSON export",
        ]}
        link="/auth/signup"
        linkLabel="Try it free">
          <Suspense fallback={showcaseFallback}>
            <ErdShowcase />
          </Suspense>
        </FeatureShowcase>

        <FeatureShowcase
        overline="Schedule"
        title={<>Sprints, meetings and <span className="text-main">deadlines</span></>}
        description="Plan the rhythm of the project with your whole team. Pick any day, drop an event, and keep everyone aware of what is coming."
        bullets={[
          "Month and day navigation",
          "Click a day to add events",
          "Shared team awareness",
        ]}
        link="/auth/signup"
        linkLabel="Try it free">
          <Suspense fallback={showcaseFallback}>
            <CalendarShowcase />
          </Suspense>
        </FeatureShowcase>

        <FeatureShowcase
        reverse
        overline="Automate"
        title={<>Your workflow, <span className="text-main">powered by AI</span></>}
        description="Chat with NexZero AI to plan features, generate workflows and unblock decisions. Bring your own providers — OpenAI, Claude or any compatible model."
        bullets={[
          "Multi-provider support with BYO keys",
          "Conversation history and sessions",
          "AI-assisted workflow generation",
        ]}
        link="/auth/signup"
        linkLabel="Try it free">
          <Suspense fallback={showcaseFallback}>
            <AiShowcase />
          </Suspense>
        </FeatureShowcase>

        <section
        className="w-full max-w-180 flex flex-col items-center px-4 mt-40">
          <SectionHeading
          title={<>Build with <span className="text-main">intention</span></>}
          subtitle={
            <>
              Every feature inside NexZero is built with one idea in mind: good things require time. Instead of releasing dozens of unfinished tools, we focus on experiences that are reliable, polished and genuinely useful.
            </>
          } />
        </section>

        <section
        className="w-full max-w-180 flex flex-col items-center justify-center mt-30 px-4">
          <SectionHeading
          title="Meet the creator" />

          <div
          className="mt-15 w-full max-w-150 rounded-md border border-neutral-800 bg-neutral-950 p-10 flex flex-col md:flex-row items-center justify-center gap-10 timeline-view-y animate-fade-in-up animate-range-[entry_0%_cover_30%]">
            <Image
            src="https://avatars.githubusercontent.com/u/195974083?v=4"
            alt="Ravexcode profile picture"
            loading="lazy"
            width={300}
            height={300}
            className="rounded-full aspect-square block w-30" />

            <div
            className="flex flex-col items-center md:items-start gap-5">
              <p
              className="text-center md:text-start font-medium italic text-neutral-200 text-lg select-none">
                &quot;Every line of code, every interface and every decision is crafted with long-term quality in mind.&quot;
              </p>

              <p
              className="text-center md:text-start font-bold">
                José Martinez
                <span className="text-neutral-400 font-normal ml-5">@ravexcode</span>
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
