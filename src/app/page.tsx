//view in client
"use client";

//React imports
import { useRef, lazy, Suspense, useState } from "react";

//Next imports
import Link from "next/link";
import { useRouter } from "next/navigation";

//Prebuilt ui imports
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import LandingGradient from "@/components/ui/gradients/landing";
import SmoothProvider from "@/lib/components/lennis";
import SnackBar, { showSnackbar } from "@/components/ui/snackbar";
import FeatureCard from "@/components/ui/cards/feature";

//Hooks imports
import { useGetToken } from "@/hooks/useCookies";
import { IconArrowLeft, IconBrain, IconCalendar, IconLayoutKanban, IconSend } from "@tabler/icons-react";

//Landing page
export default function HomePage(){
  //NextJS Setup
  const router = useRouter();

  const [ exampleInput, setExampleInput ] = useState("Build me a new project for a e-shop to sell products");

  const snackbar = useRef(null);
  const message = useRef(null);
  const exampleChat = useRef(null);

  //Payment action
  const handlePayment = async(plan: string) => {
    const token = useGetToken();

    if(!token) return router.push("/auth/login");

    const res = await fetch(
      '/api/payments/capture-payment',
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "prismaflow-api-key": process.env.NEXT_PUBLIC_API_KEY!,
          "Authorization": token
        },
        body: JSON.stringify({
          plan
        })
      }
    );

    const data = await res.json();

    if(res.status === 200) return router.push(data.checkout_link);

    showSnackbar(data.message, (res.status >= 500 ? "critic": "warn"), snackbar);
  };

  //Lazy loading
  //Carousel consumes many resources because it renders images
  const IconCarousel = lazy(() => import("@components/icon-carrousel"));
  //Mini dashboard has too many components/animations
  const MiniDashboard = lazy(() => import("@components/ui/mini-dashboard/main"));

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
            href="/about"
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
          <IconCarousel />
        </Suspense>

        <p
        className="text-6xl font-bold tracking-wide p-10 w-full text-center max-w-280 mt-30 timeline-view-y animate-fade-in-down animate-range-[entry_0%_cover_30%]">
          Stop wasting time building across multiple plataforms <br />

          <span
          className="text-xl opacity-90 font-normal">
            With prismaflow <span className="text-main"> centralize </span> your workflow with AI-powered automation
          </span>
        </p>

        <p
        className="mt-30 text-5xl font-bold tracking-wide w-full text-center">
          What does prismaflow provide?
        </p>

        <div
        className="mt-20 grid grid-cols-2 justify-start items-start w-full max-w-300 gap-5">
          <FeatureCard>
            <p
            className="font-bold text-4xl">
              AI Assistant
            </p>
            <p
            className="font-medium my-3">
              <span className="text-main font-medium">Prismaflow</span> provides AI Assistant to build and manage your projects
            </p>

            <IconBrain
            size={200}
            stroke={1}
            className="text-main animate-pulse duration-500 hover:animate-none" />
          </FeatureCard>

          <FeatureCard
          height="min-h-130">
            <p
            className="font-bold text-4xl">
              Kanban board
            </p>
            <p
            className="font-medium my-3">
              Improve a better <span className="text-main font-medium">organization</span> with our kanban board
            </p>

            <IconLayoutKanban
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
              Get <span className="text-main font-medium">noticed</span> about your meetings and sprints with our calendar.
            </p>

            <IconCalendar
            size={200}
            stroke={1}
            className="text-main animate-pulse duration-500 hover:animate-none" />
          </FeatureCard>
        </div>

      </main>

      <Footer />
    </div>
  )
}