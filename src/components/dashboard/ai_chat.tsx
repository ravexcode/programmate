import { useState, useRef, RefObject } from "react";
import { getCookie, deleteCookie } from "cookies-next/client";
import ReactMarkdown from "react-markdown";

export default function AIChat(){
  interface User {
    id: string,
    email: string,
    username: string
  }
  
  //Ai chat type
  interface AIChat {
    sent_by: string,
    message: string
  }

  const [ user, setUser ] = useState({
    email: "",
    name: "",
    plan: "",
    teams: [{}] as Array<Object | null>,
    ai_chat: [{}] as Array<AIChat | null>
  });
  
  //Ai chat container
  const AIcontainer : RefObject<null> = useRef(null);
  //Ai button
  const AIbutton : RefObject<null> = useRef(null);
  
  const [ currentMessage, setCurrentMessage ] = useState<string | undefined>(undefined);const [isLoading, setIsLoading] = useState(false);

  const openAiForm = () => {
    if(!AIbutton.current || !AIcontainer.current) return;
    const button : HTMLButtonElement = AIbutton.current;
    const container : HTMLElement = AIcontainer.current;

    button.classList.add("hidden");
    container.classList.remove("hidden");
    return;
  }

  const closeAiForm = () => {
    if(!AIbutton.current || !AIcontainer.current) return;
    const button : HTMLButtonElement = AIbutton.current;
    const container : HTMLElement = AIcontainer.current;

    button.classList.remove("hidden");
    container.classList.add("hidden");

    return;
  }

  const submitMessage = async(e: any) => {
    e.preventDefault();
    if(!currentMessage || currentMessage.length < 1) return;
    const token = await getCookie("token");
    if(!token) {
      deleteCookie("token");
      window.location.href = "/auth/login";
    }

    const message_sent = currentMessage;

    // Actualizar estado con el mensaje del usuario inmediatamente
    setUser(prev => ({
      ...prev,
      ai_chat: [
        ...prev.ai_chat,
        {
          sent_by: "user",
          message: message_sent
        }
      ]
    }));

    // Limpiar el input
    setCurrentMessage("");

    const res = await fetch("/api/ai", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "x-api-key": process.env.NEXT_PUBLIC_API_KEY || "",
        "Authorization": token || "",
      },
      body: JSON.stringify({
        message: message_sent
      })
    });

    const data = await res.json();

    if(res.status === 200) {
      // Actualizar estado con la respuesta del AI
      setUser(prev => ({
        ...prev,
        ai_chat: [
          ...prev.ai_chat,
          {
            sent_by: "ai",
            message: data.result
          }
        ]
      }));

      return;
    } else {
      //Debug
      console.error("An error has happened.\nError: " + data);
    }
  }

  return (
    <>
      {/* button */}
      <button
      ref={AIbutton}
      className="fixed p-3 rounded-full bottom-4 right-4 border-x border-main shadow-lg shadow-main/20 cursor-pointer bg-neutral-950 z-3 duration-300 hover:scale-105 hover:-translate-y-1 hover:shadow-main/40 focus:outline-none"
      onClick={() => {
        openAiForm();
      }}>
        <img
        src="/icons/buttons/ai.svg"
        alt="Icon made by RavexCode"
        className="aspect-square w-5 block"/>
      </button>

      {/* AI section container */}
      <section
      ref={AIcontainer}
      className="hidden animate-fade-in-left fixed h-screen w-screen md:w-md z-10 top-0 right-0 md:px-4 md:py-3">

        <section
        className="bg-neutral-900 h-full px-4 pb-3 rounded-lg flex flex-col">
          <div
          className="px-4 py-4 flex justify-center items-center">
            <button
            className="text-sm ml-auto text-main cursor-pointer"
            onClick={() => {
              closeAiForm();
            }}>
              Exit
            </button>
          </div>

          <div
          className="flex flex-col justify-start items-center gap-4 overflow-x-hidden overflow-y-auto pb-5">
            {/* Messages */}
            { user.ai_chat && user.ai_chat.length >= 1 ? user.ai_chat.map((value, index) => (
              <span
              key={index}
              className={"max-w-[80%] px-2 rounded-md px-2 py-3 text-sm " + (value?.sent_by === "ai" ? "bg-main mr-auto rounded-bl-none" : "bg-neutral-800 ml-auto text-end rounded-br-none")}>
                <ReactMarkdown>{value?.message}</ReactMarkdown>
              </span>
            )) : (
              <span
              className="w-8/10 my-auto text-center opacity-80 text-lg font-light">
                Start a conversation with Deltathink
              </span>
            ) }
          </div>
          
          <form
          className="flex justify-center items-center gap-3 mt-auto w-full"
          onSubmit={async (e: any) => {
            e.preventDefault(); // Evita que la página se recargue por defecto
            
            // Evita envíos vacíos o múltiples envíos si ya está cargando
            if (!currentMessage?.trim() || isLoading) return;

            setIsLoading(true); // Activa el estado de carga y la animación
            
            try {
              await submitMessage(e);
            } finally {
              setIsLoading(false); // Desactiva el estado de carga al terminar
              setCurrentMessage(""); // Opcional: limpia el input después de enviar
            }
          }}
        >
          <input
            type="text"
            placeholder="Ask me anything"
            value={currentMessage} // Controlamos el valor del input
            disabled={isLoading} // Se deshabilita durante la carga
            onChange={(e: any) => {
              setCurrentMessage(e.target.value);
            }}
            className="w-full rounded-md bg-neutral-950 px-2 py-3 text-sm duration-300 outline-2 outline-transparent focus:outline-main disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          />

          <button 
            type="submit"
            disabled={isLoading || !currentMessage?.trim()} // Deshabilitado si carga o está vacío
            className="bg-neutral-950 rounded-full aspect-square w-10 h-10 flex justify-center items-center cursor-pointer outline-2 outline-transparent duration-500 hover:outline-main disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? (
              // Animación de Spinner (se muestra mientras isLoading sea true)
              <svg 
                className="animate-spin w-5 h-5 text-white/70" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              // Tu ícono original (se muestra cuando NO está cargando)
              <img
                src="/icons/buttons/send.svg"
                alt="Icon made by RavexCode"
                className="w-5 aspect-square block relative -translate-x-[1px] translate-y-[1px] duration-300 hover:scale-110" // Pequeño efecto hover agregado
              />
            )}
          </button>
        </form>

          <p className="text-sm font-light w-full px-5 text-center mx-auto py-1">Powered by <span className="text-main">Deepseek 3.1</span></p>

        </section>

      </section>
    </>
  )
}