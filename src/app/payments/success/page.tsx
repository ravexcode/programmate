'use client';

//Containers import
import MainContainer from "@/components/containers/main";

export default function SuccessPayment() {
  return (
    <MainContainer>
      <main
      className="flex flex-col justify-center items-center px-4 py-6 min-h-130 appear-element">

        <section
        className="px-4 py-10 bg-amethyst-900 shadow-xl shadow-amethyst-700/20 min-w-90 rounded-md flex flex-col justify-center items-center gap-2 border border-amethyst-600/50 text-center show-element">

          <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-amethyst-50 dark:bg-amethyst-900/20">
            <div className="absolute inset-0 rounded-full bg-amethyst-300/30 blur-xl animate-pulse" />
            <img 
              src="/icons/party.svg" 
              alt="Icon made by StreamlineHQ"
              className="relative z-10 aspect-square w-12 drop-shadow-md"
            />
          </div>

          <h1
          className="text-3xl font-bold text-text">
            Payment successfull!
          </h1>
          <p
          className="text-amethyst-300 font-semibold">
            Your transaction is complete!
          </p>

          <button
          type="button"
            onClick={
              () => window.close()
            }
            className="mt-5 px-7 py-3 rounded-md bg-amethyst-500 font-semibold text-white shadow-md shadow-amethyst-500/30 transition-all hover:brightness-110 hover:shadow-lg hover:shadow-amethyst-700/40 active:scale-95 cursor-pointer">
            Close this tab
          </button>

        </section>

      </main>
    </MainContainer>
  )
}