//Client side
"use client"

//Next imports
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

//React imports
import { useEffect, useState, useRef } from "react";

//Types imports
import { UserBasic, UserData } from "@/types/user.types";

//Prebuild ui imports
import SideBar, { Icon } from "@/components/ui/sidebar";
import SnackBar from "@/components/ui/snackbar";
import LoadingDashboard from "@/components/screens/loading-screen";
import BgGradient from "@/components/ui/bg-gradient";

//Hooks imports
import { useDeleteToken, useGetToken } from "@/hooks/useCookies";
import { getCached } from "@/hooks/cache.hook";

//Services imports
import getTeam from "@/services/team.service";
import getUser from "@/services/user.service";

//Icons imports
import {
  IconCalendar,
  IconDatabase,
  IconEye,
  IconFolder,
  IconFolderCancel,
  IconLayoutKanban,
  IconMessage,
  IconSettings,
  IconUserCircle,
  IconUsers
} from "@tabler/icons-react";
import Image from "next/image";

export default function TeamPage(){
  //NextJS Setup
  const params = useParams();
  const router = useRouter();

  //States handler
  //User data
  const [ user, setUser ] = useState<UserData>();
  //Sidebar expanded
  const [ expanded, setExpanded ] = useState<boolean>(false);
  //Team data
  const [ team, setTeam ] = useState<any>(null);

  //Snackbar container
  const snackbar = useRef(null);

  //Sidebar status
  useEffect(() => {
    const expanded = window.localStorage.getItem("expanded");

    if(expanded) return setExpanded(true);

    return;
  }, []);

  //Sets the data
  useEffect(() => {
    async function get() {
      let user_data : UserData;

      const token = useGetToken();

      if(!token) return router.push("/auth/login");

      const cached = getCached();

      if(cached) {
        user_data = cached
      } else {
        const fetched = await getUser(token);
        
        if(!fetched) {
          useDeleteToken();
          window.localStorage.clear();
          return router.push("/auth/login");
        };

        user_data = fetched;
      }

      setUser(user_data);

      //Gets team data
      const team = await getTeam(
        Number(params.id),
        token,
        snackbar
      );

      setTeam(team);
      
      return;
    }

    get();
  }, []);
  
  return (
      team ? (
        <div
        className="bg-background grid grid-cols-[auto_1fr] text-text">
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
            {
              expanded && (
                <span className="w-full text-base font-bold p-2 mt-5 animate-fade-in-right">
                  Project 
                </span>
              )
            }

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

            <Icon
            action={`/projects/${team.team_id}/settings`}
            name="Project settings"
            isDisplayed={expanded}>
              <IconSettings
              size={23}
              stroke={2}
              color="white"/>
            </Icon>
          </SideBar>

          <main
          className="w-full h-screen overflow-w-hidden overflow-y-auto py-5 px-18 bg-background relative flex flex-col justify-start items-start">
            <BgGradient />

            {/* Team data section */}
            <section
            className="flex flex-col py-2 w-full justify-center items-start mb-5">
              <h2
              className="text-5xl font-semibold mb-2">
                {team?.name}
              </h2>

              <p
              className="opacity-70">
                {team?.description}
              </p>

              <div
              className="flex gap-2 flex-wrap w-full justify-start items-center mt-5 cursor-default">
                {
                  team && team.tags.length >= 1 && team.tags.map((tag: string, index: number) => 
                    <div
                    key={index}
                    className="text-sm px-4 py-1 rounded-full border border-main/50 bg-main/30 duration-400 hover:bg-main/50">
                      {tag}
                    </div>
                  )  
                }
              </div>

              <p
              className="text-sm opacity-80 font-light mt-2">
                Team ID: {team.team_id}
              </p>

              <p
              className="mt-1 flex gap-2 justify-center items-center w-max rounded-full text-sm">
                <span className={"w-1.5 h-1.5 rounded-full block " + (
                  team.status === "Backlog" ? "bg-zinc-500" :
                  team.status === "Planning" ? "bg-blue-400" :
                  team.status === "In Progress" ? "bg-orange-400" :
                  team.stratus === "On Hold" ? "bg-red-400" :
                  "bg-purple-500" ) }></span>
                { team?.status }
              </p>
            </section>

            
            <section
            className="w-full flex justify-center items-start gap-5 md:gap-15 flex-wrap">

              {/* Team members section */}
              <section className="w-full md:max-w-2xl border border-neutral-800 bg-neutral-950 backdrop-blur-sm rounded-md overflow-hidden shadow-xl">
                <header className="px-6 py-4 border-b border-neutral-800 bg-neutral-950">
                  <h3 className="text-xl font-semibold text-white">Team Members</h3>
                </header>

                <div className="p-6">
                  {team.integrants && team.integrants.length > 0 ? (
                    team.integrants.map((member: UserBasic, index: number) => (
                      <Link
                      href={`/users/${member.id}`}
                      key={index}
                      className="flex gap-4 py-3 px-2 rounded-lg transition-colors hover:bg-white/5 items-center group">
                        {
                          member.avatar_url ? (
                            <Image
                            src={member.avatar_url}
                            alt={`${member.username} profile picture`}
                            width={50}
                            height={50}
                            preload
                            loading="eager"
                            className="rounded-full aspect-square w-8" />
                          ) : (
                            <IconUserCircle
                            className="aspect-square w-8" />
                          )
                        }
                        <span className="font-medium text-neutral-200 group-hover:text-blue-500 transition-colors">
                          {member.username}
                        </span>
                        <span className="font-light text-neutral-400 truncate text-sm ml-auto">
                          {member.email}
                        </span>
                      </Link>
                    ))
                  ) : (
                    <div
                    className="flex flex-col text-neutral-500 justfiy-cente items-center py-8">
                      <IconUsers
                      size={40}
                      stroke={1} />
                      <p className="text-center">No members found</p>
                    </div>
                  )}
                </div>
              </section>


              {/* Tickets section */}
              <section
              className="w-full md:max-w-2xl border border-neutral-800 bg-neutral-950 backdrop-blur-sm rounded-md overflow-hidden shadow-xl h-100 overflow-y-auto overflow-x-hidden">
                <header
                className="px-6 py-4 border-b border-neutral-800 bg-neutral-950">
                  <h3
                  className="text-xl font-semibold text-white">
                    Team Tickets
                  </h3>
                </header>

                <ul className="space-y-1 cursor-default px-6 py-2">
                    {team.tickets && team.tickets.length > 0 ? (
                      team.tickets.map((ticket: any, index: number) => (
                        <li
                        key={index}
                        className="grid grid-cols-2 items-center gap-4 px-4 py-3 rounded-xl border border-white/5 bg-white/2 text-sm text-neutral-200 transition-all duration-200 hover:bg-white/5 hover:border-white/10 hover:shadow-md group cursor-pointer overflow-hidden mb-2"
                        onClick={() => { window.location.href = `/teams/${params.id}/tickets/${index}` }}>
                        <span className="truncate font-medium text-white">
                          {ticket.title}
                        </span>

                        <span className="truncate text-right text-neutral-400 group-hover:text-neutral-200 transition-colors">
                          for <span className="text-sky-600">{ticket.to}</span>
                        </span>
                      </li>
                      ))
                    ) : (
                      <div
                      className="flex flex-col text-neutral-500 justfiy-center items-center py-10">
                        <IconFolderCancel
                        size={40}
                        stroke={1} />
                        <p className="text-center">No Tickets Made yet</p>

                        <a
                        href={`/teams/${team.team_id}/tickets/create`}
                        className="px-4 py-1 mt-3 rounded-lg text-text/70 border-2 border-main/60 duration-400 cursor-pointer hover:border-main hover:text-text">
                          Create new <span className="font-bold relative -top-0.5 ml-1">+</span>
                        </a>
                      </div>
                    )}
                  </ul>
              </section>
            </section>
          </main>
        </div>
      ) : (
        <LoadingDashboard />
      )
  )
}