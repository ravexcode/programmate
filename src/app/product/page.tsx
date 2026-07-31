"use client";

//Next imports
import Link from "next/link";

//Prebuilt ui components imports
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";

import SmoothProvider from "@/components/ui/smooth-provider";
import Image from "next/image";

export default function ProductPage() {
  return (
    <div
    className="min-h-screen grid grid-rows-[auto_1fr_auto] items-center">
      <Header />

      <main
      className="w-full flex flex-col items-center justify-start h-full py-10">
        <SmoothProvider />

        <section
        className="w-full relative flex flex-col gap-5 md:flex-row items-center justify-center overflow-hidden px-10 min-h-100">
          <div
          className="w-full flex items-center justify-center flex-col gap-5">
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
            className="w-100 gap-3 mr-auto grid grid-cols-2 text-center">
              <Link
              href="/register"
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
          className="w-full md:w-70 flex items-center justify-center h-full">
            <Image
            src="/logos/logo.svg"
            alt="NexZero logo"
            width={800}
            height={800}
            loading="lazy"
            className="animate-fade-in-left animate-duration-600 animate-ease-in-out aspect-square max-w-70" />
          </div>
        </section>

        <p
        className="text-5xl font-bold tracking-wide text-center animate-fade-in-up mt-30">
          Our vision <br />
        </p>
        <span
        className="text-center text-neutral-200 animate-fade-in-up animate-delay-200 mt-2 mb-20 w-150">
          Instead of forcing developers to adapt to disconnected tools, we believe software should adapt to the way people naturally work.
        </span>

        <p
        className="text-5xl font-bold tracking-wide text-center animate-fade-in-up mt-5">
          What makes the difference? <br />
        </p>
        <span
        className="text-center text-neutral-200 animate-fade-in-up animate-delay-200 mt-2 mb-20 w-150">
          AI isn&apos;t an add-on.
          It&apos;s part of the <span className="text-blue-500">workflow</span>
        </span>

        <p
        className="text-5xl font-bold tracking-wide text-center animate-fade-in-up mt-5">
          Build with intention <br />
        </p>
        <span
        className="text-center text-neutral-200 animate-fade-in-up animate-delay-200 mt-2 mb-20 w-1polished and genuinely useful.50">
          Every feature inside NexZero is built with one idea in mind: <br />
          <span className="text-blue-500">Good things require time</span> <br />
          Instead of releasing dozens of unfinished tools, we focus on creating experiences that are reliable, <span className="text-blue-500">polished and genuinely useful.</span>
        </span>

        <section
        className="flex flex-col items-center justify-center w-full">
          <p
          className="text-5xl font-bold tracking-wide text-center animate-fade-in-up my-5">
            Meet the creator
          </p>

          <div
          className="w-full flex items-center justify-center gap-10 max-w-150">
              <div
            className="flex flex-col items-center justify-center gap-5">
              <Image
              src="https://avatars.githubusercontent.com/u/195974083?v=4"
              alt="Ravexcode profile picture"
              loading="lazy"
              width={300}
              height={300}
              className="rounded-full aspect-square block w-30" />
            </div>

            <p
            className="text-start font-medium italic text-neutral-200 text-lg select-none">
              &quot;Every line of code, every interface and every decision is crafted with long-term quality in mind.&quot;
            </p>
          </div>

          <p
          className="text-center font-bold">
            José Martinez
            <span className="text-neutral-400 font-normal ml-5">@ravexcode</span>
          </p>
        </section>
      </main>

      <Footer />
    </div>
  )
}