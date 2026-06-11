"use client";

//Next imports
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

//React imports
import { useEffect, useState, useRef } from "react";

//Prebuilt ui imports
import SideBar, { Icon } from "@/components/ui/sidebar";
import BgGradient from "@/components/ui/bg-gradient";
import SnackBar, { showSnackbar } from "@/components/ui/snackbar";
import LoadingScreen from "@/components/screens/loading-screen";

//Services imports
import getUser from "@/services/user.service";
import getTeam from "@/services/team.service";

//Hooks imports
import { useDeleteToken, useGetToken } from "@/hooks/useCookies";

//Types imports
import { UserData } from "@/types/user.types";
import Team from "@/types/team.types";
import { getCached } from "@/hooks/cache.hook";

//Icons imports
import {
  IconAppWindow,
  IconCalendar,
  IconDatabase,
  IconEye,
  IconFolder,
  IconLayoutKanban,
  IconMessage,
  IconSettings,
  IconUsers
} from "@tabler/icons-react";

export default function SettingsPage(){
  //Next setup
  const router = useRouter();
  const params = useParams();

  //Data states
  const [ user, setUser ] = useState<UserData>();
  const [ team, setTeam ] = useState<Team>();
  const [ expanded, setExpanded ] = useState<boolean>(false);

  //Components ref
  const snackbar = useRef(null);
  
  //Set expanded based in localstorage
  useEffect(() => {
    const expanded = window.localStorage.getItem("expanded");

    if(expanded) return setExpanded(true);

    return;
  }, []);
  useEffect(() => {
    async function fetchData() {
      let user_data: UserData;

      const token = useGetToken();

      if(!token) return router.push("/auth/login");

      const cached = getCached();

      if(!cached) {
        const user_fetched = await getUser(token);

        if(!user_fetched) {
          useDeleteToken();
          window.localStorage.clear();
          return router.push("/auth/login");
        }

        user_data = user_fetched
      } else {
        user_data = cached;
      }

      setUser(user_data);

      const team = await getTeam(
        Number(params.id),
        token,
        snackbar
      );

      setTeam(team);
    }

    fetchData();
  }, []);

  return (
    user && team ? (
      <div
      className="bg-background text-text h-screen grid grid-cols-[auto_1fr]">
        <SnackBar
        ref={snackbar} />
        <SideBar
        email={user?.email!}
        plan={user?.plan!}
        avatar={user?.avatar_url}
        username={user?.name!}
        setExpanded={(isExpanded : boolean) => {
          setExpanded(isExpanded === true ? false : true);
        }}>
          
          { expanded && ( <span className="w-full text-base font-bold p-2 animate-fade-in-right"> Project </span> ) }

          <Icon
          action={`/projects/${params.id}`}
          name="Dashboard"
          isDisplayed={expanded}>
            <IconAppWindow
            size={23}
            stroke={2}
            color="white"/>
          </Icon>

          <Icon
          action={`/projects/${team.team_id}/integrants`}
          name="Integrants"
          isDisplayed={expanded}>
            <IconUsers
            size={23}
            stroke={2}
            color="white"/>
          </Icon>

          <Icon
          action={`/projects/${team.team_id}/tickets`}
          name="Tickets"
          isDisplayed={expanded}>
            <IconFolder
            size={23}
            stroke={2}
            color="white"/>
          </Icon>

          <Icon
          action={`/projects/${team.team_id}/erd`}
          name="ERD Creator"
          isDisplayed={expanded}
          disabled={ user?.plan === "Free" }>
            <IconDatabase
            size={23}
            stroke={2}
            color="white"/>
          </Icon>

          <Icon
          action={`/projects/${team.team_id}/chat`}
          name="Chat"
          isDisplayed={expanded}
          disabled={ user?.plan === "Free" }>
            <IconMessage
            size={23}
            stroke={2}
            color="white"/>
          </Icon>

          <Icon
          action={`/projects/${team.team_id}/json-preview`}
          name="JSON Preview"
          isDisplayed={expanded}
          disabled={ user?.plan === "Free" }>
            <IconEye
            size={23}
            stroke={2}
            color="white"/>
          </Icon>

          <Icon
          action={`/projects/${team.team_id}/kanban-board`}
          name="Kanban board"
          isDisplayed={expanded}
          disabled={ user?.plan === "Free" }>
            <IconLayoutKanban
            size={23}
            stroke={2}
            color="white"/>
          </Icon>

          <Icon
          action={`/projects/${team.team_id}/calendar`}
          name="Calendar"
          isDisplayed={expanded}
          disabled={ user?.plan === "Free" }>
            <IconCalendar
            size={23}
            stroke={2}
            color="white"/>
          </Icon>
        </SideBar>

        <main
        className="flex flex-col justify-start items-center p-10 relative">
          <BgGradient />

          <p
          className="text-3xl font-medium tracking-wide mb-5 z-2">
            {team.name} settings
          </p>

          <form
          className="w-full max-w-200 rounded-md p-2 bg-neutral-950 border border-neutral-800 z-2 flex flex-col items-start justify-start gap-4">
            <div
            className="w-full flex flex-col gap-2 text-sm items-start justify-center">
              <label
              className="text-xs">
                Team name
              </label>
              <input
              value={team.name}
              onChange={(e) => {
                setTeam(
                  prev => prev ? {
                    ...prev,
                    name: e.target.value
                  } : team
                )
              }}
              type="text"
              className="outline-none bg-neutral-900 rounded-md py-1 px-2 text-sm duration-300 border border-transparent focus:border-main w-80"
              placeholder="e.g. Project apollo" />
            </div>

            
            <div
            className="w-full flex flex-col gap-2 text-sm items-start justify-center">
              <label
              className="text-xs">
                Team description
              </label>
              <textarea
              defaultValue={team.description}
              onChange={(e) => {
                setTeam(
                  prev => prev ? {
                    ...prev,
                    description: e.target.value
                  } : team
                )
              }}
              className="outline-none bg-neutral-900 rounded-md py-1 px-2 text-sm duration-300 border border-transparent focus:border-main w-full min-h-30 max-h-30"
              placeholder="e.g. Project apollo" />
            </div>
          </form>
        </main>
      </div>
    ) : (
      <LoadingScreen />
    )
  )
}