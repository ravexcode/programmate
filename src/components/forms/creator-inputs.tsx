interface CreatorInputProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
  value: string,
  label: string,
  placeholder?: string,
  required?: boolean,
  type?: "text" | "textarea" | "email" | "url",
  bgColor?: string;
  disabled?: boolean;
}

export default function CreatorInput(props: CreatorInputProps) {
  return (
    <>
      <label
      className="font-light w-full text-sm text-start mb-2 select-none">
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
          name={props.placeholder?.trim()}
          disabled={props.disabled}
          className={"w-full rounded-sm px-3 py-2 text-sm focus:outline-none mb-3 text-text/80 border border-transparent focus:border-main duration-400 min-h-20 h-30 max-h-80 disabled:brightness-75 disabled:select-none " + ( props.bgColor ?? "bg-neutral-800" )}
          onChange={(e) => {
            props.onChange(e);
          }}/>
        ) : (
          <input
          required={props.required}
          type={props.type || "text"}
          placeholder={props.placeholder}
          value={props.value}
          name={props.placeholder?.trim()}
          disabled={props.disabled}
          className={"w-full rounded-sm px-3 py-2 bg-neutral-800 text-sm focus:outline-none mb-3 text-text/80 border border-transparent focus:border-main duration-400 disabled:brightness-75 disabled:select-none " + ( props.bgColor ?? "bg-neutral-800" )}
          onChange={(e) => {
            props.onChange(e);
          }}/>
        )
      }
    </>
  )
}