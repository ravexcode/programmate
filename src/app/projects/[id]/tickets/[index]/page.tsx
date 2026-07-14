//Client side
"use client";

//Next imports
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";

//React imports
import { useState, useRef, useEffect } from "react";

//Prebuilt ui imports
import SnackBar from "@/components/ui/snackbar";
import LoadingScreen from "@/components/screens/loading-screen";
import ReactMarkdown from "@/lib/components/react-markdown";

//Hooks imports
import { getSessionStr, deleteSessionStr } from "@/services/session.service";
import { getCached } from "@/hooks/cache.hook";

//Services imports
import UpdateUserData from "@/services/user.service";
import getTicket from "@/services/ticket.service";

//Icons imports
import {
  IconAppWindow,
  IconArrowLeft,
  IconCalendar,
  IconDatabase,
  IconEye,
  IconFolder,
  IconLayoutKanban,
  IconMessage,
  IconUsers,
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
  
  //Components ref
  const snackbar = useRef(null);

  //Data fetching
  useEffect(() => {
    async function get() {
      const token = getSessionStr();

      if(!token) return router.push("/auth/signin");

      let user_data: UserData;

      const cached = getCached();

      if(cached) {
        user_data = cached
      } else {
        const user_fetched = await UpdateUserData(token);

        if(!user_fetched) {
          deleteSessionStr();
          window.localStorage.clear();
          return;
        }

        user_data = user_fetched
      }

      setUser(user_data);

      const ticket_got: Ticket = await getTicket(
        Number(params.id),
        Number(params.index),
        token,
        snackbar
      );

      if(!ticket_got) return router.push(`/projects/${params.id}/tickets`);

      setTicket(ticket_got);
    }

    get();
  }, []);

  return (
    user && ticket ? (
      <div
      className="h-screen text-zinc-50">
        <SnackBar
        ref={snackbar} />

        <main
        className="w-full h-max min-h-screen bg-background relative animate-fade-in overflow-y-auto z-1">
          <div className="pointer-events-none absolute inset-0 -z-1 overflow-hidden">
            <div className="absolute left-1/2 top-1/2 aspect-square block w-200 -translate-x-1/2 -translate-y-1/2 rounded-full bg-main/15 blur-3xl animate-pulse" />
          </div>
          
          <div className="p-8 md:p-12 max-w-5xl mx-auto z-2">
            {/* Back Button */}
            <Link
            href={`/projects/${params.id}/tickets`}
            className="inline-flex items-center gap-2 mb-8 px-3 py-2 rounded-lg hover:bg-neutral-800 transition-colors duration-200">
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
              <div className="flex justify-center items-center gap-4 py-6 border-t border-neutral-800 cursor-default"
              title={"Ticket: " + ticket.title + "\nCreated by: " + ticket.creator_id}>
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
            <p
            className="mb-2 text-lg font-medium tracking-wide px-2">
              Content
            </p>
            <section className="rounded-md border border-neutral-800 bg-neutral-950 p-3 z-5 duration-300 hover:border-neutral-600 cursor-default select-none">
              <ReactMarkdown
              content={ticket.message} />
            </section>
          </div>
        </main>
        
      </div>
    ) : (
      <LoadingScreen />
    )
  )
}