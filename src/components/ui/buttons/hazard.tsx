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
    className={"bg-red-600 rounded-md p-2 text-sm duration-400 cursor-pointer active:bg-red-900 active:scale-95 hover:bg-red-900 disabled:grayscale disabled:cursor-wait disabled:hover:bg-red-600 " + props.className + " " + props.size}>
      { props.children }
    </button>
  )
}