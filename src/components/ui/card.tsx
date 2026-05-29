export default function Card(props: {
  icon: string,
  title: string,
  children: React.ReactNode
}) {
  return (
    <section 
    className="rounded-xl border border-neutral-800 px-6 py-3 bg-neutral-950 flex flex-col justify-center items-start gap-1 w-75 text-start shadow-lg shadow-ultramarine-700/20 duration-400 hover:shadow-ultramarine-700/50 hover:-translate-y-2 hover:scale-105 cursor-default timeline-view-y animate-fade-in animate-range-[entry_0%_cover_30%]">
      <img src={"/icons/" + props.icon} alt={props.icon} />
      <h2 
      className="text-xl text-main w-full">
        {props.title}
      </h2>
      <p
      className="w-full font-light">
        {props.children}
      </p>
    </section>
  )
}