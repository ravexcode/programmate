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
import ReactMarkdown from "@/components/ui/react-markdown";

//Icons imports
import {
  IconArrowLeft,
  IconPencil,
  IconTrash,
} from "@tabler/icons-react";

//Types setup
import type { UserData } from "@/types/user.types";
import type { Ticket } from "@/types/team.types";
import CreatorForm from "@/components/forms/creator-form";
import CreatorInput from "@/components/forms/creator-inputs";
import OptionsInput from "@/components/forms/options-input";

//Client imports
import {
  loadTicketPage,
  editTicket,
  removeTicket,
  getImportanceColor,
  IMPORTANCE_OPTIONS,
} from "@/client/projects/ticket";
import { toggleOverlay } from "@/client/projects/shared";

export default function TicketPage(){
  //Next setup
  const router = useRouter();
  const params = useParams();

  //Data states
  const [ user, setUser ] = useState<UserData>();
  const [ ticket, setTicket ] = useState<Ticket>();

  //Editor form states
  const [ loading, setLoading ] = useState(false);
  const [ importance, setImportance ] = useState("");
  const [ ticketPrev, setTicketPrev ] = useState<Ticket>();

  //Components ref
  const snackbar = useRef(null);
  const form = useRef(null)

  //Data fetching
  useEffect(() => {
    async function get() {
      const data = await loadTicketPage(
        Number(params.id),
        Number(params.index),
        router,
        snackbar
      );

      if(!data) return;

      setUser(data.user);
      setTicket(data.ticket);
      setTicketPrev(data.ticket);
      setImportance(data.ticket.importance);
    }

    get();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    user && ticket ? (
      <div
      className="h-screen text-zinc-50">
        <SnackBar
        ref={snackbar} />

        <div
        className="w-screen h-screen backdrop-blur backdrop-brightness-75 z-10 fixed top-0 left-0 hidden p-10 justify-center animate-fade-in-up"
        ref={form} >
          <CreatorForm
          action={async (e) => {
            e.preventDefault();

            setLoading(true);
            await editTicket(
              Number(params.id),
              Number(params.index),
              ticket,
              importance,
              router,
              snackbar
            );
            setLoading(false);
          }}
          title="Edit your ticket"
          bgColor="bg-neutral-950"
          actionIsDisabled={loading || !ticket.title || !ticket.message || !ticketPrev || (ticketPrev.title === ticket.title && ticketPrev.message === ticket.message && ticketPrev.importance === importance)}
          confirmMessage="Edit" >

            <CreatorInput
            value={ticket.title}
            label="Ticket name"
            onChange={(e) => {
              setTicket(
                prev =>
                  prev ?
                  {
                    ...prev,
                    title: e.target.value
                  }
                  : ticket
              )
            }}
            required
            bgColor="bg-neutral-900" />

            <CreatorInput
            value={ticket.message}
            label="Ticket message"
            onChange={(e) => {
              setTicket(
                prev =>
                  prev ?
                  {
                    ...prev,
                    message: e.target.value
                  }
                  : ticket
              )
            }}
            required
            bgColor="bg-neutral-900"
            type="textarea" />

            <OptionsInput
            label="Set importance"
            value={importance}
            options={IMPORTANCE_OPTIONS}
            onChange={setImportance}
            bgColor="bg-neutral-900" />

            <span className="block w-full h-6" />

          </CreatorForm>
        </div>

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
                    className={"aspect-square rounded-full w-2 h-2 block " + getImportanceColor(ticket.importance)}></span>
                    Importance: {ticket.importance.toLowerCase()}
                  </p>
                </div>
              </div>

              {/* Metadata Section */}
              <div className="flex justify-center items-center gap-4 py-6 border-t border-neutral-800 cursor-default w-full"
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

                <div
                className="grid grid-cols-2 gap-5 p-2 w-70 ml-auto">
                  <button
                  type="button"
                  className="p-2 w-full rounded-sm bg-main hover:brightness-75 duration-300 flex items-center justify-center gap-1.5 cursor-pointer"
                  onClick={() => toggleOverlay(form)}>
                    <IconPencil
                    size={18}
                    stroke={1.5} />
                    Edit
                  </button>

                  <button
                  type="button"
                  className="p-2 w-full rounded-sm bg-red-600 hover:brightness-75 duration-300 flex items-center justify-center gap-1.5 cursor-pointer"
                  onClick={async() => {
                    await removeTicket(
                      Number(params.id),
                      Number(params.index),
                      router,
                      snackbar
                    );

                    return router.push(`/projects/${params.id}/tickets`);
                  }}>
                    <IconTrash
                    size={18}
                    stroke={1.5} />
                    Delete
                  </button>
                </div>
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
