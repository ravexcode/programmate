"use client";

//Next imports
import { useRouter } from "next/navigation";

//React imports
import { useState, useRef } from "react";

//Components imports
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import SmoothProvider from "@/components/ui/smooth-provider";
import SnackBar, { showSnackbar } from "@/components/ui/snackbar";
import CreatorInput from "@/components/forms/creator-inputs";
import MainButton from "@/components/ui/buttons/main";

export default function SuggestionsPage() {
  //Next setup
  const router = useRouter();

  //Form states
  const [isLoading, setIsLoading] = useState(false);

  //Component
  const snackbar = useRef(null);

  //Form data
  const [ title, setTitle ] = useState<string>("");
  const [ description, setDescription ] = useState<string>("");
  const [ email, setEmail ] = useState<string>("");

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/support/suggestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "nexzero-api-key": process.env.NEXT_PUBLIC_API_KEY!
        },
        body: JSON.stringify({
          title,
          description,
          email: email || "",
        }),
      });

      const data = await response.json();

      if (response.status !== 201) {
        showSnackbar(data.message, (response.status >= 500 ? "critic" : "warn"), snackbar);
        setIsLoading(false);
        return;
      }

      showSnackbar("Suggestion submitted successfully! Thanks for your feedback.", "valid", snackbar);
    } catch (error) {
      if(error instanceof Error) {
        return showSnackbar(error.message, "critic", snackbar);
      }
      return showSnackbar("Server error", "critic", snackbar);
    } finally {
      const interval = setInterval(returnToHome, 2000);

      function returnToHome() {
        router.push("/");
        return clearInterval(interval);
      }
    }
  };

  return (
    <div className="bg-background text-zinc-50 min-h-screen grid grid-rows-[auto_1fr_auto]">
      <Header />

      <SnackBar
      ref={snackbar} />

      <main className="flex flex-col justify-start items-center pb-10">
        <SmoothProvider />

        <section className="relative px-4 w-full min-h-200 flex flex-col justify-center items-center text-text py-10 animate-fade-in-up overflow-hidden">
          <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
            <div className="aspect-square block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-100 md:h-230 bg-main/60 blur-3xl rounded-full animate-pulse" />
            <div className="bg-linear-to-t from-background to-transparent w-screen h-30 left-0 bottom-0 absolute z-3 pointer-events-none" />
            <div className="bg-linear-to-b from-background to-transparent w-screen h-30 left-0 top-0 absolute z-3 pointer-events-none" />
          </div>

          <div className="z-2 text-center">
            <h1 className="text-6xl font-bold mb-4">
              Send us a <br />
              Suggestion
            </h1>
            <p className="opacity-80 max-w-2xl tracking-wide">
              Have an idea to improve NexZero? Share your suggestions with us. Your feedback helps us create a better experience for everyone
            </p>
          </div>
        </section>

        <section className="w-full p-10 flex justify-center items-center relative">
          <form
          onSubmit={(e: React.SubmitEvent) => { handleSubmit(e) }}
          className="bg-neutral-900 rounded-md flex flex-col items-center justify-center px-6 py-4 w-120 max-w-full z-2 mb-10">
            <p
            className="mb-5 text-2xl font-medium tracking-wide w-full text-center">
              Insert your suggestion info
            </p>

            <CreatorInput
            label="Insert a short title for your suggestion"
            placeholder="e.g. Add dark mode toggle"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value)
            }}
            required />
            
            <CreatorInput
            label="Insert the suggestion description"
            placeholder="e.g. It would be great to have a dark mode option..."
            type="textarea"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value)
            }}
            required />
            
            <CreatorInput
            label="Insert your contact email"
            placeholder="e.g. jhondoe@example.com"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
            }}
            required />

            <span className="h-5"></span>

            <MainButton
            type="submit"
            size="w-full"
            isLoading={isLoading} >
              Submit suggestion
            </MainButton>
          </form>

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
  );
}
