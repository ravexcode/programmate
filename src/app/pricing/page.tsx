"use client";

//Next imports
import { useRouter } from "next/navigation";

//React imports
import { useState, useRef } from "react";

//Prebuilt UI imports
import PageLayout from "@/components/layouts/page";
import PricingCard from "@/components/marketing/pricing-card";
import SnackBar from "@/components/ui/snackbar";

//Providers imports
import SmoothProvider from "@/lib/components/lennis";

//Services imports
import { getSessionStr } from "@/services/session.service";

//Modules imports
import { capture } from "@/modules/payments/capture.module";

export default function PricingPage() {
  const router = useRouter();

  const benefits = {
    free: [
      "2 project limit",
      "To-do list",
      "Database diagram",
      "Flowchart builder",
      "AI workflow generation (BYO API Key)",
      "Kanban board",
      "Calendar",
      "Issue Tracking",
    ],
    pro: [
      "Everything in Free",
      "Unlimited projects",
      "Access to free AI models",
      "GitHub integration",
      "Private projects",
      "Custom profile pictures",
      "Pro badge",
    ],
    enterprise: [
      "Everything in Pro",
      "Unlimited team members",
      "Slack integration",
      "Early access to new features",
      "Priority support",
    ]
  };

  const [ canPay ] = useState(() => {
    const token = getSessionStr();
    return !!token;
  });
  const [ loading, setLoading ] = useState(false);

  const snackbar = useRef(null)

  return (
    <PageLayout>
      <SnackBar
      ref={snackbar} />

      <main
      className="relative flex items-start justify-center">
        <SmoothProvider />
        <div
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden animate-fade-in-down">
          <div
          className="aspect-square block absolute left-1/2 top-0 -translate-y-6/10 -translate-x-1/2 h-200 bg-main rounded-full animate-pulse blur-3xl brightness-50 animate-duration-[4s] scale-150">
            <div
            className="aspect-square block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-100 bg-sky-600 rounded-full" />
            <div
            className="aspect-square block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-50 bg-sky-300 rounded-full" />
          </div>

          <div className="bg-linear-to-b from-background to-transparent w-screen h-10 left-0 top-0 absolute z-3 pointer-events-none" />
        </div>

        <section
        className="py-10 z-2 mt-10 flex flex-col items-center justify-center w-full">
          <p
          className="text-6xl font-medium tracking-wide animate-fade-in-down">
            Pricing
          </p>

          <div
          className="flex gap-10 items-start justify-center flex-wrap mt-10">
            <PricingCard
            tier="Free"
            slogan="Everything you need to start"
            price={0}
            type="free"
            benefits={benefits.free}
            action={() => {
              if(!canPay) return router.push("/auth/login");

              router.push("/dashboard");
            }} />

            <PricingCard
            tier="Pro"
            slogan="Unlock the full NexZero experience"
            price={8}
            type="normal"
            benefits={benefits.pro}
            loading={loading}
            action={async () => {
              if(!canPay) return router.push("/auth/login");

              setLoading(true);
              const link = await capture(
                router,
                snackbar,
                "pro"
              );

              if(link) return router.push(link);

              setLoading(false);
              return;
            }} />

            <PricingCard
            tier="Enterprise"
            slogan="Designed for collaborative teams"
            price={14}
            type="normal"
            benefits={benefits.enterprise}
            loading={loading} 
            action={async () => {
              if(!canPay) return router.push("/auth/login");

              setLoading(true);
              const link = await capture(
                router,
                snackbar,
                "enterprise"
              );

              if(link) return router.push(link);

              setLoading(false);
              return;
            }} />
          </div>
        </section>
        
      </main>
    </PageLayout>
  )
}