//Client side
"use client"

//Next imports
import { useParams } from "next/navigation"
import { getCookie } from "cookies-next/client";

//React imports
import { useEffect, useState, useRef, RefObject } from "react";

//Types imports
import User from "@/modules/user.types";

//Prebuild ui imports
import SideBar, { Icon } from "@/components/ui/sidebar";
import AIChat from "@/components/ui/ai_chat";
import SnackBar, { type SnackbarRef } from "@/components/ui/snackbar";
import LoadingDashboard from "@/components/screens/loading_dashboard";

//Icons imports
import {
  IconAppWindow,
  IconCalendar,
  IconCode,
  IconDatabase,
  IconEye,
  IconFolder,
  IconFolderCancel,
  IconLayoutKanban,
  IconMessage,
  IconUsers
} from "@tabler/icons-react";

//Functions for export
//Function for search team data
export async function searchTeamData (
  snackbar : RefObject<SnackbarRef | null>,
  params: any,
  setTeam: any
) {
  //Gets user's token
  const token : string | undefined = await getCookie("token");

  //If token isn't returned sends to login
  if(!token) return window.location.href = "/auth/login";

  //Gets the response from fetch
  const res = await fetch(`/api/teams/${params.id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token,
      "x-api-key": process.env.NEXT_PUBLIC_API_KEY!
    }
  });

  //Process the data from response
  const data = await res.json();

  //Verifies status
  if(res.status === 200) {
    //Sets team data
    setTeam(data.team);
    return data.team;
  }
  
  //If there's an error shows it
  snackbar.current?.showSnackBar(data.message, true);
  return;
}

export default function TeamPage(){
  //URL id
  const params = useParams();

  //States handler
  //User data
  const [ user, setUser ] = useState<User>();
  //Sidebar expanded
  const [ expanded, setExpanded ] = useState<boolean>(false);
  //Team data
  const [ team, setTeam ] = useState<any>(null);

  //Snackbar container
  const snackbar = useRef<SnackbarRef>(null);

  //Sets the data
  useEffect(() => {
    //Gets user from cache
    const cached = window.localStorage.getItem("user");
    if(!cached) window.location.href = "/auth/login";
    //Parses
    const parsed = JSON.parse(cached!);
    //Sets data
    setUser(parsed);

    //Gets team data
    searchTeamData(
      snackbar,
      params,
      setTeam
    );
  }, []);
  
  return (
      team ? (
        <div
        className="bg-background grid grid-cols-[auto_1fr] text-text">
          <AIChat />
          <SnackBar />

          <SideBar
          email={user?.email}
          setExpanded={(isExpanded : boolean) => {
            setExpanded(isExpanded === true ? false : true);
          }}
          plan={user?.plan}>
            {
              expanded && (
                <span className="w-full text-base font-bold p-2 mt-5 animate-fade-in-right">
                  Team 
                </span>
              )
            }

            <Icon
            action="/"
            name="Integrants"
            isDisplayed={expanded}>
              <IconUsers
              size={23}
              stroke={2}
              color="white"/>
            </Icon>

            <Icon
            action={`/teams/${team.team_id}/tickets`}
            name="Tickets"
            isDisplayed={expanded}>
              <IconFolder
              size={23}
              stroke={2}
              color="white"/>
            </Icon>

            <Icon
            action="/"
            name="JSON Editor"
            isDisplayed={expanded}>
              <IconCode
              size={23}
              stroke={2}
              color="white"/>
            </Icon>

            <Icon
            action="/"
            name="ERD Creator"
            isDisplayed={expanded}
            disabled={ user?.plan === "Free" }>
              <IconDatabase
              size={23}
              stroke={2}
              color="white"/>
            </Icon>

            <Icon
            action="/"
            name="Chat"
            isDisplayed={expanded}
            disabled={ user?.plan === "Free" }>
              <IconMessage
              size={23}
              stroke={2}
              color="white"/>
            </Icon>

            <Icon
            action="/"
            name="JSON Preview"
            isDisplayed={expanded}
            disabled={ user?.plan === "Free" }>
              <IconEye
              size={23}
              stroke={2}
              color="white"/>
            </Icon>

            <Icon
            action="/"
            name="Kanban board"
            isDisplayed={expanded}
            disabled={ user?.plan === "Free" }>
              <IconLayoutKanban
              size={23}
              stroke={2}
              color="white"/>
            </Icon>

            <Icon
            action="/"
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
          className="w-full h-screen overflow-w-hidden overflow-y-auto py-5 px-18 bg-background relative flex flex-col justify-start items-start">
            <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
              <div className="absolute left-1/2 top-1/2 aspect-square block w-200 -translate-x-1/2 -translate-y-1/2 rounded-full bg-main/15 blur-3xl animate-pulse" />
            </div>

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
                  <div className="grid grid-cols-2 pb-3 text-xs uppercase tracking-wider font-bold text-neutral-500 border-b border-neutral-800 mb-4 px-2">
                    <span>Username</span>
                    <span>Email</span>
                  </div>

                  <ul className="space-y-1 cursor-default">
                    {team.integrants && team.integrants.length > 0 ? (
                      team.integrants.map((member: any, index: number) => (
                        <li
                          key={index}
                          className="grid grid-cols-2 gap-4 py-3 px-2 rounded-lg transition-colors hover:bg-white/5 items-center group">
                          <span className="font-medium text-neutral-200 group-hover:text-blue-500 transition-colors">
                            {member.username}
                          </span>
                          <span className="font-light text-neutral-400 truncate text-sm">
                            {member.email}
                          </span>
                        </li>
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
                  </ul>
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
                        className="grid grid-cols-2 items-center gap-4 px-4 py-3 rounded-xl border border-white/5 bg-white/[0.02] text-sm text-neutral-200 transition-all duration-200 hover:bg-white/[0.05] hover:border-white/10 hover:shadow-md group cursor-pointer overflow-hidden mb-2"
                        onClick={() => { window.location.href = `/teams/${params.id}/tickets/${index}` }}>
                        <span className="truncate font-medium text-white">
                          {ticket.creator}
                        </span>

                        <span className="truncate text-right text-neutral-400 group-hover:text-neutral-200 transition-colors">
                          → {ticket.to}
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