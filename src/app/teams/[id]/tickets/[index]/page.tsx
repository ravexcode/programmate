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
  IconUsers
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
  }, [])

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
          action={`/teams/${params.id}`}
          name="Team dashboard"
          isDisplayed={expanded}>
            <IconAppWindow
            size={23}
            stroke={2}
            color="white"/>
          </Icon>

          <Icon
          action={`/teams/${params.id}/integrants`}
          name="Integrants"
          isDisplayed={expanded}>
            <IconUsers
            size={23}
            stroke={2}
            color="white"/>
          </Icon>

          <Icon
          action={`/teams/${params.id}/tickets`}
          name="Tickets"
          isDisplayed={expanded}>
            <IconFolder
            size={23}
            stroke={2}
            color="white"/>
          </Icon>

          <Icon
          action={`/teams/${params.id}/erd`}
          name="ERD Creator"
          isDisplayed={expanded}
          disabled={ user?.plan === "Free" }>
            <IconDatabase
            size={23}
            stroke={2}
            color="white"/>
          </Icon>

          <Icon
          action={`/teams/${params.id}/chat`}
          name="Chat"
          isDisplayed={expanded}
          disabled={ user?.plan === "Free" }>
            <IconMessage
            size={23}
            stroke={2}
            color="white"/>
          </Icon>

          <Icon
          action={`/teams/${params.id}/json-preview`}
          name="JSON Preview"
          isDisplayed={expanded}
          disabled={ user?.plan === "Free" }>
            <IconEye
            size={23}
            stroke={2}
            color="white"/>
          </Icon>

          <Icon
          action={`/teams/${params.id}/kanban-board`}
          name="Kanban board"
          isDisplayed={expanded}
          disabled={ user?.plan === "Free" }>
            <IconLayoutKanban
            size={23}
            stroke={2}
            color="white"/>
          </Icon>

          <Icon
          action={`/teams/${params.id}/calendar`}
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
        className="w-full h-max min-h-screen bg-background relative p-10 flex flex-col gap-5 animate-fade-in">
          <BgGradient />

          <header
          className="w-full z-2 flex flex-col">
            <div
            className="flex gap-3 items-center">
              <Link
              href={`/teams/${params.id}/tickets`}
              className="p-2 rounded-full hover:bg-neutral-800">
                <IconArrowLeft
                size={25}
                stroke={3}
                color="white" />
              </Link>
              <p
              className="text-3xl font-medium tracking-wide">
                {ticket.title}
              </p>
            </div>
            <div
            className="flex gap-2 items-center py-1">
              <IconCircleFilled
              size={10}
              color={
                ticket.importance === "Low" ? "blue" :
                ticket.importance === "Medium" ? "orange" : "red"
              } />
              <p>
                Importance: {ticket.importance.toLowerCase()}
              </p>
            </div>
          </header>

          <section
          className="w-full p-4 rounded-md bg-neutral-900 z-2">
            <ReactMarkdown
            content={ticket.message} />
          </section>
        </main>
        
      </div>
    ) : (
      <LoadingScreen />
    )
  )
}