interface Props {
  children: React.ReactNode;
  height?: string;
  className?: string;
}

export default function FeatureCard(props: Props) {
  return (
    <section
    className={"w-full rounded-md border border-neutral-900 bg-neutral-950 flex flex-col items-center justify-center text-center px-10 py-15 hover:border-main hover:-translate-y-1 duration-300 timeline-view-y animate-fade-in-down animate-range-[entry_0%_cover_30%] " + props.height + " " + props.className }>
      {props.children}
    </section>
  )
}