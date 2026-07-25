export default function Card(props: {
  title: string,
  children: React.ReactNode
}) {
  return (
    <section 
    className="rounded-xl border border-neutral-800 px-6 py-3 bg-neutral-950 flex flex-col justify-center items-start gap-1 w-full max-w-5xl text-start duration-400 hover:-translate-y-1 hover:border-main cursor-default timeline-view-y animate-fade-in animate-range-[entry_0%_cover_30%]">
      <h2 
      className="text-xl text-sky-600 w-full">
        {props.title}
      </h2>
      <div
      className="w-full font-light">
        {props.children}
      </div>
    </section>
  )
}