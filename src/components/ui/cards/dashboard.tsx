interface Props {
  size?: string;
  className?: string;
  children?: React.ReactNode;
}

export default function DashCard(props: Props) {
  const size = props.size || "w-full h-auto";

  return (
    <article
    className={"bg-neutral-950 border border-neutral-800 rounded-md py-3 px-5 z-2 duration-300 " + size + " " + props.className}>
      { props.children }
    </article>
  )
}