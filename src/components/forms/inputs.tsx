//React imports
import { useState } from "react";

const inputClasses = {
  container: "flex flex-col justify-center items-start w-full relative",
  label: "text-sm font-light -translate-y-1",
  input: "border border-ultramarine-50/10 bg-ultramarine-900 rounded-xl py-3 px-4 w-full placeholder:text-text/40 duration-300 focus:outline-none focus:shadow-ultramarine-300/40 bg-transparent"
}

export function Input(props : any){
  return (
    <div
    className={inputClasses.container}>
      <label
      className={inputClasses.label}>
        {props.title}
      </label>
      <input
      name={props.name}
      type={props.type}
      placeholder={props.guide}
      className={inputClasses.input}/>
    </div>
  )
}

export function PasswordInput(props : any){
  const [ isShown, setIsShown ] = useState(false);

  return (
    <div
    className={inputClasses.container}>
      <label
      className={inputClasses.label}>
        {props.title}
      </label>
      <input
      name={props.name}
      type={isShown ? "text" : "password"}
      placeholder="••••••••••"
      minLength={8}
      className={inputClasses.input}/>
      <button type="button"
      className="text-main text-sm absolute right-4 translate-y-[0.55rem] cursor-pointer"
      onClick={() => {
        setIsShown(prev => prev === true ? false : true) //Toggler
      }}>
        { isShown ? "hide" : "show" }
      </button>
    </div>
  )
}