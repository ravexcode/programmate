//Next imports
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

//React imports
import { memo, useState, useEffect, useRef } from "react";

//Hooks imports
import useAnimationClose from "@/hooks/useAnimationClose";

//Prebuilt UI imports
import Icon from "./icon";

//Types imports
import type { UserData } from "@/types/user.types";
import type Team from "@/types/team.types";

interface Props {
  user: UserData;
  team: Team;
}

//Icons imports
import {
  IconArrowsMoveVertical,
  IconBolt,
  IconChecklist,
  IconLayoutDashboard,
  IconLayoutSidebar,
  IconReceipt2,
  IconSettings,
  IconSparkles,
  IconUserCircle,
  IconCalendar,
  IconDatabase,
  IconEye,
  IconFolder,
  IconLayoutKanban,
  IconMessage,
  IconUsers,
  IconAppWindow
} from "@tabler/icons-react";


function TeamSideBar(props: Props) {
  const router = useRouter();

  const [expanded, setExpanded] = useState(false);
  const [ settingsVisible, changeSettingsVisibility ] = useState(false);

  const userSettings = useRef(null);

  useEffect(() => {
    const expanded = window.localStorage.getItem("expanded");

    if(expanded) return setExpanded(true);

    return;
  }, []);

  const toggleSettings = () => {
    if(!userSettings.current) return;
    if(!expanded) return;

    changeSettingsVisibility(prev => prev ? false : true);

    const current : HTMLElement = userSettings.current;
    const classlist = current.classList;

    if(classlist.contains("hidden")){
      classlist.remove("animate-fade-out-down");
      classlist.replace("hidden", "flex");

      return;
    };

    classlist.add("animate-fade-out-down");
    useAnimationClose(current, "fade-out-down", "hidden", "flex");
    return;
  }

  return (
    <aside
      className={`text-xs md:text-sm scrollbar-hide h-full items-center justify-start bg-neutral-950 text-text transition-all duration-400 flex flex-col animate-fade-in overflow-x-auto sm:overflow-y-auto overflow-hidden
        ${expanded ? "w-64" : "w-16"}
      `}>

      <div
      className="flex flex-col justify-center items-center sm:mt-1 sm:mb-3">
        <Link
        href="/"
        className="duration-300 hover:scale-105 hover:brightness-120 p-3">
          {
            expanded ? 
              <Image
              src="/logos/large.svg"
              alt="Logo made by RavexCode"
              width={200}
              height={200}
              preload
              loading="eager"
              className="animate-fade-in h-5 min-w-max w-auto"/>
            :
              <Image
              src="/logos/logo.svg"
              alt="Logo made by RavexCode"
              width={200}
              height={200}
              preload
              loading="eager"
              className="animate-fade-in h-5 min-w-max w-auto"/>
          }
        </Link>
      </div>
      

      {/* Toggler */}
      <div className="px-3 hidden sm:flex w-full">

        <button
        type="button"
          onClick={() => {
            setExpanded(prev => !prev)
            if(!expanded) return window.localStorage.setItem("expanded", "expanded");
            return window.localStorage.removeItem("expanded");
          }}
          className={"flex items-center gap-2 p-2 rounded-lg hover:bg-blue-900 cursor-pointer transition focus:outline-none opacity-90 duration-800 w-full " + (expanded ? "justify-start" : "justify-center")}>
          <IconLayoutSidebar
          size={18}
          stroke={2}
          color="white" />

          {expanded && <span className="text-sm animate-fade-in-right"> Close </span>}

        </button>

      </div>

      {/* Items */}
      <nav
      className="flex flex-row sm:flex-col gap-1 sm:px-3 w-auto sm:w-full h-full duration-400 items-center justify-center">
        <Icon
        action="/dashboard"
        name="Dashboard"
        isDisplayed={expanded}>
          <IconLayoutDashboard
          size={18}
          stroke={2}
          color="white" />
        </Icon>

        { expanded && ( <span className="w-full px-2 animate-fade-in-right"> User </span> ) }

        <Icon
        action="/todo"
        name="To Do lists"
        isDisplayed={expanded} >
          <IconChecklist
          size={18}
          stroke={2}
          color="white" />
        </Icon>

        <Icon
        action="/ai"
        name="Prismaflow AI"
        isDisplayed={expanded} >
          <IconSparkles
          size={18}
          stroke={2}
          color="white" />
        </Icon>

        { expanded && ( <span className="w-full px-2 animate-fade-in-right"> Project </span> ) }
        
        <Icon
        action={`/projects/${props.team.team_id}`}
        name="Project dashboard"
        isDisplayed={expanded}>
          <IconAppWindow
          size={18}
          stroke={2}
          color="white"/>
        </Icon>
        
        <Icon
        action={`/projects/${props.team.team_id}/integrants`}
        name="Integrants"
        isDisplayed={expanded}>
          <IconUsers
          size={18}
          stroke={2}
          color="white"/>
        </Icon>

        <Icon
        action={`/projects/${props.team.team_id}/tickets`}
        name="Issue Tracking"
        isDisplayed={expanded}>
          <IconFolder
          size={18}
          stroke={2}
          color="white"/>
        </Icon>

        <Icon
        action={`/projects/${props.team.team_id}/erd`}
        name="Database diagram"
        isDisplayed={expanded}
        disabled={ props.user.plan === "Free" }>
          <IconDatabase
          size={18}
          stroke={2}
          color="white"/>
        </Icon>

        <Icon
        action={`/projects/${props.team.team_id}/kanban-board`}
        name="Kanban board"
        isDisplayed={expanded}
        disabled={ props.user.plan === "Free" }>
          <IconLayoutKanban
          size={18}
          stroke={2}
          color="white"/>
        </Icon>

        <Icon
        action={`/projects/${props.team.team_id}/calendar`}
        name="Calendar"
        isDisplayed={expanded}
        disabled={ props.user.plan === "Free" }>
          <IconCalendar
          size={18}
          stroke={2}
          color="white"/>
        </Icon>

        <Icon
        action={`/projects/${props.team.team_id}/settings`}
        name="Project settings"
        isDisplayed={expanded}>
          <IconSettings
          size={18}
          stroke={2}
          color="white"/>
        </Icon>


        <div
        className="ml-auto sm:ml-0 mt-auto flex flex-row sm:flex-col items-center justify-center sm:justify-end gap-1 sm:pb-3">
          {
            (props.user.plan === "Free" || props.user.plan === "Pro") ?
              expanded ? (
                <Link
                href="/pricing"
                className="w-full rounded-xl border border-neutral-800 p-2 bg-neutral-900 animate-fade-in-right sm:mt-10">
                  <div className="w-full flex items-center gap-1 sm:pt-1">
                    <IconBolt
                    size={18}
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
                href="/pricing"
                className="flex justify-start items-center gap-2 p-2 rounded-lg hover:bg-blue-900 duration-400 border-transparent">
                  <IconBolt
                  size={18}
                  stroke={2}
                  color="white" />
                </Link>
              )
            : null
          }

          <div
          className={"flex justify-start items-center gap-2 p-1 md:p-2 rounded-lg cursor-pointer transition focus:outline-none duration-400 relative " + (expanded ? "w-46 md:w-60" : "w-full") + (settingsVisible  ? "" : " hover:bg-blue-900")}
          onClick={() => {
            if(expanded) {
              return toggleSettings();
            } else {
              return router.push("/users/me")
            }
          }}>
            {
              props.user.avatar_url ? (
                <Image
                src={props.user.avatar_url}
                alt={props.user.name + "avatar"}
                width={50}
                height={50}
                className="rounded-full w-6 aspect-square"
                preload
                loading="eager" />
              ) : (
                <IconUserCircle
                size={18}
                stroke={2}
                color="white" />
              )
            }
            {expanded && (
              <div
              className="w-full flex gap-2 h-full items-center justify-center">
                <div
                className="w-full flex flex-col items-start">
                  <p className="text-sm animate-fade-in-right"> {props.user.name} </p>
                  <p className="text-xs text-neutral-400 animate-fade-in-right"> {props.user.email} </p>
                </div>

                <IconArrowsMoveVertical
                size={15}
                stroke={2}
                color="white"
                className="w-6 aspect-square" />
              </div>
            )}

            <section
            className="absolute w-full py-2 bg-neutral-950 border border-neutral-800 rounded-md left-0 bottom-1/1 z-5 hidden flex-col animate-fade-in-up animate-duration-300"
            ref={userSettings}>
              <Link
              href="/settings"
              className="w-full flex gap-1 justify-start items-center hover:bg-neutral-700 px-2 py-1">
                <IconSettings
                size={18} />
                Settings
              </Link>
              <Link
              href="/user/billing"
              className="w-full flex gap-1 justify-start items-center hover:bg-neutral-700 px-2 py-1">
                <IconReceipt2
                size={18} />
                Billing
              </Link>
              <Link
              href="/users/me"
              className="w-full flex gap-1 justify-start items-center hover:bg-neutral-700 px-2 py-1">
                <IconUserCircle
                size={18} />
                My profile
              </Link>
            </section>
          </div>
        </div>
      </nav>
    </aside>
  )
}

//Optimization
export default memo(TeamSideBar)