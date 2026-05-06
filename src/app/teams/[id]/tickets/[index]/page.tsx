//Client side
"use client";

//React imports
import { useState, useEffect, useRef, RefObject } from "react";
import ReactMarkdown from "react-markdown";

//Next imports
import { useParams } from "next/navigation";
import { getCookie } from "cookies-next/client";

//Prebuild ui imports
import CreatorForm from "@/components/forms/creatorForm";
import SnackBar, { type SnackbarRef } from "@/components/ui/snackbar";

//Icons imports
import { 
  IconArrowLeft, 
  IconEdit, 
  IconTrash, 
  IconDeviceFloppy, 
  IconX, 
  IconTicket 
} from "@tabler/icons-react";

//Services imports
import { searchTeamData } from "@/app/teams/[id]/page";
import Team, { Ticket } from "@/types/team.types";
import LoadingDashboard from "@/components/screens/loading_dashboard";

export default function TicketView() {
  //Params data
  const params = useParams();
  const ticketIndex = parseInt(params.index as string);

  //States handlers
  //Team data
  const [team, setTeam] = useState<Team>();
  //Ticket data
  const [ ticket, setTicket ] = useState<Ticket | null>();
  //Editing values
  //Editing loading state
  const [ isLoading, setIsLoading ] = useState(false);
  //Editing or not state
  const [isEditing, setIsEditing] = useState(false);
  //Ticket made for
  const [ ticketTo, setTicketTo ] = useState<string>("");
  //Ticket message
  const [ ticketMessage, setTicketMessage ] = useState<string>("");
  //Ticket importance
  const [importance, setImportance] = useState<"Low" | "Medium" | "High">("Low");
  //Confirmation enabled/disabled state
  const [ formDisabled, setFormDisabled ] = useState<boolean>(false);

  const snackbar = useRef<SnackbarRef>(null);
  const containerRef : RefObject<null> = useRef(null);

  const hideConfirmation = () => {
    if(!containerRef.current) return;

    const current : HTMLElement = containerRef.current;

    current.classList.add("hidden")
    current.classList.remove("flex")
  };

  const showConfirmation = () => {
    if(!containerRef.current) return;

    const current : HTMLElement = containerRef.current;

    current.classList.remove("hidden");
    current.classList.add("flex");
  };

  useEffect(() => {
    const getTeamData = async() => {
      const team = await searchTeamData(
        snackbar,
        params,
        setTeam
      );

      setTicket(team?.tickets[ticketIndex]);
      setTicketTo(team?.tickets[ticketIndex].to);
      setTicketMessage(team?.tickets[ticketIndex].message);
    }

    getTeamData()
  }, []);

  const handleUpdate = async () => {
    setIsLoading(true);
    const token = await getCookie("token");

    if(!token) window.location.href = "/auth/login";

    const updatedTicket = {
      to: ticketTo,
      message: ticketMessage,
      importance: importance,
      ticketIndex: params.index,
    }

    const res = await fetch(`/api/teams/${params.id}/tickets`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token!,
        "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
      },
      body: JSON.stringify(updatedTicket)
    });

    const data = await res.json();

    if(res.status === 200) {
      setTicket(data.ticket);
      setTicketMessage(data.ticket.message);
      setTicketTo(data.ticket.to);
      setImportance(data.ticket.importance);
      setIsLoading(false);
      setIsEditing(false);
      return;
    }

    snackbar.current?.showSnackBar(data.message, true);
    setIsLoading(false);
    return;
  };

  const handleDelete = async (e: React.SubmitEvent) => {
    setFormDisabled(true);

    e.preventDefault();

    const token = await getCookie("token")

    const res = await fetch(`/api/teams/${params.id}/tickets/${params.index}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token!,
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY!
        },
        body: JSON.stringify({ index: ticketIndex })
      }
    );

    const data = await res.json();

    if(res.status === 200) {
      window.location.href = `/teams/${params.id}`;
    }

    snackbar.current?.showSnackBar(data.message, true);
    setFormDisabled(true);
  };

  return (
    team ? ( <div className="max-w-3xl mx-auto p-6 space-y-6">
        <SnackBar ref={snackbar} />

        <div
        ref={containerRef}
        className="fixed w-screen h-screen justify-center items-center z-10 backdrop-blur backdrop-brightness-70 top-0 left-0 animate-fade-in hidden">
          <CreatorForm
          title="Are you sure to delete this ticket?"
          action={(e) => { handleDelete(e) }}
          hideAction={hideConfirmation}
          confirmMessage="Delete"
          isDangerous
          actionIsDisabled={formDisabled}/>
        </div>

        {/* Header con botón de regreso y acciones */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => window.location.href = `/teams/${params.id}/tickets`}
              className="p-2 hover:bg-neutral-800 rounded-full transition-colors text-neutral-400 hover:text-white cursor-pointer">
              <IconArrowLeft size={24} />
            </button>
            <div className="flex items-center gap-3">
              <div className="bg-main/10 p-2 rounded-lg">
                <IconTicket size={24} color="blue" />
              </div>
              <h1 className="text-xl font-bold text-neutral-200 uppercase tracking-wider">
                Ticket #{ticketIndex + 1}
              </h1>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="flex items-center gap-2">
            {!isEditing ? (
              <>
                <button onClick={() => setIsEditing(true)} className="p-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg transition-colors">
                  <IconEdit size={20} />
                </button>
                <button onClick={showConfirmation} className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors cursor-pointer">
                  <IconTrash size={20} />
                </button>
              </>
            ) : (
              <>
                <button onClick={() => setIsEditing(false)} className="p-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg transition-colors">
                  <IconX size={20} />
                </button>
                <button
                onClick={handleUpdate}
                className="p-2 bg-green-500/10 hover:bg-green-500/20 cursor-pointer text-green-500 rounded-lg transition-colors disabled:hover:bg-green-500-10 disabled:grayscale disabled:cursor-wait"
                disabled={isLoading}>
                  <IconDeviceFloppy size={20} />
                </button>
              </>
            )}
          </div>
        </div>

        <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6 shadow-sm">
          <div className="grid grid-cols-2 gap-6 mb-8 border-b border-neutral-800 pb-6">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-neutral-500 uppercase tracking-wider">Made by</span>
              <span className="text-base font-semibold text-neutral-200">{ticket?.creator}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-neutral-500 uppercase tracking-wider">Asigned to</span>
              {!isEditing ? (
                <span className="text-base font-medium text-neutral-300 italic">{ticket?.to}</span>
              ) : (
                <input
                  type="text"
                  value={ticketTo}
                  onChange={(e) => setTicketTo(e.target.value)}
                  className="bg-neutral-950 border border-neutral-700 text-neutral-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-none"
                />
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-xs text-neutral-500 uppercase tracking-wider"> Problem description </span>
            {!isEditing ? (
              <div className="prose prose-invert max-w-none text-neutral-300 bg-neutral-950/30 p-4 rounded-lg border border-neutral-800/50">
                <ReactMarkdown>
                  {ticket?.message || "*There's no content in your ticket*"}
                </ReactMarkdown>
              </div>
            ) : (
              <textarea
                rows={8}
                value={ticketMessage}
                onChange={(e) => setTicketMessage(e.target.value)}
                className="bg-neutral-950 border border-neutral-700 text-neutral-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 outline-none resize-y"
                placeholder="Escribe la descripción usando Markdown..."
              />
            )}
          </div>
        </div>
      </div>
    ) : (
      <LoadingDashboard />
    )
  );
}