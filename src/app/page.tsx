//view in client
"use client";

//React imports
import { useRef, lazy, Suspense } from "react";

//Next imports
import Link from "next/link";
import { useRouter } from "next/navigation";

//Prebuilt ui imports
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import LandingGradient from "@/components/marketing/gradients/landing";
import SmoothProvider from "@/components/ui/smooth-provider";
import SnackBar from "@/components/ui/snackbar";
import SectionHeading from "@/components/marketing/section-heading";
import CapabilitiesGrid from "@/components/marketing/capabilities-grid";
import PricingCard from "@/components/marketing/pricing-card";
import MiniCode from "@/components/marketing/mini-code";

//Hooks imports
import { IconBrain, IconCheck, IconRocket, IconCode, IconBrandGithub } from "@tabler/icons-react";

//Lazy loading
//Carousel consumes many resources because it renders images
const TechCarousel = lazy(() => import("@/components/marketing/carousel/techs"));
const ProvCarousel = lazy(() => import("@/components/marketing/carousel/providers"));
//Mini dashboard has too many components/animations
const MiniDashboard = lazy(() => import("@/components/marketing/mini-dashboard/main"));

//Pricing data
const pricingPlans = [
  {
    tier: "Free",
    slogan: "Everything you need to start",
    price: 0,
    type: "free" as const,
    benefits: [
      "2 project limit",
      "To-do list",
      "Database diagram",
      "Flowchart builder",
      "AI workflow generation (BYO API Key)",
      "Kanban board",
      "Calendar",
      "Issue Tracking",
    ],
  },
  {
    tier: "Pro",
    slogan: "Unlock the full NexZero experience",
    price: 8,
    type: "normal" as const,
    benefits: [
      "Everything in Free",
      "Unlimited projects",
      "Access to free AI models",
      "GitHub integration",
      "Private projects",
      "Custom profile pictures",
      "Pro badge",
    ],
  },
  {
    tier: "Enterprise",
    slogan: "Designed for collaborative teams",
    price: 14,
    type: "normal" as const,
    benefits: [
      "Everything in Pro",
      "Unlimited team members",
      "Slack integration",
      "Early access to new features",
      "Priority support",
    ],
  },
];

//Landing page
export default function HomePage(){
  const snackbar = useRef(null);
  const router = useRouter();

  return (
    <div className="bg-background min-h-dvh overflow-x-clip animate-fade-in">
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
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight text-balance font-black mb-4 z-2 text-center animate-fade-in-down animate-duration-500 delay-200">
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
            className="bg-main rounded-full px-8 sm:px-12 py-2.5 duration-200 hover:brightness-120 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main">
              Take a look
            </Link>
          </div>

          <div
          className="w-full max-w-300 mx-auto px-5 overflow-hidden flex items-center justify-center">
            <Suspense
            fallback={
              <div
              className="w-full max-w-300 aspect-video flex items-center justify-center"> Loading presentation dashboard... </div>
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

        <Suspense
        fallback={
          <div> Loading carousel... </div>
        }>
          <ProvCarousel />
        </Suspense>

        <section
        className="w-full max-w-280 flex flex-col items-center px-4 mt-15 sm:mt-30">
          <SectionHeading
          title={<>Stop wasting time building across multiple <br /> <span className="text-main">platforms</span></>}
          subtitle={<>With nexzero <span className="text-blue-600">centralize</span> your workflow with AI-powered automation</>} />

          <div
          className="mt-15 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-180 timeline-view-y animate-fade-in-up animate-range-[entry_0%_cover_30%]">
            {
              [
                { icon: IconRocket, title: "One workspace", text: "Projects, tickets, calendars and databases in a single place." },
                { icon: IconBrain, title: "AI powered", text: "Automate repetitive tasks and generate workflows with AI." },
                { icon: IconCode, title: "Developer friendly", text: "Built for teams that ship code, schemas and designs fast." },
              ].map((value) => (
                <div
                key={value.title}
                className="w-full rounded-md border border-neutral-800 bg-neutral-950 px-6 py-8 flex flex-col items-center justify-center text-center gap-3 duration-300 hover:border-main hover:-translate-y-1">
                  <value.icon
                  size={40}
                  stroke={1.5}
                  className="text-main" />
                  <p
                  className="font-bold text-xl">
                    {value.title}
                  </p>
                  <p
                  className="text-sm opacity-80 leading-relaxed">
                    {value.text}
                  </p>
                </div>
              ))
            }
          </div>
        </section>

        <section
        className="w-full max-w-300 flex flex-col items-center px-4 mt-20 sm:mt-50">
          <SectionHeading
          title={<>Everything you need <span className="text-main">to ship</span></>}
          subtitle="Projects, teams, code, databases and AI in a single workspace" />

          <CapabilitiesGrid />
        </section>

        <section
        className="w-full max-w-300 flex flex-col items-center px-4 mt-20 sm:mt-50">
          <SectionHeading
          title={<>Built for <span className="text-main">code</span> and databases</>}
          subtitle="From schemas to scripts, NexZero keeps your technical work close to your workflow" />

          <div
          className="mt-15 w-full grid grid-cols-1 md:grid-cols-2 items-center gap-12 timeline-view-y animate-fade-in-up animate-range-[entry_0%_cover_30%]">
            <div
            className="w-full flex flex-col items-start gap-5">
              <p
              className="text-2xl font-bold tracking-wide">
                Write, review and ship without leaving your workspace
              </p>
              <p
              className="opacity-80 leading-relaxed">
                NexZero brings your code, entity diagrams and issue tracking together. Plan the schema, build the flow and track every task from one place.
              </p>

              <div
              className="flex flex-col gap-2 w-full">
                {
                  [
                    "Entity Relation diagrams for your database",
                    "Workflow generation powered by AI",
                    "Tickets and issues tied to your builds",
                  ].map((benefit) => (
                    <p
                    key={benefit}
                    className="flex gap-2 items-center text-sm opacity-90">
                      <IconCheck
                      size={18}
                      stroke={2.5}
                      className="text-main" />
                      {benefit}
                    </p>
                  ))
                }
              </div>

              <Link
              href="/product"
              className="w-max rounded-full bg-main px-10 py-2 duration-200 hover:brightness-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main">
                Explore product
              </Link>
            </div>

            <div
            className="w-full rounded-md border border-neutral-800 bg-neutral-950 p-5">
              <MiniCode />
            </div>
          </div>
        </section>

        <section
        id="pricing"
        className="w-full max-w-300 flex flex-col items-center px-4 mt-20 sm:mt-50 scroll-mt-20">
          <SectionHeading
          title={<>Simple pricing, <span className="text-main">scaled</span> for your team</>}
          subtitle="Start free and upgrade when your workflow grows" />

          <div
          className="mt-15 flex gap-6 md:gap-10 items-start justify-center flex-wrap timeline-view-y animate-fade-in-up animate-range-[entry_0%_cover_30%]">
            {
              pricingPlans.map((plan) => (
                <PricingCard
                key={plan.tier}
                tier={plan.tier}
                slogan={plan.slogan}
                price={plan.price}
                type={plan.type}
                benefits={plan.benefits}
                action={() => router.push("/pricing")} />
              ))
            }
          </div>
        </section>

        <section
        className="w-full max-w-280 flex flex-col items-center px-4 mt-20 sm:mt-50">
          <SectionHeading
          title="Testimonials"
          subtitle="Know what people say about us" />

          <div
          className="mt-15 w-full max-w-200 rounded-md border border-neutral-800 bg-neutral-950 text-center flex flex-col items-center justify-center text-neutral-400 h-40 text-4xl animate-pulse">
            Coming soon...
          </div>
        </section>

        <section
          className="w-full max-w-280 px-4 h-150 flex flex-col items-center justify-center relative mt-20">

          <div
          className="pointer-events-none absolute inset-0 z-0 overflow-hidden scale-120">
            <div
            className="aspect-square block absolute left-1/2 top-1/3 -translate-x-1/2 h-200 bg-main rounded-full animate-pulse blur-3xl brightness-50 animate-duration-[4s]">
              <div
              className="aspect-square block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-100 bg-sky-600 rounded-full" />
              <div
              className="aspect-square block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-50 bg-sky-300 rounded-full" />
            </div>

            <div className="bg-linear-to-t to-transparent from-background w-screen h-30 left-0 bottom-0 absolute z-3 pointer-events-none" />
            <div className="bg-linear-to-b from-background to-transparent w-screen h-20 left-0 top-0 absolute z-3 pointer-events-none" />
          </div>

          <SectionHeading
          title="We are OpenSource"
          subtitle="Explore about us and our projects" />

          <a href="https://github.com/ravexcode/programmate"
          className="rounded-xl bg-black w-60 p-2 text-center flex items-center justify-center mt-8 gap-2 text-lg font-medium hover:scale-110 duration-300 z-2">
            <IconBrandGithub
              size={20} />
            View repo
          </a>
        </section>
      </main>

      <Footer />
    </div>
  )
}
