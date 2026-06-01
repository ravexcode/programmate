export default function Card(props: {
  title: string,
  children: React.ReactNode
}) {
  return (
    <section 
    className="rounded-xl border border-neutral-800 px-6 py-3 bg-neutral-950 flex flex-col justify-center items-start gap-1 w-full max-w-5xl text-start shadow-2xl shadow-blue-800/20 duration-400 hover:shadow-blue-600/30 hover:-translate-y-1 cursor-default timeline-view-y animate-fade-in animate-range-[entry_0%_cover_30%]">
      <h2 
      className="text-xl text-sky-600 w-full">
        {props.title}
      </h2>
      <p
      className="w-full font-light">
        {props.children}
      </p>
    </section>
  )
}