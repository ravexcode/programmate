//Client side
"use client";

//React imports
import { useEffect, useRef, useState } from "react";

//Next imports
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

//Prebuild UI imports
import SnackBar, { showSnackbar } from "@/components/ui/snackbar";
import LoadingDashboard from "@/components/screens/loading-screen";
import SideBar, { Icon } from "@/components/ui/sidebar";
import CreatorForm from "@/components/forms/creator-form";
import CreatorInput from "@/components/forms/creator-inputs";
import MainButton from "@/components/ui/buttons/main";
import BgGradient from "@/components/ui/bg-gradient";
import TicketCard from "@/components/ui/ticket-card";

//Hooks imports
import useAnimationClose from "@/hooks/useAnimationClose";
import { useDeleteToken, useGetToken } from "@/hooks/useCookies";
import { getCached } from "@/hooks/cache.hook";

//Types imports
import { UserData } from "@/types/user.types";
import Team, { Ticket } from "@/types/team.types";

//Icons imports
import {
  IconAppWindow,
  IconArrowDown,
  IconCalendar,
  IconCircleFilled,
  IconDatabase,
  IconEye,
  IconFolder,
  IconFolderCancel,
  IconLayoutKanban,
  IconMessage,
  IconSettings,
  IconUsers
} from "@tabler/icons-react";

//Services imports
import getUser from "@/services/user.service";
import getTeam from "@/services/team.service";

export default function TicketsTeamPage(){
  //NextJS Setup
  const params = useParams();
  const router = useRouter();

  //States handler
  //User data
  const [ user, setUser ] = useState<UserData>();
  //Team data
  const [ team, setTeam ] = useState<Team>();
  //Tickets data
  const [ tickets, setTickets ] = useState<Ticket []>();
  //Sidebar expanded
  const [ expanded, setExpanded ] = useState<boolean>(false);
  //Loading form status
  const [loading, setLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  //Recivier
  const [to, setTo] = useState("");
  //Title
  const [title, setTitle] = useState("");
  //Sender
  const [message, setMessage] = useState("");
  //Importance
  const [importance, setImportance] = useState<"Low" | "Medium" | "High">("Low");
  const [isImportantOpen, setIsImportantOpen] = useState(false);

  //Card status
  const [ menuIndex, setMenuIndex ] = useState<number | undefined>();
  const [ currentIndex, setCurrentIndex ] = useState<number | undefined>();

  //Ref Objects
  //Snackbar data
  const snackbar = useRef(null);
  //Ticket creator
  const creatorContainer= useRef(null);
  //Ticket creator
  const editContainer = useRef(null);

  //Set expanded based in localstorage
  useEffect(() => {
    const expanded = window.localStorage.getItem("expanded");

    if(expanded) return setExpanded(true);

    return;
  }, []);

  //Handle showing/hiding edit form when currentIndex changes
  useEffect(() => {
    if(currentIndex !== undefined && editContainer.current) {
      const current : HTMLElement = editContainer.current;
      const classlist = current.classList;

      if(classlist.contains("hidden")){
        classlist.remove("animate-fade-out-down");
        classlist.replace("hidden", "flex");
      }
    }
  }, [currentIndex]);

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
      setTickets(team.tickets);
    }

    fetchData();
  }, []);

  const importanceOptions = [
    { value: "Low", label: "Low", color: "bg-blue-500" },
    { value: "Medium", label: "Medium", color: "bg-orange-500" },
    { value: "High", label: "High", color: "bg-red-500" },
  ];

  const toggleForm = () => {
    if(!creatorContainer.current) return;

    const current : HTMLElement = creatorContainer.current;
    const classlist = current.classList;

    if(classlist.contains("hidden")){
      classlist.remove("animate-fade-out-down");
      classlist.replace("hidden", "flex");

      return;
    };

    classlist.add("animate-fade-out-down");
    useAnimationClose(current, "fade-out-down", "hidden", "flex");
    return;
  };

  const toggleEditForm = () => {
    if(!editContainer.current) return;

    const current : HTMLElement = editContainer.current;
    const classlist = current.classList;

    if(classlist.contains("hidden")){
      classlist.remove("animate-fade-out-down");
      classlist.replace("hidden", "flex");

      return;
    };

    classlist.add("animate-fade-out-down");
    useAnimationClose(current, "fade-out-down", "hidden", "flex");
    setCurrentIndex(undefined);
    return;
  };

  const toggleCofirm = () => {

  }

  //Handle submit
  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      //Gets user's token
      const token = useGetToken();

      //If token isn't returned sends to login
      if (!token) {
        window.location.href = "/auth/login";
        return;
      }

      //Creates the ticket
      const ticket = {
        creator: user?.name || "",
        to,
        title,
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
        toggleForm();
        //Clears the data
        setMessage("");
        setTo("");
        setImportance("Low");
        return;
      }

      showSnackbar(data.message, (res.status >= 500 ? "critic" : "warn"), snackbar);
    } catch(e: unknown) {
      if(e instanceof Error) {
        showSnackbar(e.message, "critic", snackbar);
      }
      
      showSnackbar("Server error", "critic", snackbar);
      return;
    } finally {
      setLoading(false);
    }
  };

  //Handle ticket edit
  const handleEdit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if(currentIndex === undefined) return showSnackbar("Index not found", "warn", snackbar);
    setEditLoading(true);

    const token = useGetToken();

    if(!token) return router.push("/auth/login");
    toggleEditForm();

    const res = await fetch(
      `/api/teams/${params.id}/tickets`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
          "Authorization": token
        },
        body: JSON.stringify({
          ticket: tickets![currentIndex],
          ticketIndex: currentIndex
        })
      }
    );

    const data = await res.json();

    if(res.status === 200) {
      showSnackbar(data.message, "valid", snackbar);
      setEditLoading(false);

      return;
    }

    showSnackbar(data.message || "Server error", ( res.status >= 500 ? "critic" : "warn" ), snackbar);
    setEditLoading(false);
    return;
  }

  return (
    team ? (
      <div
      className="bg-background text-text h-screen grid grid-cols-[auto_1fr]"
      onClick={() => {
        setMenuIndex(undefined);
      }}>
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

        {/* Creator form */}
        <div
        className="fixed backdrop-blur backdrop-brightness-60 top-0 left-0 w-screen h-screen overflow-x-hidden overflow-y-auto justify-center py-10 z-20 hidden animate-fade-in-up animate-duration-200"
        ref={creatorContainer}
        onClick={toggleForm}>
          <CreatorForm
          title="Create a new ticket"
          action={handleSubmit}
          hideAction={toggleForm}
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
            value={title}
            label="Title"
            placeholder="e.g. Check GitHub Issues"
            type="text"
            onChange={(e) => {
              setTitle(e.target.value);
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
                className={"w-full flex items-center justify-between bg-neutral-800 border-2 duration-400 hover:brightness-80 rounded-lg px-4 py-2 text-white cursor-pointer" + (isImportantOpen ? " border-main" : " border-transparent")}>
                <div className="flex items-center gap-3">
                  <span className={`w-2 h-2 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.1)] ${
                    importanceOptions.find(opt => opt.value === importance)?.color || "bg-zinc-500"
                  }`} />
                  <span className="text-sm font-medium">{importance}</span>
                </div>

                <IconArrowDown
                className={`w-4 h-4 text-zinc-500 transition-transform duration-200 ${isImportantOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isImportantOpen && (
                <>
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
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 cursor-pointer ${
                            importance === option.value 
                            ? 'bg-white/10 text-white' 
                            : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'
                          }`}
                        >
                          <span className={`w-2 h-2 rounded-full ${option.color}`} />
                          <span className="flex-1 text-left">{option.label}</span>
                          {importance === option.value && (
                            <IconCircleFilled
                            size={10}
                            color="gray" />
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

        {/* Editor form */}
        {
          currentIndex !== undefined && tickets && (
            <div
            className="fixed backdrop-blur backdrop-brightness-60 top-0 left-0 w-screen h-screen overflow-x-hidden overflow-y-auto justify-center py-10 z-20 hidden animate-fade-in-up animate-duration-200"
            ref={editContainer}
            onClick={toggleEditForm}>
              <CreatorForm
              title="Edit your ticket"
              action={(e) => {
                handleEdit(e);
              }}
              hideAction={toggleEditForm}
              actionIsDisabled={editLoading}
              confirmMessage="Edit">
                <CreatorInput
                value={tickets[currentIndex].to}
                label="Send to"
                placeholder="e.g. Jhon Doe"
                type="text"
                onChange={(e) => {
                  setTickets(
                    prev => prev ? 
                    prev.filter((ticket, index) =>{
                      if(index !== currentIndex) return ticket;

                      ticket.to = e.target.value;

                      return ticket;
                    })
                    : []
                  )
                }}
                required/>

                <CreatorInput
                value={tickets[currentIndex].title}
                label="Title"
                placeholder="e.g. Check GitHub Issues"
                type="text"
                onChange={(e) => {
                  setTickets(
                    prev => prev ? 
                    prev.filter((ticket, index) =>{
                      if(index !== currentIndex) return ticket;

                      ticket.title = e.target.value;

                      return ticket;
                    })
                    : []
                  )
                }}
                required/>

                <CreatorInput
                value={tickets[currentIndex].message}
                label="Set message (Markdown supported)"
                placeholder="# Your targets in the next sprint..."
                type="textarea"
                onChange={(e) => {
                  setTickets(
                    prev => prev ? 
                    prev.filter((ticket, index) =>{
                      if(index !== currentIndex) return ticket;

                      ticket.message = e.target.value;

                      return ticket
                    })
                    : []
                  )
                }}
                required/>
                
                <div className="w-full flex flex-col items-start gap-1 mb-5 relative">
                  <label className="text-sm font-light text-left">Importance</label>
                  
                  <button
                    type="button"
                    onClick={() => setIsImportantOpen(!isImportantOpen)}
                    className={"w-full flex items-center justify-between bg-neutral-800 border-2 duration-400 hover:brightness-80 rounded-lg px-4 py-2 text-white cursor-pointer" + (isImportantOpen ? " border-main" : " border-transparent")}>
                    <div className="flex items-center gap-3">
                      <span className={`w-2 h-2 rounded-full ${
                        importanceOptions.find(opt => opt.value === tickets[currentIndex].importance)?.color || "bg-zinc-500"
                      }`} />
                      <span className="text-sm font-medium">{tickets[currentIndex].importance}</span>
                    </div>

                    <IconArrowDown
                    className={`w-4 h-4 text-zinc-500 transition-transform duration-200 ${isImportantOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {isImportantOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setIsImportantOpen(false)} />
                      
                      <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-[#161616] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-20 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-1">
                          {importanceOptions.map((option) => (
                            <button
                              key={option.value}
                              onClick={() => {
                                setTickets(
                                  prev => prev ? 
                                  prev.filter((ticket, index) =>{
                                    if(index !== currentIndex) return ticket;

                                    ticket.importance = (option.value === "Low" || option.value === "Medium" || option.value === "High") ? option.value : "Low";

                                    return ticket;
                                  })
                                  : []
                                )
                                setIsImportantOpen(false);
                              }}
                              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 cursor-pointer ${
                                tickets[currentIndex].importance === option.value 
                                ? 'bg-white/10 text-white' 
                                : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'
                              }`}
                            >
                              <span className={`w-2 h-2 rounded-full ${option.color}`} />
                              <span className="flex-1 text-left">{option.label}</span>
                              {tickets[currentIndex].importance === option.value && (
                                <IconCircleFilled
                                size={10}
                                color="gray" />
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
        )}

        <div
        className="grid grid-rows-[auto_1fr] relative h-max md:h-auto overflow-auto">
          <BgGradient />

          <header
          className="text-2xl h-max py-4 px-8 flex justify-between items-center">
            <div
            className="flex gap-2 justify-center items-center">
              <p> { team.name } Tickets </p>
            </div>

            <MainButton
            action={toggleForm}
            size="w-35">
              Create new +
            </MainButton>
          </header>

          <main
          className="gap-5 py-5 px-8 grid grid-rows md:grid-cols-2 xl:grid-cols-3">
            {/* Tickets cards */}
            {
              team.tickets && team.tickets.length > 0 ? team.tickets.map((ticket: Ticket, index: number) =>
                <TicketCard
                content={ticket}
                teamId={params.id}
                index={index}
                setMenuIndex={setMenuIndex}
                menuIndex={menuIndex}
                router={router}
                key={index}
                editAction={() => {
                  setCurrentIndex(index);
                  setMenuIndex(undefined);
                  return;
                }}
                deleteAction={() => {
                  setCurrentIndex(index);
                  setMenuIndex(undefined);
                  toggleCofirm();
                  return;
                }} />
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