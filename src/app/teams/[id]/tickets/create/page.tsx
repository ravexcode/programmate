//Client side
"use client"

//React imports
import { useParams, useRouter } from "next/navigation";
import { getCookie } from "cookies-next/client";
import { useRef, useState } from "react";

//Types imports
import SnackBar, { type SnackbarRef } from "@/components/ui/snackbar";

//Prebuilt components
import LoadingDashboard from "@/components/screens/loading_dashboard";

//Icons imports
import CreatorForm from "@/components/forms/creatorForm";
import CreatorInput from "@/components/forms/creatorInputs";
import User from "@/modules/user.types";

export default function CreateTicketPage() {
  //URL id
  const params = useParams();
  const router = useRouter();

  //States handler
  const [loading, setLoading] = useState(false);
  const [to, setTo] = useState("");
  const [message, setMessage] = useState("");
  const [importance, setImportance] = useState("Low");
  // Estado para controlar si el dropdown está abierto
  const [isImportantOpen, setIsImportantOpen] = useState(false);

  //Snackbar container
  const snackbar = useRef<SnackbarRef>(null);

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

      //Gets user cached data
      const user : User = JSON.parse(window.localStorage.getItem("user")!);

      //Makes the API call to create ticket
      const res = await fetch(`/api/teams/${params.id}/tickets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token,
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY!
        },
        body: JSON.stringify({
          creator: user.email,
          to,
          message,
          importance
        })
      });

      //Process the data from response
      const data = await res.json();

      //Verifies status
      if (res.status === 200) {
        snackbar.current?.showSnackBar("Ticket created successfully!", false);
        //Redirect to tickets page after 1.5 seconds
        setTimeout(() => {
          router.push(`/teams/${params.id}/tickets`);
        }, 1500);
        return;
      }

      //If there's an error shows it
      snackbar.current?.showSnackBar(data.message, true);
    } catch (error: any) {
      snackbar.current?.showSnackBar("An error occurred", true);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const importanceOptions = [
    { value: "Low", label: "Low", color: "bg-blue-500" },
    { value: "Medium", label: "Medium", color: "bg-orange-500" },
    { value: "High", label: "High", color: "bg-red-500" },
  ];

  return (
    <div className="w-full flex flex-col justify-center items-center min-h-screen bg-neutral-950 text-white p-6">
      <SnackBar ref={snackbar} />
      {loading && <LoadingDashboard />}

      <CreatorForm
      title="Create a new ticket"
      action={handleSubmit}
      hideAction={() => { window.location.href = `/teams/${params.id}/tickets` }}
      actionIsDisabled={false}>
        <CreatorInput
        value={to}
        label="Send to"
        placeholder="e.g. person@email.com"
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
            className={"w-full flex items-center justify-between bg-neutral-800 border-2 duration-400 hover:brightness-80 rounded-lg px-4 py-2 text-white duration-200 group" + (isImportantOpen ? " border-main" : " border-transparent")}>
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
                        setImportance(option.value);
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
  );
}