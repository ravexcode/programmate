//React imports
import { IconEye, IconEyeClosed } from "@tabler/icons-react";
import { useState } from "react";

const inputClasses = {
  container: "flex flex-col justify-center items-start w-full relative",
  label: "text-sm font-light -translate-y-1",
  input: "border border-neutral-700 bg-neutral-900/70 rounded-full py-3 px-4 w-full placeholder:text-text/40 duration-500 border-2 outline-none focus:border-main"
}

export function Input(props : {
  title: string;
  name: string;
  type: string;
  guide: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => void;
  value: string | number;
}){
  return (
    <div
    className={inputClasses.container}>
      <label
      className={inputClasses.label}>
        {props.title}
      </label>
      <input
      onChange={(e) => props.onChange(e)}
      value={props.value}
      name={props.name}
      type={props.type}
      placeholder={props.guide}
      className={inputClasses.input}/>
    </div>
  )
}

export function PasswordInput(props : {
  title: string;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => void;
  value: string;
}){
  const [ isShown, setIsShown ] = useState(false);

  return (
    <div
    className={inputClasses.container}>
      <label
      className={inputClasses.label}>
        {props.title}
      </label>

      <div
      className="relative flex w-full">
        <input
        name={props.name}
        type={isShown ? "text" : "password"}
        onChange={(e) => props.onChange(e)}
        value={props.value}
        placeholder="••••••••••"
        minLength={8}
        className={inputClasses.input}/>
        <div
        className="text-sky-600 text-sm absolute cursor-pointer right-5 h-full flex justify-center items-center"
        onClick={() => {
          setIsShown(prev => prev === true ? false : true)
        }}>
          {
            isShown ? (
              <IconEye
              size={22} />
            ) : (
              <IconEyeClosed
              size={22} />
            )
          }
        </div>
      </div>
    </div>
  )
}