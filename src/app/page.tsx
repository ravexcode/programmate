//view in client
"use client";

//Next imports
import Link from "next/link";
import Image from "next/image";

//Prebuilt components
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import IconCarousel from "@/components/icon-carrousel";

//Custom components
import SmoothProvider from "@/lib/components/lennis";
import { IconCheck } from "@tabler/icons-react";

function Card(props: {
  icon: string,
  title: string,
  children: React.ReactNode
}) {
  return (
    <section 
    className="rounded-xl border border-neutral-800 px-6 py-3 bg-neutral-950 flex flex-col justify-center items-start gap-1 w-75 text-start shadow-lg shadow-ultramarine-700/20 duration-400 hover:shadow-ultramarine-700/50 hover:-translate-y-2 hover:scale-105 cursor-default timeline-view-y animate-fade-in animate-range-[entry_0%_cover_30%]">
      <img src={"/icons/" + props.icon} alt={props.icon} />
      <h2 
      className="text-xl text-main w-full">
        {props.title}
      </h2>
      <p
      className="w-full font-light">
        {props.children}
      </p>
    </section>
  )
}

function PricingCard(props: {
  isRecomended?: boolean,
  plan: string,
  cost: string,
  benefits: Array<string>
}){
  const pricingCardClassess : string = "flex flex-col px-6 py-4 rounded-xl h-100 shadow-lg shadow-ultramarine-950/50 mb-10 w-60 timeline-view-y animate-fade-in animate-range-[entry_0%_cover_30%] relative border cursor-default " + (props.isRecomended ? "scale-110 border-blue-600 bg-blue-800/20 backdrop-brightness-40 backdrop-blur-2xl" : "border-neutral-600 bg-neutral-950");

  return (
    <div
    className={pricingCardClassess}>
      {props.isRecomended ? (
        <div>
          <span
          className="absolute -translate-y-6 -translate-x-8 px-3 py-1 rounded-md bg-main text-sm">
            Recomended
          </span>

          <span className="h-5 md:h-3 block"></span>
        </div>
      ) : null}
      <p className="text-sm font-semibold text-center">{props.plan}</p>
      <h3 className="text-2xl font-bold mb-3 text-sky-600 tracking-wide text-center">
        {props.cost}
        <span
        className="text-sm text-text/50 font-light ml-1 tracking-widest">
          /month
        </span>
      </h3>

      {props.benefits.map((value : string, index : number) => (
        <div
        key={index}
        className="text-text justify-start items-center flex gap-1 font-light tracking-wide">
          <IconCheck size={15} stroke={2.3} /> {value}
        </div>
      ))}

      <button
      className="w-full text-text bg-main mt-auto tracking-wider py-2 rounded-full duration-300 hover:brightness-130 cursor-pointer hover:-translate-y-0.5 relative">
        Get started
      </button>
    </div>
  )
}

//Landing page
export default function HomePage(){
  return (
    <div className="bg-background min-h-dvh">
      <Header />

      <main
      className="flex flex-col justify-center items-center">
        <SmoothProvider />
        <section
        className="relative px-4 w-full min-h-screen flex flex-col justify-center items-center text-text pt-20 pb-10 animate-fade-in-up overflow-hidden">

          <div
          className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
            <div
            className="aspect-square block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-100 md:h-230 bg-main/60 blur-3xl rounded-full animate-pulse" />
            <div className="bg-linear-to-t from-background to-transparent w-screen h-50 left-0 bottom-0 absolute z-3 pointer-events-none"></div>
            <div className="bg-linear-to-b from-background to-transparent w-screen h-20 left-0 top-0 absolute z-3 pointer-events-none"></div>
          </div>

          <h1
          className="text-6xl font-bold mb-4 z-2 text-center">
            Built to improve <br />
            your team workflow
          </h1>
          <p
          className="opacity-80 z-2">
            For design, development, code, databases and more!
          </p>

          <div
          className="w-full md:w-[50%] flex justify-center items-center mt-5 z-2">
            <Link
            href="/about"
            className="bg-main rounded-full px-12 py-2 duration-200 hover:brightness-120 hover:-translate-y-0.5">
              Take a look
            </Link>
          </div>

          <Image
          src="/images/dashboard.webp"
          alt="Image made by RavexCode"
          width={1800}
          height={1800}
          loading="eager"
          className="z-3 w-full max-w-300 mt-10 mx-auto rounded-xl md:rounded-4xl border-2 border-neutral-800"/>
        </section>

        <IconCarousel />

        <span className="h-10"></span>

        <section 
        className="text-text bg-background flex flex-col justify-center items-center gap-5 px-4 z-2 w-full timeline-view-y animate-zoom-in animate-range-[entry_0%_cover_30%]">
          <p
          className="text-lg px-10 py-1 rounded-full bg-main shadow-md shadow-main/30">
            Why Prismaflow?
          </p>

          <div className="flex flex-col lg:flex-row gap-10">
            <Card
            title="Easy to use"
            icon="easy-to-use.svg">
              Our app is easy to use if you aren't experimented with dev apps
            </Card>
            <Card
            title="Better workflow"
            icon="flow.svg">
              Prismaflow goal is making that your proyects have more workflow
            </Card>
            <Card
            title="Accessible prices"
            icon="price.svg">
              The prices are accessible from students to big company teams
            </Card>
          </div>
        </section>

        <section
        className="flex flex-col justify-center items-center bg-background gap-15 mt-10 text-text relative w-full timeline-view-y animate-zoom-in animate-range-[entry_0%_cover_30%] min-h-150 py-5">
          <p
          id="pricing"
          className="text-lg px-10 py-1 rounded-full bg-main shadow-md shadow-main/30">
            Pricing
          </p>

          <div className="flex flex-col md:flex-row w-full justify-center items-center md:gap-20 z-2 relative">

            <PricingCard
            plan="Free"
            cost="$0"
            benefits={[
              "2 proyects limit",
              "To do list",
              "Ticket creator",
            ]}/>

            <PricingCard
            plan="Pro"
            cost="$4"
            isRecomended={true}
            benefits={[
              "All free benefits +",
              "Unlimited proyects",
              "ERD Tool",
              "JSON viewer tool",
              "Prismaflow AI +"
            ]}/>

            <PricingCard
            plan="Enterprise"
            cost="$8"
            benefits={[
              "All pro plans +",
              "Chat IRT",
              "Kanban board",
              "Unlimited integrants",
              "Unlimited integrants",
              "Team roles",
              "Callendar",
            ]}/>

          </div>

          <div
          className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
            <div
            className="absolute aspect-square left-1/2 top-1/1 -translate-x-1/2 -translate-y-1/2 h-300 md:h-250 bg-main/60 blur-3xl rounded-full animate-pulse" />
            <div className="bg-linear-to-t from-background to-transparent w-screen h-50 left-0 bottom-0 absolute z-3 pointer-events-none"></div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}