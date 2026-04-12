//React imports
import { useState } from "react"

export function Input(props : any){
  return (
    <div
    className="flex flex-col justify-center items-start w-full">
      <label
      className="text-sm font-light -translate-y-1">
        {props.title}
      </label>
      <input
      name={props.name}
      type={props.type}
      placeholder={props.guide}
      className="border-2 border-ultramarine-300 rounded-xl py-2 px-3 w-full placeholder:text-text/40 shadow-lg shadow-ultramarine-300/20 duration-300 focus:outline-none focus:shadow-ultramarine-300/40 bg-transparent"/>
    </div>
  )
}

export function PasswordInput(props : any){
  const [ isShown, setIsShown ] = useState(false);

  return (
    <div
    className="flex flex-col justify-center items-start w-full relative">
      <label
      className="text-sm font-light -translate-y-1">
        {props.title}
      </label>
      <input
      name={props.name}
      type={isShown ? "text" : "password"}
      placeholder="••••••••••"
      minLength={8}
      className="border-2 border-ultramarine-300 rounded-xl py-2 px-3 w-full placeholder:text-text/40 shadow-lg shadow-ultramarine-300/20 duration-300 focus:outline-none focus:shadow-ultramarine-300/40 bg-transparent"/>
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