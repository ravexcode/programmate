"use client";

//Prebuilt ui compontents
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";

//Scroll hook provider
import SmoothProvider from "@/lib/components/lennis";

export default function TOSPage() {
  return (
    <div
    className="min-h-screen bg-background grid grid-rows-[auto_1fr_auto] text-text">
      <Header />

      <main
      className="">
        <SmoothProvider />

        <section
        className="relative px-4 w-full min-h-200 flex flex-col justify-center items-center text-text py-10 animate-fade-in-up overflow-hidden">

          <div
          className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
            <div
            className="aspect-square block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-100 md:h-230 bg-main/60 blur-3xl rounded-full animate-pulse" />
            <div className="bg-linear-to-t from-background to-transparent w-screen h-50 left-0 bottom-0 absolute z-3 pointer-events-none"></div>
            <div className="bg-linear-to-b from-background to-transparent w-screen h-20 left-0 top-0 absolute z-3 pointer-events-none"></div>
          </div>

          <h1
          className="text-6xl font-bold mb-4 z-2 text-center">
            Terms of Service
          </h1>
          <p
          className="opacity-80 z-2 max-w-md text-center">
            These Terms of Service govern the access and use of PrismaFlow and
            all related services provided by PrismaFlow.
          </p>
        </section>

        <section
        className="p-10 flex flex-col items-center justify-center">

        </section>

      </main>

      <Footer />
    </div>
  )
}