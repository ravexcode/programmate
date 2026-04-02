"use client";

//Containers import
import MainContainer from "@/components/containers/main";

//functions import
import { useEffect, useRef } from "react";

//Hooks import
import useIsVisible from "@/hooks/useIsVisible";

export default function AboutPage() {
  const topContainer = useRef(null);
  const pricesContainer = useRef(null);
  const contactContainer = useRef(null);
  // @ts-ignore
  const topContainerIsVisible = useIsVisible(topContainer);
  // @ts-ignore
  const pricesContainerIsVisible = useIsVisible(pricesContainer);
  // @ts-ignore
  const contactContainerIsVisible = useIsVisible(contactContainer);

  useEffect(() => {
    if (topContainerIsVisible && topContainer.current) {
      topContainer.current.classList.remove("opacity-0");
      topContainer.current.classList.add("show-element");
    }
  }, [topContainerIsVisible]);

  useEffect(() => {
    if (pricesContainerIsVisible && pricesContainer.current) {
      pricesContainer.current.classList.remove("opacity-0");
      pricesContainer.current.classList.add("show-element");
    }
  }, [pricesContainerIsVisible]);

  useEffect(() => {
    if (contactContainer && contactContainer.current) {
      contactContainer.current.classList.remove("opacity-0");
      contactContainer.current.classList.add("show-element");
    }
  }, [contactContainer]);

  return (
    <MainContainer>
      <main
      className="flex flex-col justify-center items-center py-3 gap-10">
        <section
        ref={topContainer}
        className="opacity-0 bg-[url(/images/banner_1.png)] bg-center bg-cover  min-h-40 md:min-h-80 w-[98%] rounded-md relative flex flex-col justify-center items-center z-1 rounded-md">
          <div className="w-full h-full absolute bg-linear-to-t from-background from-20% to-transparent z-2"></div>

          <h2 className="text-3xl md:text-5xl font-semibold text-text z-3 max-w-[70dvw] text-center">
            Upgrade the workflow in your proyect with <span className="text-amethyst-400">PrismaFlow</span>
          </h2>
        </section>



        <section
        id="prices"
        ref={pricesContainer}
        className="flex flex-col gap-7 w-full justify-center items-center opacity-0">
          <h2 className="text-4xl font-bold text-amethyst-500 text-center">
            Our subscription plans
          </h2>

          <div
          className="flex flex-col md:flex-row gap-7 justify-center items-center">
            <section
            className="px-4 pt-2 pb-4 min-h-80 w-50 border-2 border-amethyst-800 rounded-lg flex flex-col justify-start items-center bg-amethyst-950 shadow-lg duration-200 hover:shadow-amethyst-800/50">

              <h2 className="text-xl font-medium text-amethyst-300">Free</h2>
              <p className="text-text/70 text-center mb-2">Free plan</p>
              <div className="w-full text-start">
                <p className="text-amethyst-200 font-medium">You will have</p>
                <p className="text-text">✓ To Do List</p>
                <p className="text-text">✓ Kanban board</p>
                <p className="text-text">✓ 2 proyects limit</p>
              </div>

              <button
              className="text-text px-2 py-1 rounded-md bg-amethyst-500 mt-auto duration-200 hover:scale-110 hover:brightness-110 cursor-pointer disabled:grayscale disabled:hover:scale-100 disabled:hover:brightness-100 disabled:cursor-not-allowed" disabled>
                Already got
              </button>
            </section>


            <section
            className="px-4 pt-3 pb-4 min-h-100 w-55 border-2 border-amethyst-700 rounded-lg flex flex-col justify-start items-center bg-amethyst-900 shadow-lg duration-200 hover:shadow-amethyst-700/50 relative">
              <span
              className="absolute -translate-y-7 -translate-x-20 rounded-sm bg-amethyst-500 p-1 text-sm text-text">
               Recomended
              </span>

              <h2 className="text-xl font-medium text-amethyst-300">$4</h2>
              <p className="text-text/70 text-center mb-2">Pro plan</p>
              <div className="w-full text-start">
                <p className="text-amethyst-200 font-medium">You will have</p>
                <p className="text-text">✓ All the free benefits</p>
                <p className="text-text">✓ No proyects limit</p>
                <p className="text-text">✓ ERD Creator Tool</p>
                <p className="text-text">✓ Pro Tag</p>
              </div>

              <button
              className="text-text px-2 py-1 rounded-md bg-amethyst-500 mt-auto duration-200 hover:scale-110 hover:brightness-110 cursor-pointer">
                Get this plan
              </button>
            </section>
            

            <section
            className="px-4 pt-2 pb-4 min-h-80 w-50 border-2 border-amethyst-800 rounded-lg flex flex-col justify-start items-center bg-amethyst-950 shadow-lg duration-200 hover:shadow-amethyst-800/50">

              <h2 className="text-xl font-medium text-amethyst-300">$10</h2>
              <p className="text-text/70 text-center mb-2">Team plan</p>
              <div className="w-full text-start">
                <p className="text-amethyst-200 font-medium">You will have</p>
                <p className="text-text">✓ All the Pro and Free benefits</p>
                <p className="text-text">✓ Team chat</p>
                <p className="text-text">✓ Callendar</p>
                <p className="text-text">✓ Roles </p>
                <p className="text-text">✓ Team tag </p>
              </div>

              <button
              className="text-text px-2 py-1 rounded-md bg-amethyst-500 mt-auto duration-200 hover:scale-110 hover:brightness-110 cursor-pointer">
                Get this plan
              </button>
            </section>

          </div>
          
          <div className="flex gap-1 w-full justify-center items-start md:items-center px-2 text-sm">
            <img src="/icons/info.svg" alt="Icon made from StreamLineH"
            className="aspect-square w-4 invert opacity-50"/>
            <p className="text-text/50">All payments are monthly and in dollars</p>
          </div>
        </section>

        <section 
          className="text-text px-6 py-16 md:py-24 gap-12 flex flex-col justify-center items-center w-full max-w-5xl mx-auto opacity-0" 
          id="contact" 
          ref={contactContainer}>

          <h2 className="text-4xl md:text-5xl font-bold text-amethyst-500 text-center w-full">
            Contact us
          </h2>

          <div className="flex flex-col md:flex-row w-full gap-12 md:gap-16 justify-between items-start">
            
            {/* Redes Sociales */}
            <article className="w-full md:w-1/2 flex flex-col justify-center items-center md:items-start gap-8">
              <h3 className="text-2xl md:text-3xl font-bold text-amethyst-400 text-center md:text-left w-full">
                Our social media
              </h3>
              
              <div className="flex flex-col gap-5 text-lg w-full max-w-xs mx-auto md:mx-0">
                <p className="flex gap-4 items-center">
                  <img src="/icons/youtube.svg" alt="YouTube Icon" className="aspect-square rounded-md w-7"/>
                  <span>@PrismaFlow</span>
                </p>
                <p className="flex gap-4 items-center">
                  <img src="/icons/facebook.svg" alt="Facebook Icon" className="aspect-square rounded-md w-7"/>
                  <span>PrismaFlow</span>
                </p>
                <p className="flex gap-4 items-center">
                  <img src="/icons/reddit.svg" alt="Reddit Icon" className="aspect-square rounded-md w-7"/>
                  <span>r/prismaflow</span>
                </p>
                <p className="flex gap-4 items-center">
                  <img src="/icons/x.svg" alt="X Icon" className="aspect-square rounded-md w-7"/>
                  <span>@prismaflow</span>
                </p>
              </div>
            </article>

            {/* Formulario */}
            <form className="w-full md:w-1/2 flex flex-col gap-6 p-8 bg-amethyst-950 rounded-xl border border-amethyst-500 shadow-lg text-text">
              <h3 className="text-xl font-bold text-amethyst-400 mb-2">
                Send us a message
              </h3>

              {/* Campo: Nombre */}
              <div className="flex flex-col justify-start items-start w-full gap-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Name
                </label>
                <input 
                  type="text" 
                  id="name"
                  className="w-full p-3 rounded-md bg-amethyst-900/40 border border-amethyst-700 placeholder:text-gray-400 focus:outline-none focus:border-amethyst-400 focus:ring-1 focus:ring-amethyst-400 transition-all" 
                  placeholder="John Doe" />
              </div>

              {/* Campo: Email */}
              <div className="flex flex-col justify-start items-start w-full gap-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Insert your email <span className="text-amethyst-300">*</span>
                </label>
                <input 
                  type="email" 
                  id="email"
                  required
                  className="w-full p-3 rounded-md bg-amethyst-900/40 border border-amethyst-700 placeholder:text-gray-400 focus:outline-none focus:border-amethyst-400 focus:ring-1 focus:ring-amethyst-400 transition-all" 
                  placeholder="myemail@email.com" />
              </div>

              {/* Campo: Mensaje */}
              <div className="flex flex-col justify-start items-start w-full gap-2">
                <label htmlFor="message" className="text-sm font-medium">
                  Message <span className="text-amethyst-300">*</span>
                </label>
                <textarea 
                  id="message"
                  rows="4"
                  required
                  className="w-full p-3 rounded-md bg-amethyst-900/40 border border-amethyst-700 placeholder:text-gray-400 focus:outline-none focus:border-amethyst-400 focus:ring-1 focus:ring-amethyst-400 transition-all resize-none" 
                  placeholder="How can we help you?" ></textarea>
              </div>

              {/* Botón de Envío */}
              <button 
                type="submit" 
                className="mt-4 w-full py-3 px-6 bg-amethyst-600 hover:bg-amethyst-500 text-white font-bold rounded-md transition-colors cursor-pointer">
                Submit
              </button>
            </form>
            
          </div>
        </section>
      </main>
    </MainContainer>
  )
}