//view in client
"use client";

//React imports
import { useRef, lazy, Suspense, useState } from "react";

//Next imports
import Link from "next/link";
import { useRouter } from "next/navigation";

//Prebuilt ui imports
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import LandingGradient from "@/components/ui/gradients/landing";
import SmoothProvider from "@/lib/components/lennis";
import SnackBar, { showSnackbar } from "@/components/ui/snackbar";
import ReactMarkdown from "react-markdown";

//Hooks imports
import { useGetToken } from "@/hooks/useCookies";
import { IconArrowLeft, IconSend } from "@tabler/icons-react";
import useAnimationClose from "@/hooks/useAnimationClose";

//Landing page
export default function HomePage(){
  //NextJS Setup
  const router = useRouter();

  const [ exampleInput, setExampleInput ] = useState("Build me a new project for a e-shop to sell products");

  const snackbar = useRef(null);
  const message = useRef(null);
  const exampleChat = useRef(null);

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

  const showExample = () => {
    setExampleInput("");

    if(
      !message.current ||
      !exampleChat.current
    ) return;

    const msgcurr : HTMLElement = message.current;
    const exchacurr : HTMLElement = exampleChat.current;

    msgcurr.classList.add("animate-fade-out-down");

    const close_animation = (e: AnimationEvent) => {
      if(e.animationName !== "fade-out-down") return;

      msgcurr.classList.replace("flex", "hidden");
      exchacurr.classList.replace("hidden", "flex");
      return;
    }

    msgcurr.addEventListener("animationend", (e: AnimationEvent) => close_animation(e));

    msgcurr.removeEventListener("animationend",  (e: AnimationEvent) => close_animation(e));
    return;
  };

  const exampleMessage = `Ok, let's get started...

Setting project name...\n
✓ Project initialized successfully

Project Details
---

Title:\n
Modern E-Shop Platform

Description:\n
A scalable e-commerce platform designed to sell physical and digital products. Features include product catalog management, customer accounts, shopping cart functionality, order tracking, payment integration, inventory management, and analytics dashboards.

Status:\n
Planning

Tags:\n
E-Commerce\n
Web Application\n
Next.js\n
React\n
TypeScript\n
Node.js\n
PostgreSQL\n
Stripe\n
TailwindCSS\n

Generating Entity Relationship Diagram...\n
✓ ERD created

Entities:
- Users
- Products
- Categories
- Orders
- Order Items
- Payments
- Reviews
- Addresses

Generating Kanban Board...\n
✓ Board created

Columns:

Backlog
- Define business requirements
- Research payment providers
- Create product structure

To Do
- Design database schema
- Create authentication system
- Build product catalog page

In Progress
- Project setup

Review
- Empty

Done
- Project initialization

Generating Calendar...\n
✓ Calendar created

Upcoming Milestones:

Week 1
- Requirements gathering
- Database design

Week 2
- Authentication
- User profiles

Week 3
- Product management

Week 4
- Shopping cart and checkout

Week 5
- Payment integration

Week 6
- Testing and deployment

Project ready.\n
You can now start planning tasks, designing workflows, and managing development progress.`

  return (
    <div className="bg-background min-h-dvh animate-fade-in">
      <SnackBar ref={snackbar} />

      <Header />

      <main
      className="flex flex-col justify-center items-center mb-10">
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
              <div
              className="w-300 aspect-video flex items-center justify-center"> Loading presentation dashboard... </div>
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

        {/* AI Workflow feature */}
        <section
        className="w-full p-3 flex flex-col items-center justify-center relative animate-range-[entry_0%_cover_20%] timeline-view-y animate-zoom-in">
          <p
          className="text-4xl font-semibold z-2">
            AI for workflows
          </p>

          <div
          className="w-300 h-168 rounded-sm border border-neutral-800 bg-neutral-950 mt-6 block aspect-video z-2 animate-range-[entry_0%_cover_50%] timeline-view-y animate-fade-in-up">
            <section
            className="grid grid-rows-[auto_1fr_auto] cursor-default text-sm w-full h-full animate-fade-in animate-duration-300">
              <header
              className="w-full flex items-center justify-between p-2 border-b border-neutral-800 animate-fade-in animate-duration-400">
                <div
                className="flex gap-2 items-center py-2 px-5 duration-300 rounded-md hover:bg-neutral-900 animate-fade-in-down">
                  <IconArrowLeft
                  size={15} />
                  Go back
                </div>
                
                <p
                className="flex gap-2 items-center py-2 px-4 rounded-md duration-300 hover:bg-neutral-900 animate-fade-in-down">
                  Claude
                  <span
                  className="opacity-70">
                    Opus 4.8
                  </span>
                </p>
              </header>

              <main
              className="flex items-center justify-center w-full h-full overflow-auto">
                <p
                className="text-4xl tracking-wide opacity-80 animate-fade-in-up flex animate-duration-300"
                ref={message}>
                  What are we building today?
                </p>

                <section
                className="max-h-full w-230 hidden flex-col items-center justify-start p-10"
                ref={exampleChat}>
                  <p
                  className="max-w-200 ml-auto p-3 rounded-md rounded-br-none bg-neutral-800 w-max animate-fade-in-up animate-duration-400">
                    Build me a new project for a e-shop to sell products
                  </p>

                  <div
                  className="max-w-200 w-max rounded-md rounded-bl-none p-3 mr-auto animate-fade-in animate-duration-500">
                    <ReactMarkdown
                    components={{
                      hr: (props) => (
                        <hr
                          className="my-6 border-0 min-h-px bg-neutral-700 w-full"
                          {...props}
                        />
                      ),

                      h1: (props) => (
                        <h1
                          className="text-2xl font-bold text-white mb-4"
                          {...props}
                        />
                      ),

                      h2: (props) => (
                        <h2
                          className="text-xl font-semibold text-white mt-6 mb-3"
                          {...props}
                        />
                      ),

                      h3: (props) => (
                        <h3
                          className="text-lg font-medium text-white mt-5 mb-2"
                          {...props}
                        />
                      ),

                      p: (props) => (
                        <p
                          className="text-neutral-300 leading-relaxed mb-3"
                          {...props}
                        />
                      ),

                      ul: (props) => (
                        <ul
                          className="list-disc pl-6 space-y-1 text-neutral-300 mb-4"
                          {...props}
                        />
                      ),

                      ol: (props) => (
                        <ol
                          className="list-decimal pl-6 space-y-1 text-neutral-300 mb-4"
                          {...props}
                        />
                      ),

                      li: (props) => (
                        <li
                          className="marker:text-neutral-500"
                          {...props}
                        />
                      ),

                      strong: (props) => (
                        <strong
                          className="font-semibold text-white"
                          {...props}
                        />
                      ),

                      code: (props) => (
                        <code
                          className="bg-neutral-800 text-blue-400 px-1.5 py-0.5 rounded text-sm"
                          {...props}
                        />
                      ),

                      pre: (props) => (
                        <pre
                          className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 overflow-x-auto mb-4"
                          {...props}
                        />
                      ),

                      blockquote: (props) => (
                        <blockquote
                          className="border-l-4 border-blue-500 pl-4 italic text-neutral-400 my-4"
                          {...props}
                        />
                      ),
                    }}
                  >
                    {exampleMessage}
                  </ReactMarkdown>
                  </div>
                </section>
              </main>

              <footer
              className="mx-auto gap-3 p-3 mb-3 w-200 flex items-center">
                <input
                value={exampleInput}
                onChange={() => {}}
                type="text"
                className="rounded-md bg-neutral-900 border border-neutral-700 duration-300 outline-none focus:border-main p-2 w-full animate-fade-in-up"
                placeholder="Ask me anything" />

                <button
                type="button"
                className="bg-main flex gap-2 py-1.5 px-4 rounded-md items-center duration-300 hover:bg-main/70 animate-fade-in-up"
                onClick={showExample}>
                  <IconSend size={15} />
                  Send
                </button>
              </footer>
            </section>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}