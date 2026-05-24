interface CreatorInputProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
  value: string,
  label: string,
  placeholder?: string,
  required?: boolean,
  type?: "text" | "textarea",
}

export default function CreatorInput(props: CreatorInputProps) {
  return (
    <>
      <label
      className="font-light w-full text-sm text-start mb-1">
        {props.label} {
          props.required && <span className="text-red-600">*</span>
        }
      </label>
      {
        props.type === "textarea" ? (
          <textarea
          required={props.required}
          placeholder={props.placeholder}
          value={props.value}
          className="w-full rounded-sm px-3 py-2 bg-neutral-800 text-sm focus:outline-none mb-3 text-text/80 border border-transparent focus:border-main duration-400 min-h-50 max-h-50"
          onChange={(e) => {
            props.onChange(e);
          }}/>
        ) : (
          <input
          required={props.required}
          type={props.type || "text"}
          placeholder={props.placeholder}
          value={props.value}
          className="w-full rounded-sm px-3 py-2 bg-neutral-800 text-sm focus:outline-none mb-3 text-text/80 border border-transparent focus:border-main duration-400"
          onChange={(e) => {
            props.onChange(e);
          }}/>
        )
      }
    </>
  )
}