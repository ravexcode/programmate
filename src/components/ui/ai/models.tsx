interface Props {
  name: string;
  models: string [];
  url?: string;
  onSelect: (selectedModel: string, selectedProvider: string) => void;
}

export default function Models(props: Props) {
  return (
    <div
    className="w-full flex flex-col items-center justify-center gap-2 py-2 px-4">
      
      <div
      className="w-full flex justify-between items-center mb-3">
        <p
        className="font-medium text-lg mr-auto">
          {props.name}
        </p>

        <p
        className="text-neutral-400">
          {props.url}
        </p>
      </div>

      {
        props.models.map(model => 
          <button
          key={model}
          type="button"
          className="w-full text-start bg-neutral-900 border border-transparent rounded-md duration-300 hover:border-main cursor-pointer p-2 px-4"
          onClick={() => {
            props.onSelect(model, props.name)
            return;
          }}>
            {model}
          </button>
        )
      }
    </div>
  )
}