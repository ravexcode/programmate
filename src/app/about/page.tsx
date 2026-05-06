//Client section
"use client";

//Next imports
import Image from "next/image";

//Prebuilt components
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";

//Custom components
import SmoothProvider from "@/lib/components/lennis";

interface FeaturesCardProps{
  title: string,
  description: string,
  image_url: string
}

function FeaturesCard(props: FeaturesCardProps) {
  return (
    <section 
    className="rounded-xl border border-neutral-800 px-12 py-8 bg-neutral-950 flex flex-col justify-center items-center gap-5 max-w-[80dvw] w-lg text-start shadow-xl shadow-main/5 duration-400 hover:shadow-lg hover:shadow-main/10 hover:-translate-y-1 hover:border-main cursor-default timeline-[view(y)] animate-fade-in animate-range-[entry_0%_cover_30%]">
      <article
      className="flex flex-col gap-1 w-full">
        <h2 
        className="text-xl font-semibold text-sky-600 tracking-wider w-full text-start">
          { props.title }
        </h2>
        <p
        className="w-full font-light text-start">
          { props.description }
        </p>
      </article>

      <Image
      src={props.image_url}
      alt="Foto real took by RavexCode"
      width={600}
      height={600} />
    </section>
  )
}

export default function AboutPage(){
  return (
    <div
    className="min-h-screen bg-background grid grid-rows-[auto_1fr_auto]">
      <Header />
      <SmoothProvider />

      <main
      className="flex flex-col justify-start items-center pb-10">

        <section
        className="flex flex-col justify-center items-center relative animate-fade-in-up overflow-hidden w-full text-text min-h-220">
          <div
          className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
            <div
            className="aspect-square block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-120 md:w-200 bg-main/40 blur-3xl rounded-full animate-pulse" />
            <div className="bg-linear-to-t from-background to-transparent w-full h-20 left-0 bottom-0 absolute z-3 pointer-events-none"></div>
            <div className="bg-linear-to-b from-background to-transparent w-full h-20 left-0 top-0 absolute z-3 pointer-events-none"></div>
          </div>

          <h1
          className="text-6xl font-bold mb-4 z-2 text-center px-6">
            More than <br />
            "All in one"
          </h1>
          <p
          className="opacity-80 z-2 max-w-100 text-center px-6">
            Centralize your workflow, reduce errors and improve collaboration without extra tools.
          </p>
        </section>

        <section 
        className="text-text bg-background flex flex-col justify-center items-center gap-10 px-8 z-2 w-full timeline-[view(y)] animate-zoom-in animate-range-[entry_0%_cover_20%]">
          <p
          className="text-lg px-10 py-1 rounded-full bg-main shadow-md shadow-main/30"
          id="features">
            features
          </p>

          <article
          className="flex flex-wrap justify-center items-center gap-10">

            <FeaturesCard
            title="To Do list"
            description="A way to get order in your projects"
            image_url="/images/dashboard.png" />
            
            <FeaturesCard
            title="Ticket creator"
            description="Your teammates and your work organized in tickets!"
            image_url="/images/tickets.png" />
            
            <FeaturesCard
            title="ERD Creator Tool"
            description="More organized DB datas"
            image_url="/images/dashboard.png" />
            
            <FeaturesCard
            title="JSON Preview"
            description="Looking the JSON data in interface"
            image_url="/images/dashboard.png" />
            
            <FeaturesCard
            title="Chat IRT"
            description="For you and your team"
            image_url="/images/dashboard.png" />
            
            <FeaturesCard
            title="Kanban board"
            description="Organize your workflow"
            image_url="/images/dashboard.png" />
            
            <FeaturesCard
            title="Team callendar"
            description="For reunions and more!"
            image_url="/images/dashboard.png" />

          </article>
        </section>

          <section
          id="contact"
          className="flex flex-col justify-center items-center gap-4 mt-20 mb-24 px-4 text-text relative w-full max-w-4xl mx-auto timeline-[view(y)] animate-zoom-in animate-range-[entry_0%_cover_30%]">
          <p
          className="text-lg px-10 py-1 rounded-full bg-main shadow-md shadow-main/30">
            Contact us
          </p>
          <p className="mb-8 text-xl opacity-80 font-light text-center">
            Connect with our community and support team
          </p>

          <article className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            <a href="#" className="flex items-center justify-between px-6 py-4 rounded-xl bg-neutral-950 border border-neutral-800 duration-300 hover:border-main hover:shadow-lg hover:shadow-main/10 hover:-translate-y-1 group">
              <h4 className="font-semibold text-lg group-hover:text-main transition-colors"> YouTube </h4>
              <p className="font-light opacity-70 group-hover:opacity-100 transition-opacity"> @prismaflow </p>
            </a>
            
            <a href="#" className="flex items-center justify-between px-6 py-4 rounded-xl bg-neutral-950 border border-neutral-800 duration-300 hover:border-main hover:shadow-lg hover:shadow-main/10 hover:-translate-y-1 group">
              <h4 className="font-semibold text-lg group-hover:text-main transition-colors"> X (Twitter) </h4>
              <p className="font-light opacity-70 group-hover:opacity-100 transition-opacity"> @prismaflow </p>
            </a>

            <a href="#" className="flex items-center justify-between px-6 py-4 rounded-xl bg-neutral-950 border border-neutral-800 duration-300 hover:border-main hover:shadow-lg hover:shadow-main/10 hover:-translate-y-1 group">
              <h4 className="font-semibold text-lg group-hover:text-main transition-colors"> Reddit </h4>
              <p className="font-light opacity-70 group-hover:opacity-100 transition-opacity"> r/prismaflow </p>
            </a>

            <a href="#" className="flex items-center justify-between px-6 py-4 rounded-xl bg-neutral-950 border border-neutral-800 duration-300 hover:border-main hover:shadow-lg hover:shadow-main/10 hover:-translate-y-1 group">
              <h4 className="font-semibold text-lg group-hover:text-main transition-colors"> Facebook </h4>
              <p className="font-light opacity-70 group-hover:opacity-100 transition-opacity"> Prismaflow </p>
            </a>
          </article>
        </section>
      </main>

      <Footer />
    </div>
  )
}