interface Props {
  children: React.ReactNode,
  size: string,
  action?: () => void,
  className?: string,
  isLoading?: boolean
}

export default function HazardButton(props: Props) {
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
    className={"bg-red-600 rounded-md p-2 text-sm duration-400 cursor-pointer active:brightness-60 active:scale-95 hover:brightness-60 disabled:grayscale disabled:cursor-wait disabled:brightness-60 " + props.className + " " + props.size}>
      { props.children }
    </button>
  )
}