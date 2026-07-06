//Project card
interface Props {
  title: string;
  description: string;
  id: number;
  index: number;
  status: string;
  tags: Array<string>;
  key: number;
  goToTeam: () => void
}

export default function ProjectCard(props : Props) {
  return (
    <section
    onClick={() => {
      props.goToTeam()
    }}
    className="group relative w-full flex flex-col rounded-sm border border-neutral-800 bg-neutral-950 cursor-pointer duration-400 hover:-translate-y-1 hover:border-main p-5">

      <header
      className="flex items-start justify-between mb-3">

        <div
        className="w-full flex flex-col gap-1">
          <h3
          className="text-lg font-semibold text-text">
            {props.title}
          </h3>

          <p
          className="text-sm font-extralight flex justify-start items-center gap-2">
            <span
            className={"h-2 w-2 rounded-full block " + ( props.status === "Backlog" ? "bg-zinc-500" : props.status === "Planning" ? "bg-blue-400" : props.status === "In Progress" ? "bg-orange-400" : props.status === "On Hold" ? "bg-red-400" : "bg-purple-500" )}></span>
            {props.status}
          </p>
        </div>

      </header>

      <p
      className="text-sm text-text/60 line-clamp-3 leading-relaxed">
        {props.description}
      </p>
      
      <div
      className="flex gap-2 mt-auto pt-3 flex-wrap">
        {
          props.tags && props.tags.map((tag: string, index) => (
            <div
            className="px-3 py-1 rounded-md text-xs font-light border border-main/50 bg-main/20 text-text/80 w-max cursor-default"
            key={ index }>
              {tag}
            </div>
          ))
        }
      </div>
    </section>
  )
}