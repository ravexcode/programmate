//Client side
"use client";

import { useState, useEffect, useRef, RefObject } from "react";
import { useParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { 
  IconArrowLeft, 
  IconEdit, 
  IconTrash, 
  IconDeviceFloppy, 
  IconX, 
  IconTicket 
} from "@tabler/icons-react";
import { getCookie } from "cookies-next/client";
import { searchTeamData } from "../../page";
import CreatorForm from "@/components/forms/creatorForm";
import SnackBar, { type SnackbarRef } from "@/components/ui/snackbar";

export default function TicketView() {
  const params = useParams();
  const ticketIndex = parseInt(params.index as string);

  const [user, setUser] = useState<any>();
  const [team, setTeam] = useState<any>();
  const [isEditing, setIsEditing] = useState(false);
  const [ formDisabled, setFormDisabled ] = useState<boolean>(false);
  
  const [formData, setFormData] = useState({
    to: "",
    description: ""
  });

  const snackbar = useRef<SnackbarRef>(null);
  const containerRef : RefObject<null> = useRef(null);

  const hideConfirmation = () => {
    if(!containerRef.current) return;

    const current : HTMLElement = containerRef.current;

    current.classList.add("hidden")
  };

  const showConfirmation = () => {
    if(!containerRef.current) return;

    const current : HTMLElement = containerRef.current;

    current.classList.remove("hidden");
  };

  useEffect(() => {
    const cached = window.localStorage.getItem("user");
    if (!cached) window.location.href = "/auth/login";
    
    const parsed = JSON.parse(cached!);
    setUser(parsed);
 
    searchTeamData(
      snackbar,
      params,
      setTeam
    );
  }, []);

  const fetchTeamData = async () => {
    const token = await getCookie("token");

    try {
      const res = await fetch(`/api/teams/${params.id}/tickets/`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          "Authorization": token!,
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY!
        }
      });

      const data = await res.json();
      setTeam({ ...team, tickets: data });
      
      const currentTicket = data[ticketIndex];
      if (currentTicket) {
        setFormData({
          to: currentTicket.to || "",
          description: currentTicket.message || ""
        });
      }
    } catch (error) {
      console.error("Error fetching tickets", error);
    }
  };

  const handleUpdate = async () => {
    try {
      // await fetch(`/api/teams/${params.team_id}/tickets/`, { method: "PUT", body: JSON.stringify({ index: ticketIndex, ...formData }) })
      setIsEditing(false);
    } catch (error) {
    }
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

  // Validaciones de carga
  if (!team || !team.tickets) return <div className="text-neutral-500 p-10 text-center">Cargando...</div>;
  
  const ticket = team.tickets[ticketIndex];
  if (!ticket) return <div className="text-neutral-500 p-10 text-center">Ticket no encontrado</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <SnackBar ref={snackbar} />

      <div
      ref={containerRef}
      className="fixed w-screen h-screen flex justify-center items-center z-10 backdrop-blur backdrop-brightness-70 top-0 left-0 animate-fade-in hidden">
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
            className="p-2 hover:bg-neutral-800 rounded-full transition-colors text-neutral-400 hover:text-white"
          >
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
              <button onClick={showConfirmation} className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors">
                <IconTrash size={20} />
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setIsEditing(false)} className="p-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg transition-colors">
                <IconX size={20} />
              </button>
              <button onClick={handleUpdate} className="p-2 bg-green-500/10 hover:bg-green-500/20 text-green-500 rounded-lg transition-colors">
                <IconDeviceFloppy size={20} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Contenido del Ticket */}
      <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6 shadow-sm">
        <div className="grid grid-cols-2 gap-6 mb-8 border-b border-neutral-800 pb-6">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-neutral-500 uppercase tracking-wider">Made by</span>
            <span className="text-base font-semibold text-neutral-200">{ticket.creator}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-neutral-500 uppercase tracking-wider">Asigned to</span>
            {!isEditing ? (
              <span className="text-base font-medium text-neutral-300 italic">{ticket.to}</span>
            ) : (
              <input
                type="text"
                value={formData.to}
                onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                className="bg-neutral-950 border border-neutral-700 text-neutral-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-none"
              />
            )}
          </div>
        </div>

        {/* Sección de Descripción / Markdown */}
        <div className="flex flex-col gap-2">
          <span className="text-xs text-neutral-500 uppercase tracking-wider"> Problem description </span>
          {!isEditing ? (
            <div className="prose prose-invert max-w-none text-neutral-300 bg-neutral-950/30 p-4 rounded-lg border border-neutral-800/50">
              <ReactMarkdown>
                {ticket.message || "*There's no content in your ticket*"}
              </ReactMarkdown>
            </div>
          ) : (
            <textarea
              rows={8}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-neutral-950 border border-neutral-700 text-neutral-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 outline-none resize-y"
              placeholder="Escribe la descripción usando Markdown..."
            />
          )}
        </div>
      </div>
    </div>
  );
}