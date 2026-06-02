interface Props {
  children: React.ReactNode,
  size: string,
  type?: "submit" | "reset",
  action?: () => {},
  className?: string,
  isLoading?: boolean
}

export default function MainButton(props: Props) {
  return (
    <button
    type={props.type || "button"}
    disabled={props.isLoading}
    onClick={() => {
      if(props.action) {
        props.action();
      }

      return ;
    }}
    className={"bg-main rounded-md p-2 text-sm duration-400 cursor-pointer active:bg-main/60 active:scale-95 hover:bg-main/60 disabled:grayscale disabled:cursor-wait disabled:hover:bg-main " + props.className + " " + props.size}>
      { props.children }
    </button>
  )
}