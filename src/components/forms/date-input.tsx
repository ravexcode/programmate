interface Props {
  label: string;
  required?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function DateInput(props: Props) {
  return (
    <>
      <label
      className="font-light w-full text-sm text-start mb-1">
        {props.label} {
          props.required && <span className="text-red-600">*</span>
        }
      </label>
      <input
      value={props.value}
      onChange={(e) => props.onChange(e)}
      type="date"
      className="w-full rounded-sm px-3 py-2 bg-neutral-800 text-sm focus:outline-none mb-3 text-text/80 border border-transparent focus:border-main duration-400" />
    </>
    
  )
}