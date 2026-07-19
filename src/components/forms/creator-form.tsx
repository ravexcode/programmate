interface CreatorFormProps {
  action: (e : React.SubmitEvent) => void;
  title: string;
  children?: React.ReactNode;
  hideAction?: () => void;
  actionIsDisabled?: boolean;
  confirmMessage?: string;
  isDangerous?: boolean;
  disabledMessage?: string;
  bgColor?: string;
}

export default function CreatorForm(props: CreatorFormProps) {
  return (
    <form
    onSubmit={(e: React.SubmitEvent) => {
      props.action(e);
    }}
    onClick={(e: React.MouseEvent) => {
      e.nativeEvent.stopImmediatePropagation();
      e.stopPropagation();
    }}
    className={"animate-fade-in-up w-100 rounded-lg px-6 py-4 flex flex-col justify-center items-center my-auto text-text " + (props.bgColor ?? "bg-neutral-900")}>

      <h2
      className="text-lg w-full text-start mb-3">
        {props.title}
      </h2>

      {props.children}

      <div className="flex w-full justify-end items-center gap-4">
        <button type="button"
        onClick={() => {
          props.hideAction && props.hideAction();
        }}
        className="px-4 py-1 rounded-md bg-neutral-800 duration-200 hover:brightness-80 cursor-pointer">
          Cancel
        </button>

        <button type="submit"
        className={"px-4 py-1 rounded-md duration-200 hover:brightness-80 cursor-pointer disabled:brightness-50 disabled:cursor-not-allowed disabled:hover:brightness-50 " + (props.isDangerous ? "bg-red-600" : "bg-main")}
        disabled={props.actionIsDisabled}>
          { props.confirmMessage ?? "Create" }
        </button>
      </div>

        {
          props.disabledMessage && props.actionIsDisabled &&
          <div
          className="mt-4 text-sm text-red-400 w-full text-center p-1.5 rounded-md bg-red-950/50 border border-red-600">
            { props.disabledMessage }
          </div>
        }
    </form>
  )
}