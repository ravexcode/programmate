"use client";

// Components imports
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";

function TechCard({ title, subtitle }) {
  return (
    <div className="flex flex-col items-start gap-1 p-6 rounded-xl border border-ultramarine-50/50 bg-background shadow-lg shadow-main/10 duration-400 timeline-[view(y)] animate-fade-in animate-range-[entry_0%_cover_30%] md:animate-range-[entry_0%_cover_30%]">
      <h3 className="text-xl font-semibold text-main">{title}</h3>
      <p className="text-text/70 font-light">
        {subtitle}
      </p>
    </div>
  );
}

export default function AboutPage() {
  return (
    <div className="bg-background min-h-dvh flex flex-col text-text">
      <Header />

      <main className="flex-1 flex flex-col items-center w-full">
        
        {/* Hero Section */}
        <section className="relative px-4 w-full min-h-[60vh] flex flex-col justify-center items-center text-center pt-24 pb-16 animate-fade-in">
          {/* Background Glow */}
          <div
          className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
            <div
            className="absolute block aspect-square left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-150 bg-main/40 blur-3xl rounded-full animate-pulse" />
          </div>

          <p className="text-sm md:text-base px-6 py-1.5 mb-6 rounded-full bg-ultramarine-950/60 text-main font-medium tracking-wide z-2">
            What is PrismaFlow?
          </p>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 max-w-4xl leading-tight z-2">
            Software made by programmers <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-main to-ultramarine-400">
              for programmers
            </span>
          </h1>
          <p className="text-lg text-text/80 max-w-2xl mx-auto mb-8 z-2">
            PrismaFlow gives you the essential tools for developing apps. From a simple todo-list and calendar, to real-time chat between friends and team members. Built to adapt to your workflow.
          </p>
        </section>

        {/* Philosophy & Scaling Section */}
        <section className="w-full max-w-6xl px-4 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 z-2 bg-background timeline-[view(y)] animate-zoom-in animate-range-[entry_0%_cover_30%]">
          <div className="relative rounded-2xl border border-ultramarine-50/30 overflow-hidden bg-ultramarine-950/20 aspect-square md:aspect-auto flex items-center justify-center">
             {/* Decorative abstract element or logo */}
             <div className="w-40 h-40 border-4 border-main/50 rounded-xl rotate-12 flex items-center justify-center shadow-2xl shadow-main/20 backdrop-blur-sm">
                <div className="w-20 h-20 bg-main/80 rounded-full animate-pulse"></div>
             </div>
          </div>
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl font-bold mb-4">Accessible for every stage</h2>
            <p className="text-text/70 text-lg leading-relaxed mb-6">
              We tried to make our limitations non-restrictive. Whether you are an indie programmer testing the waters with our <strong>Free</strong> tier, a freelancer leveraging our <strong>Pro</strong> tools, or scaling up with up to 30 people in our <strong>Team</strong> plan, we've got you covered.
              <br /><br />
              We are constantly evolving thanks to our exclusive <strong>Beta Testers</strong> and our core members who help us review and ship the newest functions.
            </p>
            <div className="flex gap-4 mt-2">
              <a href="/#pricing" className="text-main font-medium hover:underline underline-offset-4">
                Review our plans →
              </a>
            </div>
          </div>
        </section>

        {/* Backend & Tech Stack Section */}
        <section className="w-full bg-gradient-to-b from-transparent to-ultramarine-950/10 py-24 flex flex-col items-center px-4 timeline-[view(y)] animate-zoom-in animate-range-[entry_0%_cover_30%]">
          <div className="max-w-6xl w-full">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Under the Hood</h2>
              <p className="text-text/70 max-w-2xl mx-auto">
                A quick look at how we process your data and the technologies powering PrismaFlow. 
                <span className="block mt-2 text-sm italic opacity-60">
                  (And yes, the important information is safely stored in a .env, don't waste your time searching for it!)
                </span>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <TechCard 
                title="NextJS" 
                subtitle="(TypeScript)"
              />
              <TechCard 
                title="React" 
                subtitle="(TypeScript + HTML)"
              />
              <TechCard 
                title="TailwindCSS" 
                subtitle="(CSS)"
              />
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="w-full max-w-4xl mx-auto py-24 px-4 relative flex flex-col items-center timeline-[view(y)] animate-zoom-in animate-range-[entry_0%_cover_30%]">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Meet the Team</h2>
          
          <div className="w-full md:w-2/3 p-8 rounded-3xl border border-ultramarine-50/20 bg-ultramarine-950/30 backdrop-blur-sm shadow-xl flex flex-col md:flex-row items-center gap-8">
            <div className="w-24 h-24 rounded-full bg-main/20 flex-shrink-0 flex items-center justify-center overflow-hidden">
               <img src="https://avatars.githubusercontent.com/u/195974083?v=4" alt="Ravexcode profile" />
            </div>
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <h3 className="text-2xl font-bold text-text">José Rafael Martínez Bocanegra</h3>
              <p className="text-main font-medium mb-3">Project Manager | Designer | Developer</p>
              <p className="text-text/70 text-sm">
                The mind behind PrismaFlow (RavexCode). Building robust engineering tools with intelligent and minimalist design to improve the everyday workflow of programmers.
              </p>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}