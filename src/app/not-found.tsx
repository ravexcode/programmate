"use client";

//Prebuilt ui imports
import PageLayout from "@/components/layouts/page";
import Link from "next/link";

export default function NotFoundPage(){
  return (
    <PageLayout>
      <main
      className="w-full min-h-200 relative flex flex-col items-center justify-center animate-fade-in-up">
        <div
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <div
          className="aspect-square block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-100 md:h-230 bg-main/40 blur-3xl rounded-full animate-pulse" />
          <div className="bg-linear-to-t from-background to-transparent w-screen h-20 left-0 bottom-0 absolute z-3 pointer-events-none"></div>
          <div className="bg-linear-to-b from-background to-transparent w-screen h-20 left-0 top-0 absolute z-3 pointer-events-none"></div>
        </div>

        <p
        className="text-8xl text-center z-2 font-medium tracking-wide">
          404
        </p>
        <span
        className="text-xl z-2 opacity-70 font-light">
          Page not found
        </span>

        <Link
        href="/"
        className="mt-5 duration-400 hover:bg-neutral-100/20 z-2 py-2 px-6 rounded-xl">
          Go back to home
        </Link>
      </main>
    </PageLayout>
  )
}