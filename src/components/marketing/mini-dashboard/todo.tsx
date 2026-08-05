import Link from "next/link";

export default function ViewToDo(
  { children } : { children: React.ReactNode }
) {
  return (
    <section
    className="w-full min-w-0 h-full z-2 animate-fade-in animate-duration-300">
      <p
      className="text-xl sm:text-3xl font-semibold tracking-wide w-full text-start flex flex-col gap-1">
        Welcome to NexZero! <br />
        <span
        className="text-sm sm:text-base font-normal tracking-normal opacity-80">
          There will be your to do lists
        </span>
      </p>

      <div
      className="font-medium my-5 flex flex-wrap gap-2 justify-between items-center">
        <p>
          Lists
        </p>
        <Link
        href="/auth/signup"
        className="rounded-md px-4 py-1.5 text-sm bg-main duration-300 hover:bg-main/60">
          Start creating +
        </Link>
      </div>

      <div
      className="grid grid-cols-1 sm:grid-cols-2 z-2 gap-4 sm:gap-8">
        {children}
      </div>  
    </section>
  )
}