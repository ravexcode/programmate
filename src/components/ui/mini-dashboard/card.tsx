interface Props {
  title: string;
  description: string;
  tags?: string [];
  status?: string;
}

export default function DashboardCard(props: Props) {
  return (
    <section
    className="cursor-default rounded-md bg-neutral-950 border border-neutral-800 p-3 flex flex-col duration-300 hover:border-main animate-fade-in-up">
      <p
      className="text-sm font-medium tracking-wide">
        {props.title}
      </p>
      
      {
        props.status && (
          <p
          className="mt-1 flex gap-1 text-xs items-center">
            <span
            className={"h-1.5 w-1.5 rounded-full block " + ( props.status === "Backlog" ? "bg-zinc-500" : props.status === "Planning" ? "bg-blue-400" : props.status === "In Progress" ? "bg-orange-400" : props.status === "On Hold" ? "bg-red-400" : "bg-purple-500" )} />
            {props.status}
          </p>
        )
      }

      <p
      className="text-xs text-text/60 line-clamp-3 leading-relaxed mt-1">
        {props.description}
      </p>
      
      <div
      className="flex gap-1 mt-2 flex-wrap">
        {
          props.tags && props.tags.map((tag: string, index) => (
            <div
            className="scale-90 px-3 py-1 rounded-full text-xs font-light border border-main/50 bg-main/20 text-text/80 w-max cursor-default"
            key={ index }>
              {tag}
            </div>
          ))
        }
      </div>
    </section>
  )
}