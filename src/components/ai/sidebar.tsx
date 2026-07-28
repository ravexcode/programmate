"use client";

import { useEffect, useRef, useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { UserData } from "@/types/user.types";
import {
  IconArrowsMoveVertical,
  IconChecklist,
  IconCloudCog,
  IconLayoutDashboard,
  IconLayoutSidebar,
  IconMessageChatbot,
  IconReceipt2,
  IconSettings,
  IconTrash,
  IconUserCircle,
} from "@tabler/icons-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import animationClose from "@/hooks/useAnimationClose";
import Icon from "../dashboard/icon";
import { deleteSession } from "@/modules/ai.session.module";
import { getUser } from "@/modules/user.module";
import SnackBar from "@/components/ui/snackbar";

interface Props {
  user: UserData;
  router: AppRouterInstance;
  onNewChat?: () => void;
}

export default function AiSidebar(props: Props) {
  const router = props.router;
  const pathname = usePathname();
  const snackbarRef = useRef(null);

  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const isExpanded = window.localStorage.getItem("expanded");
    setExpanded(!!isExpanded);
  }, []);

  const [settingsVisible, changeSettingsVisibility] = useState(false);
  const userSettings = useRef(null);

  const toggleSettings = () => {
    if (!userSettings.current) return;
    if (!expanded) return;

    changeSettingsVisibility((prev) => !prev);

    const current: HTMLElement = userSettings.current;
    const classlist = current.classList;

    if (classlist.contains("hidden")) {
      classlist.remove("animate-fade-out-down");
      classlist.replace("hidden", "flex");
      return;
    }

    classlist.add("animate-fade-out-down");
    animationClose(current, "fade-out-down", "hidden", "flex");
  };

  const handleDeleteSession = async (sessionId: string) => {
    const success = await deleteSession(router, sessionId, snackbarRef);
    if (success) {
      const refreshed = await getUser(router);
      if (refreshed && pathname === `/ai/${sessionId}`) {
        if (props.onNewChat) {
          props.onNewChat();
        } else {
          router.push("/ai");
        }
      }
    }
  };

  const handleNewChat = () => {
    if (props.onNewChat) {
      props.onNewChat();
    } else {
      router.push("/ai");
    }
  };

  return (
    <aside
      className={`text-xs md:text-sm scrollbar-hide h-full items-center justify-start bg-neutral-950 text-text transition-all duration-400 flex flex-col animate-fade-in overflow-x-auto sm:overflow-y-auto overflow-hidden
        ${expanded ? "w-64" : "w-16"}
      `}>
      <SnackBar ref={snackbarRef} />

      <div className="flex flex-col justify-center items-center sm:mt-1 sm:mb-3">
        <Link
          href="/"
          className="duration-300 hover:scale-105 hover:brightness-120 p-3">
          {expanded ? (
            <Image
              src="/logos/large.svg"
              alt="Logo made by RavexCode"
              width={200}
              height={200}
              preload
              loading="eager"
              className="animate-fade-in h-5 min-w-max w-auto"
            />
          ) : (
            <Image
              src="/logos/logo.svg"
              alt="Logo made by RavexCode"
              width={200}
              height={200}
              preload
              loading="eager"
              className="animate-fade-in h-5 min-w-max w-auto"
            />
          )}
        </Link>
      </div>

      {/* Toggler */}
      <div className="px-3 hidden sm:flex w-full">
        <button
          type="button"
          onClick={() => {
            setExpanded((prev) => !prev);
            if (!expanded)
              return window.localStorage.setItem("expanded", "expanded");
            return window.localStorage.removeItem("expanded");
          }}
          className={
            "flex items-center gap-1.5 p-2 rounded-sm hover:bg-blue-900 cursor-pointer transition focus:outline-none opacity-90 duration-200 w-full " +
            (expanded ? "justify-start" : "justify-center")
          }>
          <IconLayoutSidebar size={18} stroke={2} color="white" />
          {expanded && (
            <span className="text-sm animate-fade-in-right"> Close </span>
          )}
        </button>
      </div>

      {/* Items */}
      <nav className="flex flex-row sm:flex-col gap-1 sm:px-3 w-auto sm:w-full h-full duration-400 items-center justify-center">
        <Icon action="/dashboard" name="Dashboard" isDisplayed={expanded}>
          <IconLayoutDashboard size={18} stroke={2} color="white" />
        </Icon>

        <Icon action="/ai/providers" name="Providers" isDisplayed={expanded}>
          <IconCloudCog size={18} stroke={2} color="white" />
        </Icon>

        {expanded && (
          <span className="w-full px-2 animate-fade-in-right"> Sessions </span>
        )}

        <button
          type="button"
          onClick={handleNewChat}
          className={
            "flex items-center gap-1.5 p-2 rounded-sm hover:bg-blue-900 cursor-pointer transition focus:outline-none opacity-90 duration-200 w-full " +
            (expanded ? "justify-start" : "justify-center")
          }>
          <IconMessageChatbot size={18} stroke={2} color="white" />
          {expanded && (
            <span className="text-sm animate-fade-in-right"> New Chat </span>
          )}
        </button>

        {props.user.ai_sessions && props.user.ai_sessions.length > 0 &&
          props.user.ai_sessions.map((session) => {
            const isActive = pathname === `/ai/${session.id}` || pathname === `/ai`;

            return (
              <div
                key={session.id}
                className={
                  "w-full flex items-center gap-2 rounded-sm transition duration-200 " +
                  (expanded ? "px-2 py-1.5" : "justify-center p-1.5") +
                  (isActive ? " bg-blue-900" : " hover:bg-blue-900/50")
                }>
                <Link
                  href={`/ai/${session.id}`}
                  className={
                    "flex items-center gap-1.5 rounded-sm cursor-pointer transition duration-200 " +
                    (expanded
                      ? "flex-1 justify-start gap-2"
                      : "justify-center")
                  }>
                  <IconMessageChatbot size={18} stroke={2} color="white" />
                  {expanded && (
                    <span className="text-sm truncate animate-fade-in-right">
                      {session.title}
                    </span>
                  )}
                </Link>

                {expanded && (
                  <button
                    type="button"
                    onClick={() => handleDeleteSession(session.id)}
                    className="p-1 rounded-sm hover:bg-red-900/50 hover:text-red-400 transition duration-200 cursor-pointer shrink-0">
                    <IconTrash size={14} />
                  </button>
                )}
              </div>
            );
          })}

        <div className="ml-auto sm:ml-0 mt-auto flex flex-row sm:flex-col items-center justify-center sm:justify-end gap-1 sm:pb-3">
          <div
            className={
              "flex justify-start items-center gap-2 p-1 md:p-2 rounded-lg cursor-pointer transition focus:outline-none duration-400 relative " +
              (expanded ? "w-46 md:w-60" : "w-full") +
              (settingsVisible ? "" : " hover:bg-blue-900")
            }
            onClick={() => {
              if (expanded) {
                return toggleSettings();
              } else {
                return router.push("/users/me");
              }
            }}>
            {props.user.avatar_url ? (
              <Image
                src={props.user.avatar_url}
                alt={props.user.name + "avatar"}
                width={50}
                height={50}
                className="rounded-full w-6 aspect-square"
                preload
                loading="eager"
              />
            ) : (
              <IconUserCircle size={23} stroke={2} color="white" />
            )}

            {expanded && (
              <div className="w-full flex gap-2 h-full items-center justify-center">
                <div className="w-full flex flex-col items-start">
                  <p className="text-sm animate-fade-in-right">
                    {" "}
                    {props.user.name}{" "}
                  </p>
                  <p className="text-xs text-neutral-400 animate-fade-in-right">
                    {" "}
                    {props.user.email}{" "}
                  </p>
                </div>

                <IconArrowsMoveVertical
                  size={15}
                  stroke={2}
                  color="white"
                  className="w-6 aspect-square"
                />
              </div>
            )}

            <section
              className="absolute w-full py-2 bg-neutral-950 border border-neutral-800 rounded-md left-0 bottom-1/1 z-5 hidden flex-col animate-fade-in-up animate-duration-300"
              ref={userSettings}>
              <Link
                href="/settings"
                className="w-full flex gap-1 justify-start items-center hover:bg-neutral-700 px-2 py-1">
                <IconSettings size={18} />
                Settings
              </Link>
              <Link
                href="/user/billing"
                className="w-full flex gap-1 justify-start items-center hover:bg-neutral-700 px-2 py-1">
                <IconReceipt2 size={18} />
                Billing
              </Link>
              <Link
                href="/users/me"
                className="w-full flex gap-1 justify-start items-center hover:bg-neutral-700 px-2 py-1">
                <IconUserCircle size={18} />
                My profile
              </Link>
            </section>
          </div>
        </div>
      </nav>
    </aside>
  );
}
