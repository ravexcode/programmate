interface Props {
  children: React.ReactNode;
  size: string;
  action?: () => void;
  className?: string;
  isLoading?: boolean;
  isDisabled?: boolean;
}

export default function HazardButton(props: Props) {
  return (
    <button
    type="button"
    disabled={props.isLoading || props.isDisabled}
    onClick={() => {
      if(props.action) {
        props.action();
      }
      return ;
    }}
    className={"bg-red-600 rounded-md p-2 text-sm duration-400 cursor-pointer active:brightness-60 active:scale-95 hover:brightness-60 disabled:grayscale disabled:hover:brightness-100 " + props.className + " " + props.size + " " + (props.isDisabled ? " disabled:cursor-not-allowed" : props.isLoading && " disabled:cursor-wait")}>
      { props.children }
    </button>
  )
}