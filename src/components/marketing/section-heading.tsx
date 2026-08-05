interface Props {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  className?: string;
}

export default function SectionHeading(props: Props) {
  return (
    <div
    className={"w-full flex flex-col items-center gap-3 " + props.className}>
      <p
      className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight text-balance font-bold tracking-wide w-full text-center timeline-view-y animate-fade-in-down animate-range-[entry_0%_cover_30%]">
        {props.title}
      </p>

      {
        props.subtitle && (
          <span
          className="text-neutral-400 font-normal text-base text-center px-4 timeline-view-y animate-fade-in-down animate-range-[entry_0%_cover_30%]">
            {props.subtitle}
          </span>
        )
      }
    </div>
  )
}
