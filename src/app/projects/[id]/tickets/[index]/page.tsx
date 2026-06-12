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
        className="w-full h-max min-h-screen bg-background relative animate-fade-in overflow-y-auto z-1">
          <div className="pointer-events-none absolute inset-0 -z-1 overflow-hidden">
            <div className="absolute left-1/2 top-1/2 aspect-square block w-200 -translate-x-1/2 -translate-y-1/2 rounded-full bg-main/15 blur-3xl animate-pulse" />
          </div>
          
          <div className="p-8 md:p-12 max-w-5xl mx-auto z-2">
            {/* Back Button */}
            <Link
            href={`/projects/${params.id}/tickets`}
            className="inline-flex items-center gap-2 mb-8 px-3 py-2 rounded-lg hover:bg-neutral-900 transition-colors duration-200">
              <IconArrowLeft
              size={15} />
              <span className="text-sm font-medium">
                Go back
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
                  <p
                  className="flex gap-2 items-center">
                    <span
                    className="aspect-square rounded-full w-2 h-2 block"
                    style={{
                      backgroundColor: (
                        ticket.importance === "Low" ? "blue" :
                        ticket.importance === "Medium" ? "orange" :
                        "red"
                      )
                    }}></span>
                    Importance: {ticket.importance.toLowerCase()}
                  </p>
                </div>
              </div>

              {/* Metadata Section */}
              <div className="flex justify-center items-center gap-4 py-6 border-t border-neutral-800">
                <p
                className="border-r-2 border-neutral-600 pr-4">
                  Made by <span className="text-sky-500"> {ticket.creator} </span>
                </p>
                <p
                className="border-r-2 border-neutral-600 pr-4">
                  For <span className="text-sky-500"> {ticket.to} </span>
                </p>
                <p>
                  At <span className="text-sky-500"> {(new Date(ticket.created_at!)).toDateString()} </span>
                </p>
              </div>
            </header>

            {/* Content Section */}
            <section className="rounded-md border border-neutral-800 bg-neutral-950 p-3 z-5 duration-300 hover:border-main">
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