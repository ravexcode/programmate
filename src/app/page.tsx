//view in client
"use client";

//Components imports
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";

import IconCarousel from "@/components/icon_carrousel";

//Gradient ball container
function GradientBall({
  size = 100,
  position = "absolute",
  top = "50%",
  x = "-50%",
  y = "-50%",
}: any) {
  return (
    <div
      className="aspect-square bg-main/40 blur-3xl rounded-full animate-pulse left-[150%] md:left-[100%]"
      style={{
        height: size,
        position,
        top,
        transform: `translate(${x}, ${y})`,
      }}
    />
  );
}

function Card(props: any) {
  return (
    <section 
    className="rounded-xl border border-ultramarine-50/50 px-6 py-3 bg-background flex flex-col justify-center items-center gap-1 w-75 text-start shadow-lg shadow-main/20 duration-400 hover:shadow-main/50 hover:-translate-y-2 hover:scale-105 cursor-default timeline-scroll animate-zoom-in animate-range-[entry_-10%_cover_60%] md:animate-range-[entry_40%_cover_90%]">
      <h2 
      className="text-xl text-main w-full font-semibold">
        {props.title}
      </h2>
      <p
      className="w-full">
        {props.children}
      </p>
    </section>
  )
}

//Landing page
export default function HomePage(){
  return (
    <div className="bg-background min-h-dvh">
      <Header />

      <main
      className="flex flex-col justify-center items-center mb-auto">

        <section
        className="relative px-4 w-full min-h-90 flex flex-col justify-center items-start w-full text-text pt-20 animate-fade-in overflow-hidden">
          <GradientBall
          size="60rem"
          display="absolute"
          top="50%"
          />

          <h1
          className="text-6xl font-bold mb-4 z-2">
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

          <img src="/images/dashboard.png" alt="Dashboard made by Canva AI"
          className="z-2 w-[95%] md:w-[80%] max-w-300 mt-10 mx-auto rounded-xl md:rounded-4xl"/>
        </section>

        <IconCarousel />

        <section 
        className="text-text bg-background flex flex-col justify-center items-center gap-5 px-4 py-10 z-2 w-full">
          <p
          className="text-lg px-10 py-1 rounded-full bg-ultramarine-950/60">
            features
          </p>

          <div className="flex flex-col lg:flex-row gap-10">
            <Card title="Easy to use">
              Our app is easy to use if you aren't experimented with dev apps
            </Card>
            <Card title="Easy to use">
              Our app is easy to use if you aren't experimented with dev apps
            </Card>
            <Card title="Easy to use">
              Our app is easy to use if you aren't experimented with dev apps
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}