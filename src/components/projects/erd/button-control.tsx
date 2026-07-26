interface Props {
  action: () => void;
  children: React.ReactNode;
  content: string;
  active?: boolean;
  ref?: React.RefObject<null>
}

export default function ButtonControl(props: Props) {
  return (
    <button
    className={`aspect-square w-10 duration-200 hover:bg-neutral-700 rounded-md p-2 cursor-pointer ${props.active && "bg-neutral-800"}`}
    title={props.content}
    onClick={props.action}>
      { props.children }
    </button>
  )
}