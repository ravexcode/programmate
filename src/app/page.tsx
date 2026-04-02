"use client";

//Containers import
import MainContainer from "@/components/containers/main";

//functions import
import { useEffect, useRef, useState } from "react";

//Hooks import
import useIsVisible from "@/hooks/useIsVisible";

export default function HomePage() {
  const introContainer = useRef<HTMLElement | null>(null);
  const roadmapContainer = useRef<HTMLElement | null>(null);
  const featuresContainer = useRef<HTMLElement | null>(null);
  // @ts-ignore
  //First container animation
  const introContainerIsVisible = useIsVisible(introContainer);
  // @ts-ignore
  const roadmapContainerIsVisible = useIsVisible(roadmapContainer);
  // @ts-ignore
  const featuresContainerIsVisible = useIsVisible(featuresContainer);

  useEffect(() => {
    if (introContainerIsVisible && introContainer.current) {
      introContainer.current.classList.remove("opacity-0");
      introContainer.current.classList.add("show-element");
    }
  }, [introContainerIsVisible]);

  useEffect(() => {
    if (roadmapContainerIsVisible && roadmapContainer.current) {
      roadmapContainer.current.classList.remove("opacity-0");
      roadmapContainer.current.classList.add("show-element");
    }
  }, [roadmapContainerIsVisible]);

  useEffect(() => {
    if (featuresContainerIsVisible && featuresContainer.current) {
      featuresContainer.current.classList.remove("opacity-0");
      featuresContainer.current.classList.add("show-element");
    }
  }, [featuresContainerIsVisible]);

  const [activeQ, setActiveQ] = useState(1);

  const roadmapData = [
    {
      id: 1,
      title: "Q1: Approach",
      desc: 'This phase focuses on managing how the app will develop, the features it will have, its main appeal, and the target audience we will address within the market.',
    },
    {
      id: 2,
      title: "Q2: Design",
      desc: "The goals for this phase are to create logos for the app, a website design, and a complete structure of how the application will operate.",
    },
    {
      id: 3,
      title: "Q3: Proyect settings",
      desc: "The goal of this phase is to create essential items such as the repository, the foundations for launching a beta that is at least understandable, and to start using sketches as a base, which may change as this phase progresses.",
    },
    {
      id: 4,
      title: "Q4: Beta Testing",
      desc: "The focus is on gathering reviews, both positive and negative, and identifying the valid and invalid functions. These are addressed with updates.",
    },
    {
      id: 5,
      title: "Q5: Official launch",
      desc: "The project has succeeded and reached the intended audience, or at least it is being used as expected within the proposed framework.",
    },
    {
      id: 6,
      title: "Q6: Maintenance",
      desc: "We focus on following suggestions from our community, updating the app with bug fixes, code improvements, or design changes to refine the app.",
    },
  ];


  return (
    <MainContainer>
      <main className="flex flex-col justify-center items-center gap-15">
        {/* Main section container */}
        <section
          ref={introContainer}
          className="relative opacity-0 min-h-80 flex flex-col justify-center items-center p-4 transition-all duration-700 gap-7">

          <div className="aspect-square w-50 max-w-[95dvw] bg-radial-[at_25%_25%] from-amethyst-100 to-amethyst-500 rounded-full blur-3xl absolute sm:scale-x-150 md:scale-x-300 -rotate-15 left-[50%] -translate-x-[50%] opacity-40 md:top-10"></div>

          <div className="aspect-square sm:w-50 max-w-[95dvw] bg-radial-[at_25%_25%] from-amethyst-100 to-amethyst-500 rounded-full blur-3xl absolute sm:scale-x-150 md:scale-x-300 -rotate-15 left-[50%] -translate-x-[50%] opacity-40 scale-y-50 md:top-10"></div>

          <h1 className="z-2 font-medium text-4xl md:text-5xl text-text text-center max-w-100 md:max-w-150 text-amethyst-200">
            The <span className="text-amethyst-400">tool</span> made for developers from developers
          </h1>

          <div className="gap-5 flex flex-col md:flex-row">
            <a
            href="/about"
            className="rounded-full bg-primary duration-200 cursor-pointer shadow-lg hover:shadow-primary/30 hover:brightness-120 hover:scale-110 z-2 px-4 py-1 text-text">
              Take a look
            </a>
          </div>
        </section>



        <section ref={featuresContainer} className="w-full flex flex-col md:flex-row justify-center items-center px-4 py-2 gap-5 z-2">


          <section className="flex flex-col px-4 py-3 rounded-lg bg-amethyst-950 border border-amethyst-800 max-w-90 duration-300 shadow-xl hover:shadow-amethyst-700/10 hover:scale-103 hover:-translate-y-1 hover:border-amethyst-700 hover:brightness-120">
            <img src="/icons/easy-to-use.svg" alt="Icon made from StreamLineHQ"
            className="aspect-square w-7"/>
            <h3 className="text-amethyst-300 text-2xl">Easy to use</h3>
            
            <span className="h-2"></span>

            <p className="text-text">
              Our app is easy to use if you aren't experimented with devs apps.
            </p>
          </section>


          <section className="flex flex-col px-4 py-3 rounded-lg bg-amethyst-950 border border-amethyst-800 max-w-90 duration-300 shadow-xl hover:shadow-amethyst-700/10 hover:scale-103 hover:-translate-y-1 hover:border-amethyst-700 hover:brightness-120">
            <img src="/icons/flow.svg" alt="Icon made from StreamLineHQ"
            className="aspect-square w-7"/>
            <h3 className="text-amethyst-300 text-2xl">Better workflow</h3>
            
            <span className="h-2"></span>

            <p className="text-text">
              The goal of our App is make easier your workflow, as freelancer as group team.
            </p>
          </section>


          <section className="flex flex-col px-4 py-3 rounded-lg bg-amethyst-950 border border-amethyst-800 max-w-90 duration-300 shadow-xl hover:shadow-amethyst-700/10 hover:scale-103 hover:-translate-y-1 hover:border-amethyst-700 hover:brightness-120">
            <img src="/icons/price.svg" alt="Icon made from StreamLineHQ"
            className="aspect-square w-7"/>
            <h3 className="text-amethyst-300 text-2xl">Accessible prices</h3>
            
            <span className="h-2"></span>

            <p className="text-text">
              Our prices are accessible with an free plan and free trial of team plan for 30 days.
            </p>
          </section>

        </section>

        {/* Roadmap container */}
        <section ref={roadmapContainer} className="flex flex-col justify-center items-center w-full px-4 gap-8 py-10 opacity-0">
          <h2 className="text-3xl font-bold bg-linear-to-r from-primary via-text to-primary bg-clip-text bg-size-[200%] text-transparent">
            Our roadmap
          </h2>

          <section className="flex flex-col xl:flex-row justify-center items-stretch gap-4 w-full max-w-6xl">
            {roadmapData.map((item) => {
              const isActive = activeQ === item.id;

              return (
                <article
                  key={item.id}
                  onClick={() => setActiveQ(item.id)}
                  className={` max-w-[90dvw] group cursor-pointer rounded-xl overflow-hidden border border-white/10 transition-all duration-500 ease-in-out shadow-lg hover:shadow-amethyst-400/10 
                    ${isActive ? "md:flex-[2] bg-plum-section shadow-lg shadow-plum-section/20 shadow-amethyst-500/30 hover:shadow-amethyst-500/30" : "md:flex-[1] bg-plum-section/40 hover:bg-plum-section/70"}
                  `}>

                  <div className="p-5 md:min-h-50 h-full flex flex-col justify-start">
                    <h3 
                      className={`font-bold transition-colors duration-300 ${isActive ? "text-amethyst-400 text-xl" : "text-gray-400 text-lg group-hover:text-gray-200 whitespace-nowrap truncate"}`}>
                      {item.title}
                    </h3>

                    <div 
                      className={`grid transition-all duration-500 ease-in-out ${isActive ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0 mt-0"}`}>

                      <div className="overflow-hidden">
                        <p className="text-gray-300 text-sm leading-relaxed">
                          {item.desc}
                        </p>
                      </div>

                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        </section>
      </main>
    </MainContainer>
  );
}