//Next imports
import Link from "next/link";

//Icon interface
export interface IconProps {
  action: string;
  name: string;
  isDisplayed: boolean;
  children: React.ReactNode;
  disabled?: boolean;
  key?: number | string;
}

//Icon button component
export default function Icon(props : IconProps) {
  return (
    <Link
    href={props.action}
    className={"flex items-center gap-1.5 py-1.5 px-2 rounded-sm hover:bg-blue-900 cursor-pointer transition focus:outline-none opacity-90 duration-200 w-full " + (props.disabled && "grayscale brightness-50 pointer-events-none ") + (props.isDisplayed ? " justify-start" : " justify-center")}>
      {props.children}
      {props.isDisplayed && <span className="text-sm animate-fade-in-right"> {props.name} </span>}
    </Link>
  )
}