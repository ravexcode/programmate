//React imports
import { ReactNode, useState } from "react";

//Icons imports
import {
  IconChecklist,
  IconLayoutDashboard,
  IconLayoutSidebar,
  IconSettings,
  IconUserCircle
} from "@tabler/icons-react";

//Icon interface
interface IconProps {
  action: string;
  name: string;
  isDisplayed: boolean;
  children: ReactNode
}

//Icon button component
function Icon(props : IconProps) {
  return (
    <a
    href={props.action}
    className={"flex justify-start items-center gap-2 px-2 py-2 rounded-lg hover:bg-ultramarine-600 cursor-pointer transition focus:outline-none opacity-80 duration-400 " + (props.isDisplayed ? "w-50 md:w-64" : "w-full")}>
      {props.children}
      {props.isDisplayed && <span className="text-sm animate-fade-in-right"> {props.name} </span>}
    </a>
  )
}

interface SideBarProps {
  email?: string;
  plan?: string;
  children?: ReactNode;
}

export default function SideBar(props: SideBarProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <aside
      className={`text-xs md:text-sm min-h-screen bg-neutral-950 text-text transition-all duration-300 flex flex-col animate-fade-in
        ${expanded ? "w-50 md:w-64" : "w-12 md:w-16"}
      `}>

      <div
      className="px-3 pt-3 flex flex-col justify-center items-center mt-1 mb-3">
        <a href="/"
        className="duration-300 hover:scale-105 hover:brightness-120">
          <img
          src={expanded ? "/logos/large.svg" : "/logos/logo.svg"}
          alt="Logo made by RavexCode"
          className={"animate-fade-in-right " + (expanded ? "h-5" : "aspect-square w-3 md:w-5")}/>
        </a>
      </div>
      

      {/* Toggle */}
      <div className="px-3">

        <button
          onClick={() => setExpanded(prev => !prev)}
          className={"flex justify-start items-center gap-2 px-2 py-2 rounded-lg hover:bg-ultramarine-600 cursor-pointer transition focus:outline-none opacity-80 duration-800 " + (expanded ? "w-50 md:w-64" : "w-full")}>
          <IconLayoutSidebar
          size={23}
          stroke={2}
          color="white" />

          {expanded && <span className="text-sm animate-fade-in-right"> Close </span>}

        </button>

      </div>

      {/* Items */}
      <nav className="flex flex-col gap-1 px-3 h-full">

        <Icon
        action="/dashboard"
        name="Dashboard"
        isDisplayed={expanded}>
          <IconLayoutDashboard
          size={23}
          stroke={2}
          color="white" />
        </Icon>

        {
          expanded && (
            <span
            className="w-full text-base font-bold p-2 mt-5 animate-fade-in-right">
              User
            </span>
          )
        }

        <Icon
        action="/to-do-list"
        name="ToDo list"
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