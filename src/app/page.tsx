//view in client
"use client";

//React imports
import { useRef, lazy, Suspense } from "react";

//Next imports
import Link from "next/link";

//Prebuilt ui imports
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import LandingGradient from "@/components/marketing/gradients/landing";
import SmoothProvider from "@/lib/components/lennis";
import SnackBar from "@/components/ui/snackbar";
import FeatureCard from "@/components/marketing/feature-card";

//Hooks imports
import { IconBrain, IconCalendar, IconLayoutKanban, IconTable } from "@tabler/icons-react";

//Lazy loading
//Carousel consumes many resources because it renders images
const TechCarousel = lazy(() => import("@/components/marketing/carousel/techs"));
const ProvCarousel = lazy(() => import("@/components/marketing/carousel/providers"));
//Mini dashboard has too many components/animations
const MiniDashboard = lazy(() => import("@/components/marketing/mini-dashboard/main"));

//Landing page
export default function HomePage(){
  const snackbar = useRef(null);

  return (
    <div className="bg-background min-h-dvh animate-fade-in">
      <SnackBar ref={snackbar} />

      <Header />

      <main
      className="flex flex-col justify-center items-center mb-10">
        <SmoothProvider />
        <section
        className="relative px-4 w-full min-h-screen flex flex-col justify-center items-center text-text pt-20 pb-10 animate-fade-in-up overflow-hidden z-2 select-none">
          <LandingGradient scale={150} />

          <div
          className="w-full animate-duration-1000 animate-blurred-fade-in">
            <h1
            className="text-7xl font-black mb-4 z-2 text-center animate-fade-in-down animate-duration-500 delay-200">
              Built to improve <br />
              your team <span className="text-main"> Workflow </span>
            </h1>
          </div>

          <p
          className="opacity-80 z-2 animate-fade-in-down">
            For design, development, code, databases and more!
          </p>

          <div
          className="w-full md:w-[50%] flex justify-center items-center mt-5 z-2 animate-fade-in-up">
            <Link
            href="/product"
            className="bg-main rounded-full px-12 py-2 duration-200 hover:brightness-120 hover:-translate-y-0.5">
              Take a look
            </Link>
          </div>

          <div
          className="w-max mx-auto px-5 overflow-hidden flex items-center justify-start">
            <Suspense
            fallback={
              <div
              className="w-300 aspect-video flex items-center justify-center"> Loading presentation dashboard... </div>
            }>
              <MiniDashboard />
            </Suspense>
          </div>
        </section>

        <Suspense
        fallback={
          <div> Loading carousel... </div>
        }>
          <TechCarousel />
        </Suspense>


        <Suspense>
          <ProvCarousel />
        </Suspense>

        <p
        className="text-6xl font-bold tracking-wide p-10 w-full text-center max-w-280 mt-30 timeline-view-y animate-fade-in-down animate-range-[entry_0%_cover_30%]">
          Stop wasting time building across multiple plataforms <br />

          <span
          className="text-xl opacity-90 font-normal">
            With nexzero <span className="text-blue-600"> centralize </span> your workflow with AI-powered automation
          </span>
        </p>

        <p
        className="mt-30 text-5xl font-bold tracking-wide w-full text-center">
          What does nexzero provide? <br />
          <span
          className="text-neutral-400 font-normal text-base">
            NexZero provides you many tools for your projects workflow
          </span>
        </p>

        <div
        className="mt-20 grid grid-cols-2 justify-center items-start w-full max-w-300 gap-16">
          <section
          className="w-full flex flex-col gap-18">
            <FeatureCard>
              <p
              className="font-bold text-4xl">
                AI Assistant
              </p>
              <p
              className="font-medium my-3">
                <span className="text-blue-600 font-medium">NexZero</span> provides AI Assistant to build and manage your projects
              </p>

              <IconBrain
              size={200}
              stroke={1}
              className="text-main animate-pulse duration-500 hover:animate-none" />
            </FeatureCard>

            <FeatureCard>
              <p
              className="font-bold text-4xl">
                Calendar
              </p>
              <p
              className="font-medium my-3">
                Get <span className="text-blue-600 font-medium">noticed</span> about your meetings and sprints with our calendar.
              </p>

              <IconCalendar
              size={200}
              stroke={1}
              className="text-main animate-pulse duration-500 hover:animate-none" />
            </FeatureCard>
          </section>


          <section
          className="w-full flex flex-col gap-18">
            <FeatureCard
            height="min-h-130">
              <p
              className="font-bold text-4xl">
                Kanban board
              </p>
              <p
              className="font-medium my-3">
                Improve a better <span className="text-blue-600 font-medium">organization</span> with our kanban board
              </p>

              <IconLayoutKanban
              size={200}
              stroke={1}
              className="text-main animate-pulse duration-500 hover:animate-none" />
            </FeatureCard>

            <FeatureCard>
              <p
              className="font-bold text-4xl">
                ERD Builder
              </p>
              <p
              className="font-medium my-3">
                Create and edit a <span className="text-blue-600 font-medium">Entity Relation Data table</span> without any problem with the ERD Tool provided by us
              </p>

              <IconTable
              size={200}
              stroke={1}
              className="text-main animate-pulse duration-500 hover:animate-none" />
            </FeatureCard>
          </section>
        </div>

        <p
        className="mt-50 text-5xl font-bold tracking-wide w-full text-center">
          Tesmonials <br />
          <span
          className="text-neutral-400 font-normal text-base">
            Know what people say about us
          </span>
        </p>

        <section
        className="w-full text-center flex flex-col items-center justify-center text-neutral-400 h-120 text-4xl animate-pulse">
          Coming soon...
        </section>
      </main>

      <Footer />
    </div>
  )
}