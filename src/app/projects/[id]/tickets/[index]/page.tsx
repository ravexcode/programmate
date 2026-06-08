//Client side
"use client";

//Next imports
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";

//React imports
import { useState, useRef, useEffect } from "react";

//Prebuilt ui imports
import SideBar, { Icon } from "@/components/ui/sidebar";
import SnackBar from "@/components/ui/snackbar";
import BgGradient from "@/components/ui/bg-gradient";
import LoadingScreen from "@/components/screens/loading-screen";
import ReactMarkdown from "@lib/components/react-markdown";

//Hooks imports
import { useGetToken, useDeleteToken } from "@/hooks/useCookies";
import { getCached } from "@/hooks/cache.hook";

//Services imports
import UpdateUserData from "@/services/user.service";
import getTicket from "@/services/ticket.service";

//Icons imports
import {
  IconAppWindow,
  IconArrowLeft,
  IconCalendar,
  IconCircleFilled,
  IconDatabase,
  IconEye,
  IconFolder,
  IconLayoutKanban,
  IconMessage,
  IconUsers,
  IconTrash,
  IconPencil,
  IconClock,
  IconUser,
  IconSettings
} from "@tabler/icons-react";

//Types setup
//Imports
import { UserData } from "@/types/user.types";
import { Ticket } from "@/types/team.types";

export default function TicketPage(){
  //Next setup
  const router = useRouter();
  const params = useParams();

  //Data states
  const [ user, setUser ] = useState<UserData>();
  const [ ticket, setTicket ] = useState<Ticket>();
  
  //Sidebar states
  const [ expanded, setExpanded ] = useState(false);

  //Components ref
  const snackbar = useRef(null);

  //Set expanded based in localstorage
  useEffect(() => {
    const expanded = window.localStorage.getItem("expanded");

    if(expanded) return setExpanded(true);

    return;
  }, []);

  //Data fetching
  useEffect(() => {
    async function get() {
      const token = useGetToken();

      if(!token) return router.push("/auth/login");

      let user_data: UserData;

      const cached = getCached();

      if(cached) {
        user_data = cached
      } else {
        const user_fetched = await UpdateUserData(token);

        if(!user_fetched) {
          useDeleteToken();
          window.localStorage.clear();
          return;
        }

        user_data = user_fetched
      }

      setUser(user_data);

      const ticket_got = await getTicket(
        Number(params.id),
        Number(params.index),
        token,
        snackbar
      );

      setTicket(ticket_got)
    }

    get();
  }, []);

  //Format date helper function
  const formatDate = (date: string | undefined) => {
    if (!date) return "Not specified";
    const d = new Date(date);
    return d.toLocaleDateString("en-US", { 
      year: "numeric", 
      month: "short", 
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    user && ticket ? (
      <div
      className="h-screen grid grid-cols-[auto_1fr] text-zinc-50">
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
          action={`/projects/${params.id}/integrants`}
          name="Integrants"
          isDisplayed={expanded}>
            <IconUsers
            size={23}
            stroke={2}
            color="white"/>
          </Icon>

          <Icon
          action={`/projects/${params.id}/tickets`}
          name="Tickets"
          isDisplayed={expanded}>
            <IconFolder
            size={23}
            stroke={2}
            color="white"/>
          </Icon>

          <Icon
          action={`/projects/${params.id}/erd`}
          name="ERD Creator"
          isDisplayed={expanded}
          disabled={ user?.plan === "Free" }>
            <IconDatabase
            size={23}
            stroke={2}
            color="white"/>
          </Icon>

          <Icon
          action={`/projects/${params.id}/chat`}
          name="Chat"
          isDisplayed={expanded}
          disabled={ user?.plan === "Free" }>
            <IconMessage
            size={23}
            stroke={2}
            color="white"/>
          </Icon>

          <Icon
          action={`/projects/${params.id}/json-preview`}
          name="JSON Preview"
          isDisplayed={expanded}
          disabled={ user?.plan === "Free" }>
            <IconEye
            size={23}
            stroke={2}
            color="white"/>
          </Icon>

          <Icon
          action={`/projects/${params.id}/kanban-board`}
          name="Kanban board"
          isDisplayed={expanded}
          disabled={ user?.plan === "Free" }>
            <IconLayoutKanban
            size={23}
            stroke={2}
            color="white"/>
          </Icon>

          <Icon
          action={`/projects/${params.id}/calendar`}
          name="Calendar"
          isDisplayed={expanded}
          disabled={ user?.plan === "Free" }>
            <IconCalendar
            size={23}
            stroke={2}
            color="white"/>
          </Icon>

          <Icon
          action={`/projects/${params.id}/settings`}
          name="Project settings"
          isDisplayed={expanded}>
            <IconSettings
            size={23}
            stroke={2}
            color="white"/>
          </Icon>
        </SideBar>

        <main
        className="w-full h-max min-h-screen bg-background relative animate-fade-in overflow-y-auto">
          <BgGradient />
          
          <div className="p-8 md:p-12 max-w-5xl mx-auto">
            {/* Back Button */}
            <Link
            href={`/projects/${params.id}/tickets`}
            className="inline-flex items-center gap-2 mb-8 px-3 py-2 rounded-lg hover:bg-neutral-900 transition-colors duration-200">
              <IconArrowLeft
              size={20}
              stroke={2.5}
              color="#1A43BF" />
              <span className="text-sm font-medium text-neutral-400 hover:text-neutral-200">
                Back to Tickets
              </span>
            </Link>

            {/* Header Section */}
            <header className="mb-8 z-10 relative">
              {/* Title and Importance */}
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                <div className="flex-1">
                  <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                    {ticket.title}
                  </h1>
                  
                  {/* Importance Badge */}
                  <div className="flex items-center gap-3">
                    <div 
                    className={`px-3 py-1.5 rounded-full flex items-center gap-2 font-semibold text-sm ${
                      ticket.importance === "Low" ? "bg-blue-500/20 text-blue-300 border border-blue-500/50" :
                      ticket.importance === "Medium" ? "bg-orange-500/20 text-orange-300 border border-orange-500/50" : 
                      "bg-red-500/20 text-red-300 border border-red-500/50"
                    }`}>
                      <IconCircleFilled
                      size={8}
                      fill="currentColor"
                      stroke={0}
                      color={
                        ticket.importance === "Low" ? "#93c5fd" :
                        ticket.importance === "Medium" ? "#fed7aa" : "#fca5a5"
                      } />
                      <span>{ticket.importance} Priority</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Metadata Section */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-6 border-t border-neutral-800">
                {/* Creator */}
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/30">
                    <IconUser size={20} className="text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                      Created By
                    </p>
                    <p className="text-sm font-medium text-neutral-200 mt-1">
                      {ticket.creator || "Unknown"}
                    </p>
                  </div>
                </div>

                {/* Assigned To */}
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/30">
                    <IconUsers size={20} className="text-purple-400" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                      Assigned To
                    </p>
                    <p className="text-sm font-medium text-neutral-200 mt-1">
                      {ticket.to || "Unassigned"}
                    </p>
                  </div>
                </div>

                {/* Created Date */}
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                    <IconClock size={20} className="text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                      Created
                    </p>
                    <p className="text-sm font-medium text-neutral-200 mt-1">
                      {formatDate(ticket.created_at)}
                    </p>
                  </div>
                </div>
              </div>
            </header>

            {/* Content Section */}
            <section className="rounded-xl border border-neutral-800 bg-neutral-950/50 backdrop-blur-sm p-6 md:p-8 hover:border-neutral-700 transition-colors duration-200">
              <h2 className="text-lg font-semibold text-neutral-200 mb-4">Description</h2>
              <div className="prose prose-invert max-w-none text-neutral-300 prose-a:text-main hover:prose-a:underline">
                <ReactMarkdown
                content={ticket.message} />
              </div>
            </section>
          </div>
        </main>
        
      </div>
    ) : (
      <LoadingScreen />
    )
  )
}