//Client side
"use client";

//React imports
import { useEffect, useRef, useState } from "react";

//Next imports
import { useParams } from "next/navigation";
import { getCookie } from "cookies-next/client";
import Link from "next/link";

//Prebuild UI imports
import SnackBar, { type SnackbarRef } from "@/components/ui/snackbar";
import LoadingDashboard from "@/components/screens/loading_dashboard";
import SideBar, { IconProps } from "@/components/ui/sidebar";
import CreatorForm from "@/components/forms/creatorForm";
import CreatorInput from "@/components/forms/creatorInputs";

//Hooks imports
import { searchTeamData } from "../page";

//Types imports
import User from "@/modules/user.types";
import Team from "@/types/team.types";

//Icons imports
import {
  IconAppWindow,
  IconArrowLeft,
  IconCalendar,
  IconDatabase,
  IconEye,
  IconFolder,
  IconFolderCancel,
  IconLayoutKanban,
  IconMessage,
  IconTicket,
  IconUsers
} from "@tabler/icons-react";

//Icon button component
function Icon(props : IconProps) {
  return (
    <Link
    href={props.action}
    className={"flex justify-start items-center gap-2 p-1 md:p-2 rounded-lg hover:bg-ultramarine-600 cursor-pointer transition focus:outline-none opacity-90 duration-400 " + (props.disabled && "grayscale brightness-50 pointer-events-none ") + (props.isDisplayed ? "w-46 md:w-60" : "w-full")}>
      {props.children}
      {props.isDisplayed && <span className="text-sm animate-fade-in-right"> {props.name} </span>}
    </Link>
  )
}

export default function TicketsTeamPage(){
  //Params data
  const params = useParams();

  //States handler
  //User data
  const [ user, setUser ] = useState<User>();
  //Team data
  const [ team, setTeam ] = useState<Team>();
  //Sidebar expanded
  const [ expanded, setExpanded ] = useState<boolean>(false);
  //Loading form status
  const [loading, setLoading] = useState(false);
  //Recivier
  const [to, setTo] = useState("");
  //Sender
  const [message, setMessage] = useState("");
  //Importance
  const [importance, setImportance] = useState<"Low" | "Medium" | "High">("Low");
  // Estado para controlar si el dropdown está abierto
  const [isImportantOpen, setIsImportantOpen] = useState(false);

  //Ref Objects
  //Snackbar data
  const snackbar = useRef<SnackbarRef>(null);
  //Ticket creator
  const creatorContainer: React.RefObject<null> = useRef(null);

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

  const importanceOptions = [
    { value: "Low", label: "Low", color: "bg-blue-500" },
    { value: "Medium", label: "Medium", color: "bg-orange-500" },
    { value: "High", label: "High", color: "bg-red-500" },
  ];

  const hideForm = () => {
    if(!creatorContainer.current) return;

    const current : HTMLElement = creatorContainer.current;

    current.classList.add("hidden");
    current.classList.remove("flex");
  }

  const showForm = () => {
    if(!creatorContainer.current) return;

    const current : HTMLElement = creatorContainer.current;

    current.classList.remove("hidden");
    current.classList.add("flex");
  };

  //Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      //Gets user's token
      const token: string | undefined = await getCookie("token");

      //If token isn't returned sends to login
      if (!token) {
        window.location.href = "/auth/login";
        return;
      }

      //Creates the ticket
      const ticket = {
        creator: user?.name || "",
        to,
        message,
        importance
      }

      //Makes the API call to create ticket
      const res = await fetch(`/api/teams/${params.id}/tickets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token,
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY!
        },
        body: JSON.stringify(ticket)
      });

      //Process the data from response
      const data = await res.json();

      //Verifies status
      if (res.status === 200) {
        //Sets the team
        const duplied_team = team;
        duplied_team?.tickets?.push(ticket);
        setTeam(duplied_team);
        //Hides the form
        hideForm();
        //Clears the data
        setMessage("");
        setTo("");
        setImportance("Low");
        return;
      }

      snackbar.current?.showSnackBar(data.message, true);
    } catch (error: any) {
      snackbar.current?.showSnackBar("An error occurred", true);
    } finally {
      setLoading(false);
    }
  };

  return (
    team ? (
      <div
      className="bg-background text-text min-h-screen grid grid-cols-[auto_1fr]">
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
                Project 
              </span>
            )
          }

          <Icon
          action={`/teams/${params.id}`}
          name="Team dashboard"
          isDisplayed={expanded}>
            <IconAppWindow
            size={23}
            stroke={2}
            color="white"/>
          </Icon>

          <Icon
          action={`/teams/${team.team_id}/integrants`}
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
          action={`/teams/${team.team_id}/erd`}
          name="ERD Creator"
          isDisplayed={expanded}
          disabled={ user?.plan === "Free" }>
            <IconDatabase
            size={23}
            stroke={2}
            color="white"/>
          </Icon>

          <Icon
          action={`/teams/${team.team_id}/chat`}
          name="Chat"
          isDisplayed={expanded}
          disabled={ user?.plan === "Free" }>
            <IconMessage
            size={23}
            stroke={2}
            color="white"/>
          </Icon>

          <Icon
          action={`/teams/${team.team_id}/json-preview`}
          name="JSON Preview"
          isDisplayed={expanded}
          disabled={ user?.plan === "Free" }>
            <IconEye
            size={23}
            stroke={2}
            color="white"/>
          </Icon>

          <Icon
          action={`/teams/${team.team_id}/kanban-board`}
          name="Kanban board"
          isDisplayed={expanded}
          disabled={ user?.plan === "Free" }>
            <IconLayoutKanban
            size={23}
            stroke={2}
            color="white"/>
          </Icon>

          <Icon
          action={`/teams/${team.team_id}/calendar`}
          name="Calendar"
          isDisplayed={expanded}
          disabled={ user?.plan === "Free" }>
            <IconCalendar
            size={23}
            stroke={2}
            color="white"/>
          </Icon>
        </SideBar>

        <div
        className="fixed backdrop-blur backdrop-brightness-60 top-0 left-0 w-screen h-screen overflow-x-hidden overflow-y-auto justify-center py-10 z-20 hidden"
        ref={creatorContainer}>
          <CreatorForm
          title="Create a new ticket"
          action={handleSubmit}
          hideAction={hideForm}
          actionIsDisabled={loading}>
            <CreatorInput
            value={to}
            label="Send to"
            placeholder="e.g. Jhon Doe"
            type="text"
            onChange={(e) => {
              setTo(e.target.value);
            }}
            required/>

            <CreatorInput
            value={message}
            label="Set message (Markdown supported)"
            placeholder="# Your targets in the next sprint..."
            type="textarea"
            onChange={(e) => {
              setMessage(e.target.value);
            }}
            required/>
            
            <div className="w-full flex flex-col items-start gap-1 mb-5 relative">
              <label className="text-sm font-light text-left">Importance</label>
              
              <button
                type="button"
                onClick={() => setIsImportantOpen(!isImportantOpen)}
                className={"w-full flex items-center justify-between bg-neutral-800 border-2 duration-400 hover:brightness-80 rounded-lg px-4 py-2 text-white group" + (isImportantOpen ? " border-main" : " border-transparent")}>
                <div className="flex items-center gap-3">
                  <span className={`w-2 h-2 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.1)] ${
                    importanceOptions.find(opt => opt.value === importance)?.color || "bg-zinc-500"
                  }`} />
                  <span className="text-sm font-medium">{importance}</span>
                </div>
                
                <svg 
                  className={`w-4 h-4 text-zinc-500 transition-transform duration-200 ${isImportantOpen ? 'rotate-180' : ''}`} 
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {isImportantOpen && (
                <>
                  {/* Overlay invisible para cerrar al hacer click fuera */}
                  <div className="fixed inset-0 z-10" onClick={() => setIsImportantOpen(false)} />
                  
                  <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-[#161616] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-20 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-1">
                      {importanceOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setImportance((option.value === "Low" || option.value === "Medium" || option.value === "High") ? option.value : "Low");
                            setIsImportantOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 ${
                            status === option.value 
                            ? 'bg-white/10 text-white' 
                            : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'
                          }`}
                        >
                          <span className={`w-2 h-2 rounded-full ${option.color}`} />
                          <span className="flex-1 text-left">{option.label}</span>
                          {status === option.value && (
                            <svg className="w-4 h-4 text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </CreatorForm>
        </div>

        <div
        className="grid grid-rows-[auto_1fr]">
          <header
          className="text-2xl h-max py-4 px-8 border-b border-neutral-800 flex justify-between items-center">
            <div
            className="flex gap-2 justify-center items-center">
              <p> { team.name } Tickets </p>
            </div>

            <button
            onClick={showForm}
            className="text-sm bg-main rounded-md px-4 py-1.5 hover:brightness-80 cursor-pointer">
              Create new +
            </button>
          </header>

          <main
          className="flex gap-5 justify-center items-start flex-wrap py-10 px-5">
            {/* Tickets cards */}
            {
              team.tickets && team.tickets.length > 0 ? team.tickets.map((ticket: any, index: number) =>
                <article
                key={index}
                className="group relative bg-neutral-900/50 border border-neutral-800 hover:border-main/50 rounded-xl p-5 w-full max-w-sm transition-all duration-300 shadow-sm hover:shadow-main/5 cursor-pointer"
                onClick={() => { window.location.href = `/teams/${team.team_id}/tickets/${index}` }}>
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
        
      </div>
    ) : (
      <LoadingDashboard />
    )
  )
}