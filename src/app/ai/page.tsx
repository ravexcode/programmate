"use client";

//Next imports
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

//React imports
import { useState, useEffect, useRef } from "react";

//Hooks imports
import { useGetToken } from "@/hooks/useCookies";
import { getCached } from "@/hooks/cache.hook";
import useAnimationClose from "@/hooks/useAnimationClose";

//Prebuilt UI imports
import LoadingScreen from "@/components/screens/loading-screen";
import SnackBar, { showSnackbar } from "@/components/ui/snackbar";

//Services imports
import getUser from "@/services/user.service";

//Types imports
import { UserData } from "@/types/user.types";
import { Provider } from "@/types/user.types";

//Icons imports
import {
  IconArrowLeft,
  IconArrowsMoveVertical,
  IconFolderOff,
  IconReceipt2,
  IconSend,
  IconSettings,
  IconUserCircle
} from "@tabler/icons-react";
import MainButton from "@/components/ui/buttons/main";

export default function AgentsPage() {
  const router = useRouter();

  const [ user, setUser ] = useState<UserData>();
  const [ profileDisabled, setProfileDisabled ] = useState(false);

  //Chat statuses
  const [ currentMessage, setCurrentMessage ] = useState("");
  const [ providers, setProviders ] = useState<Provider []>([]);
  const [ currentProvider, setCurrentProvider ] = useState("");
  const [ currentModel, setCurrentModel ] = useState("");

  const messages = [
    {
      sender: "user",
      content: "Hello Claude Haiku! 👋",
      sent_at: new Date(), //now
    },
    {
      sender: "agent",
      content: "Hi, i'm Claude Hailku, what are building today?"
    }
  ]

  const profileSettings = useRef(null);
  const modelMenu = useRef(null);
  const snackbar = useRef(null);

  useEffect(() => {
    async function get() {
      const token = useGetToken();

      if(!token) return router.push("/auth/login");

      const cached = getCached();

      if(cached) return setUser(cached);
      
      const fetched = await getUser(token);

      if(!fetched) return router.push("/auth/login");

      return setUser(fetched);
    }

    get();
    return;
  }, []);

  const toggleProfileSettings = () => {
    if(!profileSettings.current) return;

    const current : HTMLElement = profileSettings.current;
    const classlist = current.classList;

    setProfileDisabled(prev => prev ? false : true);

    if(classlist.contains("hidden")){
      classlist.remove("animate-fade-out-up");
      classlist.replace("hidden", "flex");

      return;
    };

    classlist.add("animate-fade-out-up");
    useAnimationClose(current, "fade-out-up", "hidden", "flex");
    return;
  }

  const toggleModelMenu = () => {
    if(!modelMenu.current) return;

    const current : HTMLElement = modelMenu.current;
    const classlist = current.classList;

    setProfileDisabled(prev => prev ? false : true);

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
    user ? (
      <div
      className="h-screen bg-background text-zinc-50 flex flex-col overflow-hidden"
      onClick={() => {
        if(profileSettings.current) {
          const current : HTMLElement = profileSettings.current;
          const classlist = current.classList;
          
          if(classlist.contains("flex")){
            setProfileDisabled(prev => prev ? false : true);
            classlist.add("animate-fade-out-up");
            useAnimationClose(current, "fade-out-up", "hidden", "flex");

            return;
          };
        }
      }}>
        <SnackBar ref={snackbar} />

        {/* Model menu */}
        <div
        className="w-screen h-screen fixed inset-0 backdrop-blur backdrop-brightness-80 z-10 hidden flex-col animate-fade-in-up animate-duration-300 items-center justify-center"
        ref={modelMenu}
        onClick={toggleModelMenu}>
          <section
          onClick={(e) => {
            e.preventDefault();
            e.nativeEvent.preventDefault();
          }}
          className="w-full max-w-250 rounded-md bg-neutral-900 border border-neutral-700 flex flex-col p-4">
            <div
            className="flex items-center justify-between border-b border-neutral-800 pb-5">
              <p
              className="text-lg font-medium tracking-wide">
                Your models
              </p>

              <MainButton
              size="w-40 h-max"
              action={toggleModelMenu}>
                + Add a new model
              </MainButton>
            </div>
            
            <div
            className="py-15 flex flex-col gap-1 items-center justify-center opacity-80 font-light">
              <IconFolderOff
              size={40}
              stroke={1} />
              <p
              className="text-xl">
                You don't have models at this moment
              </p>
              <p>
                Try adding a new one
              </p>
            </div>
          </section>
        </div>

        <header
        className="p-2 border-b border-neutral-800 flex items-center justify-between animate-fade-in-down">
          <button
          type="button"
          onClick={() => router.back()}
          className="flex gap-2 py-2 px-4 rounded-md duration-300 cursor-pointer hover:bg-neutral-800 items-center justify-center">
            <IconArrowLeft
            size={15} />
            Go back
          </button>
          
          {/* General settings */}
          <div
          className="h-full flex gap-1 items-center justify-center">
            {/* AI provider button */}
            <button
            type="button"
            onClick={toggleModelMenu}
            className="rounded-md hover:bg-neutral-800 h-full outline-none flex gap-2 items-center justify-center py-2 px-4 w-full max-w-max cursor-pointer duration-400 text-sm">
              <p> Claude </p>
              <span
              className="text-xs opacity-70"> Haiku 4.5 </span>
            </button>

            {/* Profile settings */}
            <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              e.nativeEvent.stopPropagation();
              toggleProfileSettings();
            }}
            className={"duration-400 cursor-pointer rounded-sm py-2 px-4 flex items-center justify-center gap-2 text-sm relative " + (profileDisabled ? "bg-neutral-800" : "hover:bg-neutral-800")}>
              {
                user.avatar_url ? (
                  <Image
                  src={user.avatar_url!}
                  alt={user.name + "profile picture"}
                  height={250}
                  width={250}
                  preload
                  loading="eager"
                  className="rounded-full w-6" />
                ) : (
                  <IconUserCircle
                  size={20} />
                )
              }
              {
                user.name
              }
              <IconArrowsMoveVertical
              size={14}
              className="ml-1" />

              <section
              className="absolute top-1/1 bg-neutral-900 p-2 w-full rounded-b-md animate-fade-in-down hidden flex-col animate-duration-300"
              ref={profileSettings}
              onClick={(e) => {
                e.stopPropagation();
                e.nativeEvent.stopPropagation();
              }}>
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
            </button>

          </div>
        </header>

        <main
        className="mx-auto px-4 py-3 overflow-y-auto w-full max-w-350 h-full">
          {
            messages && messages.length > 10 ? messages.map((message, index) =>
              <div
              key={index}>

              </div>
            ) : (
              <div
              className="flex justify-center items-center w-full h-full">
                <p
                className="text-5xl font-light opacity-80 select-none animate-fade-in-up">
                  What are we building today?
                </p>
              </div>
            )
          }
        </main>

        <footer
        className="mx-auto p-3 w-full max-w-350 bg-neutral-900 rounded-sm mb-3 animate-fade-in-up flex gap-3 items-center">
          <input
          type="text"
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          placeholder="Ask me anything..."
          className="bg-neutral-800 rounded-md p-2 w-full outline-none border-2 border-neutral-700 duration-400 focus:border-main" />

          {/* Message send button */}
          <button
          type="button"
          className="rounded-md bg-neutral-800 hover:bg-neutral-900 h-full outline-none flex gap-1 items-center justify-center py-2 px-4 w-full max-w-max cursor-pointer duration-400 relative">
            <span className="w-[102%] h-[110%] rounded-md top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 border-animate absolute -z-1" />
            <IconSend
            size={20} />
            Send message
          </button>
        </footer>
      </div>
    ) : (
      <LoadingScreen />
    )
  )
}