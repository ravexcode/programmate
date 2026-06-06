//React imports
import { ReactNode, useState, useEffect } from "react";

//Next imports
import Link from "next/link";
import Image from "next/image";

//Icons imports
import {
  IconBolt,
  IconChecklist,
  IconLayoutDashboard,
  IconLayoutSidebar,
  IconUserCircle
} from "@tabler/icons-react";

//Icon interface
export interface IconProps {
  action: string;
  name: string;
  isDisplayed: boolean;
  children: ReactNode;
  disabled?: boolean;
  key?: number | string;
}

//Icon button component
export function Icon(props : IconProps) {
  return (
    <Link
    href={props.action}
    className={"flex justify-start items-center gap-2 p-1 md:p-2 rounded-lg hover:bg-blue-900 cursor-pointer transition focus:outline-none opacity-90 duration-400 " + (props.disabled && "grayscale brightness-50 pointer-events-none ") + (props.isDisplayed ? "w-46 md:w-60" : "w-full")}>
      {props.children}
      {props.isDisplayed && <span className="text-sm animate-fade-in-right"> {props.name} </span>}
    </Link>
  )
}

interface SideBarProps {
  email: string;
  plan: string;
  username: string;
  children?: ReactNode;
  setExpanded?: (expanded : boolean) => void;
  avatar?: string;
}


export default function SideBar(props: SideBarProps) {
  const [expanded, setExpanded] = useState(false);
  
  useEffect(() => {
    const expanded = window.localStorage.getItem("expanded");

    if(expanded) return setExpanded(true);

    return;
  }, []);
  
  return (
    <aside
      className={`text-xs md:text-sm scrollbar-hide h-screen bg-neutral-950 text-text transition-all duration-400 flex flex-col animate-fade-in overflow-y-auto overflow-x-hidden 
        ${expanded ? "w-50 md:w-64" : "w-12 md:w-16"}
      `}>

      <div
      className="p-2 md:p-3 flex flex-col justify-center items-center mt-1 mb-3">
        <Link
        href="/"
        className="duration-300 hover:scale-105 hover:brightness-120">
          <Image
          src={expanded ? "/logos/large.svg" : "/logos/logo.svg"}
          alt="Logo made by RavexCode"
          width={200}
          height={200}
          preload
          className={"animate-fade-in-right " + (expanded ? "h-5" : "aspect-square w-3 md:w-5")}/>
        </Link>
      </div>
      

      {/* Toggle */}
      <div className="px-3">

        <button
        type="button"
          onClick={() => {
            setExpanded(prev => !prev)
            props.setExpanded && props.setExpanded(expanded);
            if(!expanded) return window.localStorage.setItem("expanded", "expanded");
            return window.localStorage.removeItem("expanded");
          }}
          className={"flex justify-start items-center gap-2 p-1 md:p-2 rounded-lg hover:bg-blue-900 cursor-pointer transition focus:outline-none opacity-90 duration-800 " + (expanded ? "w-46 md:w-60" : "w-full")}>
          <IconLayoutSidebar
          size={23}
          stroke={2}
          color="white" />

          {expanded && <span className="text-sm animate-fade-in-right"> Close </span>}

        </button>

      </div>

      {/* Items */}
      <nav className="flex flex-col gap-1 px-3 h-full duration-400">

        <Icon
        action="/dashboard"
        name="Dashboard"
        isDisplayed={expanded}>
          <IconLayoutDashboard
          size={23}
          stroke={2}
          color="white" />
        </Icon>

        { expanded && ( <span className="w-full text-base font-bold p-2 mt-5 animate-fade-in-right"> User </span> ) }

        <Icon
        action="/todo"
        name="To Do lists"
        isDisplayed={expanded} >
          <IconChecklist
          size={23}
          stroke={2}
          color="white" />
        </Icon>

        {
          props.children
        }

        <div
        className="mt-auto flex flex-col gap-1 pb-3">
          {
            (props.plan === "Free" || props.plan === "Pro") && expanded ? (
              <Link
              href="/#pricing"
              className="w-full rounded-xl border border-neutral-800 p-2 bg-neutral-900 animate-fade-in-right mt-10">
                <div className="w-full flex items-center gap-1 pt-1">
                  <IconBolt
                  size={23}
                  stroke={2}
                  color="#2b5ffb"/>
                  <p className="font-semibold text-wrap text-center bg-linear-to-r from-blue-600 via-sky-500 to-blue-200 w-max bg-clip-text text-transparent text-lg"> Upgrade your plan </p>
                </div>
                <p className="text-neutral-200 font-light text-sm pb-2 px-1">
                  Upgrade your projects workflow with a monhtly subscription
                </p>
                <button
                className="bg-main rounded-md w-full px-2 py-1 cursor-pointer text-center duration-400 hover:brightness-80 shadow-lg shadow-blue-800/30">
                  Look pricing
                </button>
              </Link>
            ) : (
              <Link
              href="/#pricing"
              className="flex justify-start items-center gap-2 p-2 rounded-lg hover:bg-blue-900 duration-400 border-transparent">
                <IconBolt
                size={23}
                stroke={2}
                color="white" />
              </Link>
            )
          }
          <Icon
          action="/settings"
          name=""
          isDisplayed={expanded}>
            {
              props.avatar ? (
                <Image
                src={props.avatar}
                alt={props.email + " avatar"}
                width={23}
                height={23}
                className="rounded-full border border-neutral-800"
                preload
                loading="eager" />
              ) : (
                <IconUserCircle
                size={23}
                stroke={2}
                color="white" />
              )
            }

            {
              expanded && (
                <div
                className="flex flex-col">
                  <p className="animate-fade-in-right"> {props.username} </p>
                  <p className="animate-fade-in-right text-xs font-light text-neutral-300"> {props.email} </p>
                </div>
              )
            }
          </Icon>
        </div>
      </nav>
    </aside>
  );
}