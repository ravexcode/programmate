//view in client
"use client";

//React imports
import { useRef } from "react";

//Next imports
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

//Prebuilt components
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import IconCarousel from "@/components/icon-carrousel";

//Custom components
import SmoothProvider from "@/lib/components/lennis";
import Card from "@/components/ui/card";
import PricingCard from "@/components/ui/pricing-card";
import SnackBar, { showSnackbar } from "@/components/ui/snackbar";

//Hooks imports
import { useGetToken } from "@/hooks/useCookies";

//Landing page
export default function HomePage(){
  //NextJS Setup
  const router = useRouter();

  //Snackbar container
  const snackbar = useRef(null);

  //Payment action
  const handlePayment = async(plan: string) => {
    const token = useGetToken();

    if(!token) return router.push("/auth/login");

    const res = await fetch(
      '/api/payments/capture-payment',
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
          "Authorization": token
        },
        body: JSON.stringify({
          plan
        })
      }
    );

    const data = await res.json();

    if(res.status === 200) return router.push(data.checkout_link);

    showSnackbar(data.message, (res.status >= 500 ? "critic": "warn"), snackbar);
  }  
  return (
    <div className="bg-background min-h-dvh animate-fade-in">
      <SnackBar ref={snackbar} />

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
        className="text-text bg-background flex flex-col justify-center items-center gap-5 px-4 z-2 w-full timeline-view-y animate-zoom-in animate-range-[entry_0%_cover_10%]">
          <p
          className="text-lg px-10 py-1 rounded-full bg-main shadow-md shadow-main/30">
            Why Prismaflow?
          </p>

          <div className="flex flex-col gap-10">
            <Card
            title="Easy to use">
              Get started in minutes with a clean and intuitive interface designed for both
              beginners and professionals. Focus on building your projects instead of
              learning complicated software.
            </Card>

            <Card
            title="Better workflow">
              Replace scattered tools with a unified platform that connects planning,
              documentation, databases, and collaboration. Spend less time managing tools
              and more time delivering results.
            </Card>

            <Card
            title="Accessible pricing">
              Affordable plans for students, freelancers, startups, and enterprise teams.
              Scale your workspace as your projects grow without paying for unnecessary
              features.
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
            ]}
            action={async() => {
              await handlePayment("pro");
            }}/>

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
            ]}
            action={async() => {
              await handlePayment("team");
            }}/>

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