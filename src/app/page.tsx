//view in client
"use client";

//Prebuilt components
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";

import IconCarousel from "@/components/icon_carrousel";

function Card(props: any) {
  return (
    <section 
    className="rounded-xl border border-neutral-800 px-6 py-3 bg-neutral-950 flex flex-col justify-center items-start gap-1 w-75 text-start shadow-lg shadow-ultramarine-700/20 duration-400 hover:shadow-ultramarine-700/50 hover:-translate-y-2 hover:scale-105 cursor-default timeline-[view(y)] animate-fade-in animate-range-[entry_0%_cover_30%]">
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

function PricingCard(props: any){
  return (
    <div
    className={"flex flex-col px-6 py-4 rounded-xl h-100 shadow-lg shadow-ultramarine-950/50 mb-10 w-60 timeline-[view(y)] animate-fade-in animate-range-[entry_0%_cover_30%] relative bg-neutral-950 " + ( props.isRecomended && "scale-110" )}>
      {props.isRecomended ? (
        <div>
          <span
          className="absolute -translate-y-6 -translate-x-10 px-3 py-1 rounded-md bg-main">
            Recomended
          </span>

          <span className="h-5 md:h-3 block"></span>
        </div>
      ) : null}
      <p className="text-sm font-light">{props.plan} plan</p>
      <h3 className="text-2xl font-semibold"> {props.cost} </h3>

      <span className="h-3 block"></span>

      {props.benefits.map((value : any, index : any) => (
        <div
        key={"price_" + props.plan + "_" + index}
        className="text-text/80">
          ✓ {value}
        </div>
      ))}

      <button
      className="w-full py-1 rounded-full mt-auto bg-main shadow-lg shadow-ultramarine-700/20 duration-300 hover:shadow-ultramarine-700/50 hover:scale-105 hover:-translate-y-1 cursor-pointer">
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

        <section
        className="relative px-4 w-full min-h-90 flex flex-col justify-center items-center w-full text-text pt-20 pb-10 animate-fade-in-up overflow-hidden">

          <div
          className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
            <div
            className="aspect-square block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-250 bg-main/40 blur-3xl rounded-full animate-pulse" />
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
            <a
            href="/about"
            className="bg-main rounded-lg px-6 py-1 duration-200 hover:brightness-80">
              Take a look
            </a>
          </div>

          <img src="/images/dashboard.png" alt=""
          className="z-2 w-[95%] md:w-[80%] max-w-300 mt-10 mx-auto rounded-xl md:rounded-4xl border-2 border-neutral-800"/>
        </section>

        <IconCarousel />

        <span className="h-10"></span>

        <section 
        className="text-text bg-background flex flex-col justify-center items-center gap-5 px-4 z-2 w-full timeline-[view(y)] animate-zoom-in animate-range-[entry_0%_cover_30%]">
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
        className="flex flex-col justify-center items-center bg-background gap-15 mt-10 text-text relative w-full timeline-[view(y)] animate-zoom-in animate-range-[entry_0%_cover_30%] min-h-150 py-5">
          <p
          id="pricing"
          className="text-lg px-10 py-1 rounded-full bg-main shadow-md shadow-main/30">
            Pricing
          </p>

          <div className="flex flex-col md:flex-row w-full justify-center items-center md:gap-20 z-2 relative">

            <PricingCard
            plan="Free"
            cost="Free"
            benefits={[
              "2 proyects limit",
              "To do list",
              "Ticket creator",
              "JSON Editor",
            ]}/>

            <PricingCard
            plan="Pro"
            cost="$4 USD/month"
            isRecomended={true}
            benefits={[
              "All free benefits +",
              "Unlimited proyects",
              "ERD Tool",
              "JSON viewer tool",
            ]}/>

            <PricingCard
            plan="Team"
            cost="$8 USD/month"
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
            className="absolute aspect-square left-1/2 top-1/1 -translate-x-1/2 -translate-y-1/2 h-250 bg-main/40 blur-3xl rounded-full animate-pulse" />
            <div className="bg-linear-to-t from-background to-transparent w-screen h-50 left-0 bottom-0 absolute z-3 pointer-events-none"></div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}