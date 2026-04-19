interface CreatorFormProps {
  action: (e : any) => void,
  title: string,
  children: React.ReactNode,
  hideAction?: () => void,
  actionIsDisabled?: boolean,
}

export default function CreatorForm(props: CreatorFormProps) {
  return (
    <form
    onSubmit={(e: any) => {
      props.action(e);
    }}
    className="animate-fade-in-up w-100 bg-neutral-900 rounded-lg px-6 py-4 flex flex-col justify-center items-center">

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
        className="px-4 py-1 rounded-md bg-main duration-200 hover:brightness-80 cursor-pointer disabled:bg-main/50 disabled:cursor-wait"
        disabled={props.actionIsDisabled}>
          Create
        </button>
      </div>
    </form>
  )
}