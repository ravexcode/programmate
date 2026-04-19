//React imports
import { useState } from "react";

//Icon button component
function Icon(props : any) {
  return (
    <a
    href={props.action}
    className="w-full flex justify-start items-center gap-2 px-2 py-2 rounded-lg hover:bg-ultramarine-800 cursor-pointer transition focus:outline-none">
      <img
      src={"/icons/buttons/" + props.icon + ".svg"}
      alt="Icon made by RavexCode"
      className="aspect-square w-3 md:w-5"/>
      {props.isDisplayed && <span className="text-sm min-w-64"> {props.name} </span>}
    </a>
  )
}

export default function SideBar(props: any) {
  const [expanded, setExpanded] = useState(false);

  return (
    <aside
      className={`text-xs md:text-sm min-h-screen bg-neutral-950 text-text transition-all duration-300 flex flex-col animate-fade-in
        ${expanded ? "w-50 md:w-64" : "w-12 md:w-16"}
      `}>
      {/* Toggle */}
      <div className="px-3 pt-3">

        <button
          onClick={() => setExpanded(prev => !prev)}
          className="w-full flex justify-start items-center gap-2 px-2 py-2 rounded-lg hover:bg-ultramarine-800 cursor-pointer transition">
          <img src="/icons/buttons/toggle_navbar.svg" className="aspect-square w-3 md:w-5" />

          {expanded && <span className="text-sm"> Close </span>}

        </button>

      </div>

      {/* Items */}
      <nav className="flex flex-col gap-1 px-3 h-full">
        <a
        href="/"
        className="w-full flex justify-start items-center gap-2 px-2 py-2 rounded-lg hover:bg-ultramarine-800 cursor-pointer transition">
          <img
          src="/logos/white.svg"
          alt="Icon made by RavexCode"
          className="aspect-square w-3 md:w-5"/>
          {expanded && <span className="text-sm min-w-64"> Home </span>}
        </a>

        <Icon
        action="/dashboard"
        icon="dashboard"
        name="Dashboard"
        isDisplayed={expanded} />

        <Icon
        action="/to-do-list"
        icon="tasklist"
        name="ToDo list"
        isDisplayed={expanded} />

        <div
        className="mt-auto flex flex-col gap-1 pb-3">
          <Icon
          action="/settings"
          icon="configuration"
          name="Configuration"
          isDisplayed={expanded} />

          
          <Icon
          action="/users/profile/me"
          icon="profile"
          name={props.email}
          isDisplayed={expanded} />
        </div>
      </nav>
    </aside>
  );
}