import { IconArrowLeft, IconSend } from "@tabler/icons-react";

export default function ViewAI() {
  return (
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
      className="text-2xl sm:text-4xl tracking-wide opacity-80 flex items-center justify-center w-full px-4 text-center">
        <p
        className="animate-fade-in-up">
          What are we building today?
        </p>
      </main>

      <footer
      className="mx-auto gap-3 p-3 mb-3 w-full max-w-200 flex items-center">
        <input
        type="text"
        className="rounded-md bg-neutral-900 border border-neutral-700 duration-300 outline-none focus:border-main p-2 w-full animate-fade-in-up"
        placeholder="Ask me anything" />

        <div
        className="bg-main flex gap-2 py-1.5 px-4 rounded-md items-center duration-300 hover:bg-main/70 animate-fade-in-up">
          <IconSend size={15} />
          Send
        </div>
      </footer>
    </section>
  )
}