//Client side
"use client";

//React imports
import { useEffect, useRef, useState } from "react";

//Next imports
import { useParams } from "next/navigation";

//Prebuild UI imports
import SnackBar, { type SnackbarRef } from "@/components/ui/snackbar";
import LoadingDashboard from "@/components/screens/loading_dashboard";

//Hooks imports
import { searchTeamData } from "../page";

//Types imports
import User from "@/modules/user.types";

//Icons imports
import { IconArrowLeft, IconFolderCancel, IconTicket } from "@tabler/icons-react";

export default function TicketsTeamPage(){
  //Params data
  const params = useParams();

  //States handler
  //User data
  const [ user, setUser ] = useState<User>();
  //Team data
  const [ team, setTeam ] = useState<any>();

  //Snackbar data
  const snackbar = useRef<SnackbarRef>(null);

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
      className="bg-background text-text min-h-screen grid grid-rows-[auto_1fr]">
        <SnackBar />

        <header
        className="text-2xl h-max py-4 px-8 border-b border-neutral-600 flex justify-between items-center">
          { team.name } Tickets

          <a
          href={`/teams/${team.team_id}/tickets/create`}
          className="text-sm bg-main rounded-md px-4 py-1.5 hover:brightness-80 cursor-pointer">
            Create new +
          </a>
        </header>

        <main
        className="flex gap-5 justify-center items-start flex-wrap py-10 px-5">
          {/* Tickets cards */}
          {
            team.tickets && team.tickets.length > 0 ? team.tickets.map((ticket: any, index: number) =>
              <article
              key={index}
              className="group relative bg-neutral-900/50 border border-neutral-800 hover:border-main/50 rounded-xl p-5 w-full max-w-sm transition-all duration-300 shadow-sm hover:shadow-main/5"
            >
              <div className="absolute left-0 top-1/2 -translate-y-1/2 h-10 w-1 bg-main/40 rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="flex flex-col gap-4">
                
                <div className="flex items-center justify-between">
                  <div className="bg-main/10 p-2 rounded-lg">
                    <IconTicket
                    size={20}
                    color="blue"/>
                  </div>
                  <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">
                    Ticket #{index + 1}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-neutral-800 flex items-center justify-center text-xs font-medium">
                      {ticket.creator.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] text-neutral-500 leading-none"> Created by </span>
                      <span className="text-sm font-semibold text-neutral-200">{ticket.creator}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 py-1">
                    <div className="h-px flex-1 bg-neutral-800"></div>
                    <IconArrowLeft
                    size={20}
                    color="gray"/>
                    <div className="h-px flex-1 bg-neutral-800"></div>
                  </div>

                  <div className="flex flex-col pl-11">
                    <span className="text-[11px] text-neutral-500 leading-none">Asigned to</span>
                    <span className="text-sm font-medium text-neutral-300 italic">
                      {ticket.to}
                    </span>
                  </div>
                </div>
                
              </div>
            </article>
            ) : (
              <div
              className="flex flex-col text-neutral-500 justfiy-center items-center py-10">
                <IconFolderCancel
                size={50}
                stroke={1} />
                <p className="text-center text-lg">No Tickets Made yet</p>
              </div>
            )
          }
        </main>
      </div>
    ) : (
      <LoadingDashboard />
    )
  )
}