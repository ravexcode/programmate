"use client";

import { useEffect, useRef, useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { UserData } from "@/types/user.types";
import { IconArrowsMoveVertical, IconChecklist, IconCloudCog, IconCloudDataConnection, IconLayoutDashboard, IconLayoutSidebar, IconReceipt2, IconSettings, IconUserCircle } from "@tabler/icons-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import animationClose from "@/hooks/useAnimationClose";
import Icon from "../dashboard/icon";

interface Props {
  user: UserData;
  router: AppRouterInstance;
}

export default function AiSidebar(props: Props) {
  const router = props.router;

  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const isExpanded = window.localStorage.getItem("expanded");

    setExpanded(!!isExpanded);
  }, []);


  const [ settingsVisible, changeSettingsVisibility ] = useState(false);

  const userSettings = useRef(null);

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
    animationClose(current, "fade-out-down", "hidden", "flex");
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
          className={"flex items-center gap-1.5 p-2 rounded-sm hover:bg-blue-900 cursor-pointer transition focus:outline-none opacity-90 duration-200 w-full " + (expanded ? "justify-start" : "justify-center")}>
          <IconLayoutSidebar
          size={18}
          stroke={2}
          color="white" />

          {expanded && <span className="text-sm animate-fade-in-right"> Close </span>}

        </button>

      </div>

      {/* Items */}
      <nav className="flex flex-row sm:flex-col gap-1 sm:px-3 w-auto sm:w-full h-full duration-400 items-center justify-center">
        
        <Icon
        action="/dashboard"
        name="Dashboard"
        isDisplayed={expanded}>
          <IconLayoutDashboard
          size={18}
          stroke={2}
          color="white" />
        </Icon>
        
        <Icon
        action="/ai/providers"
        name="Providers"
        isDisplayed={expanded}>
          <IconCloudCog
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

        {
          props.user.ai_sessions ? props.user.ai_sessions.map((session, key) =>
            <div
            className="w-full p-2 px-4 rounded-md bg-neutral-900 flex items-center justify-center gap-2">
              {session.title}

              <button
              type="button"
              >

              </button>
            </div>
          ) : 
          <p>

          </p>
        }

        <div
        className="ml-auto sm:ml-0 mt-auto flex flex-row sm:flex-col items-center justify-center sm:justify-end gap-1 sm:pb-3">
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
                size={23}
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