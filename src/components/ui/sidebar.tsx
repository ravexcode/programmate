//React imports
import { ReactNode, useState } from "react";

//Next imports
import Link from "next/link";
import Image from "next/image";

//Icons imports
import {
  IconBolt,
  IconChecklist,
  IconLayoutDashboard,
  IconLayoutSidebar,
  IconSettings,
  IconSparkles,
  IconUserCircle
} from "@tabler/icons-react";

//Icon interface
export interface IconProps {
  action: string;
  name: string;
  isDisplayed: boolean;
  children: ReactNode;
  disabled?: boolean;
}

//Icon button component
export function Icon(props : IconProps) {
  return (
    <Link
    href={props.action}
    className={"flex justify-start items-center gap-2 p-1 md:p-2 rounded-lg hover:bg-ultramarine-600 cursor-pointer transition focus:outline-none opacity-90 duration-400 " + (props.disabled && "grayscale brightness-50 pointer-events-none ") + (props.isDisplayed ? "w-46 md:w-60" : "w-full")}>
      {props.children}
      {props.isDisplayed && <span className="text-sm animate-fade-in-right"> {props.name} </span>}
    </Link>
  )
}

interface SideBarProps {
  email?: string;
  plan?: string;
  children?: ReactNode;
  setExpanded?: (expanded : boolean) => void;
}


export default function SideBar(props: SideBarProps) {
  const [expanded, setExpanded] = useState(false);
  
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
          onClick={() => {
            setExpanded(prev => !prev)
            props.setExpanded && props.setExpanded(expanded);
          }}
          className={"flex justify-start items-center gap-2 p-1 md:p-2 rounded-lg hover:bg-ultramarine-600 cursor-pointer transition focus:outline-none opacity-90 duration-800 " + (expanded ? "w-46 md:w-60" : "w-full")}>
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
        action="/to-do-list"
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
            props.plan === "Free" && expanded && (
              <div
              className="w-full rounded-xl border border-neutral-800 p-2 bg-neutral-900 animate-fade-in-right mt-10">
                <div className="w-full flex items-center gap-1 pt-1">
                  <IconBolt
                  size={23}
                  stroke={2}
                  color="#2b5ffb"/>
                  <p className="font-semibold text-wrap text-center bg-linear-to-r from-main via-blue-200 to-blue-500 w-max bg-clip-text text-transparent text-lg"> Get plan pro </p>
                </div>
                <p className="text-text/60 text-sm pb-2 px-1">
                  Upgrade your projects workflow with a monhtly subscription
                </p>
                <button
                className="bg-main rounded-md w-full px-2 py-1 cursor-pointer text-center duration-400 hover:brightness-80 shadow-lg shadow-blue-800/30">
                  Upgrade now
                </button>
              </div>
            )
          }

          {
            expanded && (
              <span
              className="w-full text-base font-bold p-2 animate-fade-in-right">
                Configuration
              </span>
            )
          }

          <Icon
          action="/users/profile/me"
          name={props.email!}
          isDisplayed={expanded}>
            <IconUserCircle
            size={23}
            stroke={2}
            color="white" />
          </Icon>

          <Icon
          action="/settings"
          name="Configuration"
          isDisplayed={expanded}>
            <IconSettings
            size={23}
            stroke={2}
            color="white" />
          </Icon>
        </div>
      </nav>
    </aside>
  );
}