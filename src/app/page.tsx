//view in client
"use client";

//React imports
import { useRef, lazy, Suspense } from "react";

//Next imports
import Link from "next/link";
import { useRouter } from "next/navigation";

//Prebuilt ui imports
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import LandingGradient from "@/components/ui/gradients/landing";
import SmoothProvider from "@/lib/components/lennis";
import Card from "@/components/ui/card";
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
  };

  //Lazy loading
  //Carousel consumes many resources because it renders images
  const IconCarousel = lazy(() => import("@components/icon-carrousel"));
  //Mini dashboard has too many components/animations
  const MiniDashboard = lazy(() => import("@components/ui/mini-dashboard/main"));

  return (
    <div className="bg-background min-h-dvh animate-fade-in">
      <SnackBar ref={snackbar} />

      <Header />

      <main
      className="flex flex-col justify-center items-center">
        <SmoothProvider />
        <section
        className="relative px-4 w-full min-h-screen flex flex-col justify-center items-center text-text pt-20 pb-10 animate-fade-in-up overflow-hidden z-2">
          <LandingGradient scale={150} />

          <h1
          className="text-6xl font-bold mb-4 z-2 text-center animate-fade-in-down">
            Built to improve <br />
            your team workflow
          </h1>
          <p
          className="opacity-80 z-2 animate-fade-in-down">
            For design, development, code, databases and more!
          </p>

          <div
          className="w-full md:w-[50%] flex justify-center items-center mt-5 z-2 animate-fade-in-up">
            <Link
            href="/about"
            className="bg-main rounded-full px-12 py-2 duration-200 hover:brightness-120 hover:-translate-y-0.5">
              Take a look
            </Link>
          </div>

          <div
          className="w-max mx-auto px-5 overflow-hidden flex items-center justify-start">
            <Suspense
            fallback={
              <div> Loading presentation dashboard... </div>
            }>
              <MiniDashboard />
            </Suspense>
          </div>
        </section>

        <Suspense
        fallback={
          <div> Loading carousel... </div>
        }>
          <IconCarousel />
        </Suspense>

        <span className="h-10"></span>

        {/* Features */}
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
      </main>

      <Footer />
    </div>
  )
}