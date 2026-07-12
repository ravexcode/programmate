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
import TeamSidebar from "@/components/ui/dashboard/team-sidebar";
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
  IconAssembly,
  IconCircleFilled,
  IconInfoCircle,
} from "@tabler/icons-react";

//Services imports
import getUser from "@/services/user.service";
import getTeam from "@/services/team.service";
import AltButton from "@/components/ui/buttons/alternate";
import HazardButton from "@/components/ui/buttons/hazard";
import { fetchTemplate } from "@/actions/template";

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
  //Loading form status
  const [loading, setLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
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

  //Menu status
  const [ currentMenu, setCurrentMenu ] = useState<"edit" | "delete" | undefined>();

  //Selector
  const [ currIntIndex, setCurrIntIndex ] = useState<number>(0);
  const [ isSelOpen, setIsSelOpen ] = useState(false);

  //Ref Objects
  //Snackbar data
  const snackbar = useRef(null);
  //Ticket creator
  const creatorContainer= useRef(null);
  const editContainer = useRef(null);
  const confirmMenu = useRef(null);

  useEffect(() => {
    if (currentIndex === undefined) {
      setCurrentMenu(undefined);
      return;
    }

    const toggleMenu = (element: HTMLElement | null) => {
      if (!element) return;
      
      const classlist = element.classList;

      if (classlist.contains("hidden")) {
        classlist.remove("animate-fade-out-down");
        classlist.replace("hidden", "flex");
      } else {
        classlist.add("animate-fade-out-down");
        useAnimationClose(element, "fade-out-down", "hidden", "flex"); 
        setCurrentIndex(undefined);
      }
    };

    if (currentMenu === "edit") {
      toggleMenu(editContainer.current);
      return;
    } else if (currentMenu === "delete") {
      toggleMenu(confirmMenu.current);
      return;
    }

  }, [currentIndex, currentMenu]);

  useEffect(() => {
    async function fetchData() {
      let user_data: UserData;

      const token = useGetToken();

      if(!token) return router.push("/auth/signin");

      const cached = getCached();

      if(!cached) {
        const user_fetched = await getUser(token);

        if(!user_fetched) {
          useDeleteToken();
          window.localStorage.clear();
          return router.push("/auth/signin");
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
    setTimeout(() => {
      setCurrentIndex(undefined);
      return;
    }, 400)
    return;
  };

  const toggleCofirm = () => {
    if(!confirmMenu.current) return;

    const current : HTMLElement = confirmMenu.current;
    const classlist = current.classList;

    if(classlist.contains("hidden")){
      classlist.remove("animate-fade-out-down");
      classlist.replace("hidden", "flex");

      return;
    };

    classlist.add("animate-fade-out-down");
    useAnimationClose(current, "fade-out-down", "hidden", "flex");
    setTimeout(() => {
      setCurrentIndex(undefined);
      return;
    }, 400)
    return;
  }

  //Handle submit
  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    if(!user || !team || currIntIndex === undefined) return;
    setLoading(true);
    
    const preTeam = team; //Error supporter

    //Creates the ticket
    const ticket = {
      creator: user.name || "",
      creator_id: user.id,
      to: team.integrants[currIntIndex].username,
      title,
      message,
      importance
    }

    //Updates the team
    setTeam(
      prev => prev ? {
        ...prev,
        tickets: [
          ...prev.tickets || [],
          ticket
        ]
      } : team
    );

    
    //Hides the form
    toggleForm();
    //Clears the data
    setMessage("");
    setCurrIntIndex(0);
    setImportance("Low");

    try {
      //Gets user's token
      const token = useGetToken();

      //If token isn't returned sends to login
      if (!token) {
        window.location.href = "/auth/signin";
        return;
      }

      //Makes the API call to create ticket
      const res = await fetch(`/api/teams/${params.id}/tickets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token,
          "nexzero-api-key": process.env.NEXT_PUBLIC_API_KEY!
        },
        body: JSON.stringify(ticket)
      });

      //Process the data from response
      const data = await res.json();

      //Verifies status
      if (res.status === 200) return;

      setTeam(preTeam);
      showSnackbar(data.message, (res.status >= 500 ? "critic" : "warn"), snackbar);
      return;
    } catch(e: unknown) {
      setTeam(preTeam);
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
    if(!tickets) return;
    setEditLoading(true);

    const token = useGetToken();

    if(!token) return router.push("/auth/signin");
    toggleEditForm();

    const res = await fetch(
      `/api/teams/${params.id}/tickets`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "nexzero-api-key": process.env.NEXT_PUBLIC_API_KEY!,
          "Authorization": token
        },
        body: JSON.stringify({
          ticket: tickets[currentIndex],
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

  const handleDelete = async () => {
    if(currentIndex === undefined) return;

    const token = useGetToken();

    if(!token) return router.push("/auth/signin");

    setTickets(prev =>
      prev ?
        prev.filter((_, i) => i !== Number(currentIndex))
        : []
    );
    setTeam(
      prev => 
        prev ? {
          ...prev,
          tickets: tickets ?
            tickets.filter((_, i) => i !== Number(currentIndex))
            : []
        }
        : team
    );

    await fetchTemplate(
      `/api/teams/${params.id}/tickets/${currentIndex}`,
      "DELETE",
      snackbar,
      {
        "Authorization": token
      }
    );

    setCurrentIndex(undefined);
    toggleCofirm();
  }

  return (
    team && user ? (
      <div
      className="bg-background text-text h-screen grid grid-cols-[auto_1fr]"
      onClick={() => {
        setMenuIndex(undefined);
      }}>
        <SnackBar
        ref={snackbar} />
        <TeamSidebar
        user={user}
        team={team} />

        {/* Confirm menu */}
        {
          currentIndex !== undefined && tickets && tickets[currentIndex] && 
          <div
          className="w-screen h-screen hidden items-center justify-center fixed top-0 left-0 backdrop-blur backdrop-brightness-75 z-8 animate-fade-in-up animate-duration-300"
          ref={confirmMenu}
          onClick={() => {
            toggleCofirm();
          }}>
            <section
            className="rounded-sm bg-neutral-950 border border-neutral-900 py-6 px-3 w-150 text-center h-50 flex flex-col items-center justify-center">
              <p
              className="text-xl">
                Are you shure to you want to delete the ticket titled <span className="font-bold"> "{tickets[currentIndex].title}"</span>?
              </p>
              <span
              className="w-50 rounded-md flex items-center justify-center gap-1 text-xs bg-red-600/10 border border-red-600 text-red-400 p-2 my-3">
                <IconInfoCircle size={15} />
                This action is not reversible!
              </span>

              <div
              className="grid grid-cols-2 gap-4 w-full mt-2 px-4">
                <AltButton
                size="w-full">
                  Cancel
                </AltButton>
                <HazardButton
                size="w-full"
                action={async() => await handleDelete()}>
                  Delete
                </HazardButton>
              </div>
            </section>
          </div>
        }

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
            <label
            className="w-full text-start text-sm mb-1">
              Ticket made for <span className="text-red-600"> * </span>
            </label>
            <button
            type="button"
            onClick={() => setIsSelOpen(prev => prev ? false : true)}
            className={"w-full rounded-md relative py-2 px-3 duration-400 text-sm bg-neutral-800 mb-2 flex items-center justify-between cursor-pointer outline-none " + (isSelOpen ? "rounded-b-none" : "hover:brightness-80")}>
              { team.integrants[currIntIndex].username }

              <IconAssembly
              size={14}
              stroke={2} />

              {
                isSelOpen &&
                <section
                className="absolute top-1/1 py-2 bg-neutral-900 border border-neutral-800 w-full rounded-b-md left-0 flex flex-col text-xs">
                  {
                    team.integrants.map((int, ind) =>
                      <div
                      key={int.id}
                      className="w-full hover:backdrop-brightness-80 py-1 px-3 text-start flex items-center justify-between"
                      onClick={() => setCurrIntIndex(ind)}>
                        <p>
                          { int.username } <br />
                          <span
                          className="opacity-70 font-light">
                            { int.email }
                          </span>
                        </p>

                        {
                          currIntIndex === ind &&
                          <IconCircleFilled
                          size={10}
                          className="mr-2 text-main" />
                        }
                      </div>
                    )
                  }
                </section>
              }
            </button>

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

                <IconAssembly
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
          currentIndex !== undefined && tickets && tickets[currentIndex] && (
            <div
            className="fixed backdrop-blur backdrop-brightness-60 top-0 left-0 w-screen h-screen overflow-x-hidden overflow-y-auto justify-center py-10 z-20 hidden animate-fade-in-up animate-duration-300"
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
                <label
                className="w-full text-start text-sm mb-1">
                  Ticket made for <span className="text-red-600"> * </span>
                </label>
                <button
                type="button"
                onClick={() => setIsSelOpen(prev => prev ? false : true)}
                className={"w-full rounded-md relative py-2 px-3 duration-400 text-sm bg-neutral-800 mb-2 flex items-center justify-between cursor-pointer outline-none " + (isSelOpen ? "rounded-b-none" : "hover:brightness-80")}>
                  { team.integrants[currIntIndex || 0].username }

                  <IconAssembly
                  size={14}
                  stroke={2} />

                  {
                    isSelOpen &&
                    <section
                    className="absolute top-1/1 py-2 bg-neutral-900 border border-neutral-800 w-full rounded-b-md left-0 flex flex-col text-xs">
                      {
                        team.integrants.map((int, ind) =>
                          <div
                          key={int.id}
                          className="w-full hover:backdrop-brightness-80 py-1 px-3 text-start flex items-center justify-between"
                          onClick={() => setCurrIntIndex(ind)}>
                            <p>
                              { int.username } <br />
                              <span
                              className="opacity-70 font-light">
                                { int.email }
                              </span>
                            </p>

                            {
                              currIntIndex === ind &&
                              <IconCircleFilled
                              size={10}
                              className="mr-2 text-main" />
                            }
                          </div>
                        )
                      }
                    </section>
                  }
                </button>

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

                    <IconAssembly
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
          className="flex flex-col items-center justify-center">
            {/* Tickets cards */}
            {
              team.tickets && team.tickets.length > 0 ?
              (
                <section
                className="gap-5 grid grid-rows md:grid-cols-2 xl:grid-cols-3 h-full p-10">
                  {
                    team.tickets.map((ticket, index) =>
                      <TicketCard
                      setMenu={setCurrentMenu}
                      content={ticket}
                      userId={user.id}
                      teamId={params.id}
                      index={index}
                      setMenuIndex={setMenuIndex}
                      menuIndex={menuIndex}
                      router={router}
                      key={index}
                      editAction={() => {
                        setCurrentIndex(index);
                        setMenuIndex(undefined);
                        setCurrentMenu("edit");
                        return;
                      }}
                      deleteAction={() => {
                        setCurrentIndex(index);
                        setMenuIndex(undefined);
                        setCurrentMenu("delete");
                        return;
                      }} />
                    )
                  }
                </section>
              ) : (
                <div
                className="flex flex-col text-neutral-200 justfiy-start items-center py-10 w-full z-2 h-full">
                  <section
                  className="w-150 text-sm p-4 rounded-md bg-neutral-950 mt-10 flex flex-col gap-2 items-start justify-center select-none">
                    <p
                    className="text-transparent bg-neutral-900 p-0.5 rounded-md text-sm">
                      Lorem, ipsum dolor sit amet
                    </p>
                    <p
                    className="text-transparent bg-neutral-900 p-0.5 rounded-md text-sm">
                      Lorem, ipsum dolor sit amet consectetur adipisicing
                    </p>
                    <p
                    className="text-transparent bg-neutral-900 p-0.5 rounded-md text-sm">
                      Lorem, ipsum dolor sit amet consectetur adipisicing
                    </p>
                    <p
                    className="text-transparent bg-neutral-900 p-0.5 rounded-md text-sm">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum, sit totam placeat asperiores pariatur consequuntur? Quae voluptatum vitae provident quibusdam totam eos temporibus facilis similique! Nam nobis illum dolores nihil?
                    </p>

                    
                    <p
                    className="text-transparent bg-neutral-900 p-2 rounded-md text-sm mt-3 w-full">
                      Lorem
                    </p>
                  </section>

                  <p
                  className="font-medium tracking-wide mt-3 text-2xl">
                    Track the project issues
                  </p>
                  <p
                  className="opacity-80 w-130 text-center mt-1">
                    Start tracking project issues using Issue tracker provided by Prismaflow creating a new issue and setting it for your teammates
                  </p>

                  <MainButton
                  size="w-60"
                  className="mt-4"
                  action={toggleForm}>
                    + Create a new issue
                  </MainButton>
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