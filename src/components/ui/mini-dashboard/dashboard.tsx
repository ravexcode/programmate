import Link from "next/link";

export default function ViewDashboard(
  { children } : { children: React.ReactNode }
) {
  return (
    <section
    className="w-200 h-full z-2 animate-fade-in animate-duration-300">
      <p
      className="text-3xl font-semibold tracking-wide w-full text-start flex flex-col gap-1">
        Welcome to Prismaflow! <br />
        <span
        className="text-base font-normal tracking-normal opacity-80">
          There will be your proyects
        </span>
      </p>

      <div
      className="font-medium my-5 flex justify-between items-center">
        <p>
          Projects
        </p>
        <Link
        href="/auth/signup"
        className="rounded-md px-4 py-1.5 text-sm bg-main duration-300 hover:bg-main/60">
          Start creating +
        </Link>
      </div>

      <div
      className="grid grid-cols-2 z-2 gap-8">
        {children}
      </div>  
    </section>
  )
}