import { useState } from "react";

interface Props {
  label: string;
  value: string;
  onChange: React.Dispatch<React.SetStateAction<string>>;
  options: string [];
  isRequired?: boolean;
}

export default function OptionsInput(props: Props) {
  const [ visible, setVisible ] = useState(false);

  return (
    <div
    className="w-full flex flex-col items-center justify-center mb-1 relative cursor-default select-none">
      <label
      className="w-full text-start text-sm mb-1">
        { props.label + " " } {
          props.isRequired &&
            <span
            className="text-red-600">
              *
            </span>
        }
      </label>

      <div
      className={"w-full rounded-sm px-3 py-2 bg-neutral-800 text-sm focus:outline-none mb-1 text-text/80 border border-transparent duration-300 " + ( visible ? "bg-neutral-950/50" : "hover:border-main" ) }
      onClick={() => setVisible(p => p ? false : true)}>
        { props.value }
      </div>

      {
        visible &&
          <div
          className="absolute top-1/1 left-0 rounded-md border border-neutral-800 bg-neutral-900 text-sm flex flex-col items-center justify-center text-start w-full cursor-pointer z-5 overflow-y-auto max-h-50">
            {
              props.options.map(opt =>
                <p
                key={opt}
                className="w-full px-3 py-2 duration-300 hover:bg-neutral-800 flex gap-2 items-center justify-between"
                onClick={() => {
                  props.onChange(opt);
                  setVisible(false);
                  return;
                }} >
                  { opt }
                  
                  {
                    props.value === opt && 
                      <span
                      className="w-2 h-2 rounded-full bg-main block" />
                  }
                </p>
              )
            }
          </div>
      }
    </div>
  )
}