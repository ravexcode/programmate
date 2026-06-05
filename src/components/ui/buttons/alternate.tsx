interface Props {
  children: React.ReactNode,
  size: string,
  action?: () => void,
  className?: string,
  isLoading?: boolean
}

export default function AltButton(props: Props) {
  return (
    <button
    type="button"
    disabled={props.isLoading}
    onClick={() => {
      if(props.action) {
        props.action();
      }

      return ;
    }}
    className={"bg-neutral-800 rounded-md p-2 text-sm duration-400 cursor-pointer active:bg-neutral-600 active:scale-95 hover:bg-neutral-600 disabled:grayscale disabled:cursor-wait disabled:hover:bg-neutral-800 " + props.className + " " + props.size}>
      { props.children }
    </button>
  )
}