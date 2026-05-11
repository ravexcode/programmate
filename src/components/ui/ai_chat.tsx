//React imports
import { useState, useRef, RefObject, useEffect } from "react";

//Next imports
import { getCookie, deleteCookie } from "cookies-next/client";

//Node modules imports
import ReactMarkdown from "react-markdown";

//Function imports
import { getCached } from "@/hooks/cache.hook";

//Types imports
import { UserData } from "@/types/user.types";

//Icons imports
import { IconX } from "@tabler/icons-react";

export default function AIChat(){
  //States updater
  //User data
  const [ user, setUser ] = useState<UserData>();
  //Current message to send
  const [ currentMessage, setCurrentMessage ] = useState<string>("");
  //Is loading the response state
  const [isLoading, setIsLoading] = useState(false);
  //AI Container visibility state
  const [isVisible, setIsVisible] = useState(true);

  //Containers ref
  //Ai chat container
  const AIcontainer : RefObject<null> = useRef(null);
  //Ai button
  const AIbutton : RefObject<null> = useRef(null);

  //UseState for get the user data
  useEffect(() => {
    async function getCache(){
      const user : any = await getCached();
      setUser(user);
    }

    getCache();
  }, []);

  //AI Container toggler (On / Off) function
  const toggleAiForm = () => {
    //Verifies if the button and container exists (preventing errors)
    if(!AIbutton.current || !AIcontainer.current) return;
    //Current elements
    //Button current
    const button : HTMLButtonElement = AIbutton.current;
    //Current elements
    //Button current
    const container : HTMLElement = AIcontainer.current;

    //Sets functions in base is visible or not
    if(isVisible) {
      //Shows the button
      button.classList.add("hidden");
      //Hides the container
      container.classList.remove("hidden");
    } else {
      //Hides the button
      button.classList.remove("hidden");
      //Shows the container
      container.classList.add("hidden");
    }

    //Toggles is visible or not
    setIsVisible(prev => prev === true ? false : true);
    //End of function
    return;
  }

  //Message sender and recivier
  const submitMessage = async(e: any) => {
    //Prevents premature reloads
    e.preventDefault();
    //Verifies if message is inserted
    if(!currentMessage || currentMessage.length < 1) return;
    //Gets the users token
    const token = await getCookie("token");
    //Verifies if exists
    if(!token) {
      //If isn't logged close sessions data (Error prevention)
      deleteCookie("token");
      localStorage.clear();
      //Returns to login
      window.location.href = "/auth/login";
    }

    //Puts the message sent in a const
    const message_sent = currentMessage;

    //Updates the messages states
    setUser((prev : any) => ({
      ...prev,
      ai_chat: [
        ...prev.ai_chat || [],
        {
          sent_by: "user",
          message: message_sent
        }
      ]
    }));

    //Clears the input
    setCurrentMessage("");

    //Makes the requests
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

    //Sets the message dta
    const data = await res.json();

    //Verifies if the status is OK
    if(res.status === 200) {
      // Actualizar estado con la respuesta del AI
      setUser((prev : any) => ({
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
      //Add the snackbar logic
    }
  }

  return (
    <>
      {/* Button */}
      <button
      ref={AIbutton}
      className="fixed p-3 rounded-full bottom-4 right-4 border-x border-main shadow-lg shadow-main/20 cursor-pointer bg-neutral-950 z-10 duration-300 hover:scale-105 hover:-translate-y-1 hover:shadow-main/40 focus:outline-none animate-pulse"
      onClick={() => {
        toggleAiForm();
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
        className="bg-neutral-900 h-full pb-3 px-2 md:rounded-xl flex flex-col">
          <div
          className="px-6 py-4 flex justify-end items-center">

            <button
            className="text-sm text-main cursor-pointer"
            onClick={() => {
              toggleAiForm();
            }}>
              <IconX
              size={25}
              stroke={2}
              color="white" />
            </button>

          </div>

          <div
          className="flex flex-col justify-start items-center gap-4 overflow-x-hidden overflow-y-auto pb-5 px-4">
            {/* Messages */}
            { user && user.ai_chat && user.ai_chat.length >= 1 ? user.ai_chat.map((value, index) => (
              <span
              key={index}
              className={"max-w-[80%] rounded-md px-2 py-3 text-sm text-wrap " + (value?.sent_by === "ai" ? "bg-neutral-800 mr-auto rounded-bl-none" : "bg-main ml-auto text-end rounded-br-none")}>
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
          className="flex justify-center items-center gap-3 mt-auto w-full px-4"
          onSubmit={async (e: any) => {
            e.preventDefault();
            if (!currentMessage?.trim() || isLoading) return;

            setIsLoading(true);
            
            try {
              await submitMessage(e);
            } finally {
              setIsLoading(false);
              setCurrentMessage("");
            }
          }}
        >
          <input
            type="text"
            placeholder="Ask me anything"
            value={currentMessage}
            disabled={isLoading}
            onChange={(e: any) => {
              setCurrentMessage(e.target.value);
            }}
            className="w-full rounded-md bg-neutral-950 px-2 py-3 text-sm duration-300 outline-2 outline-transparent focus:outline-main disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          />

          <button 
            type="submit"
            disabled={isLoading || !currentMessage?.trim()}
            className="bg-neutral-950 rounded-full aspect-square w-10 h-10 flex justify-center items-center cursor-pointer outline-2 outline-transparent duration-500 hover:outline-main disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? (
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
              <img
                src="/icons/buttons/send.svg"
                alt="Icon made by RavexCode"
                className="w-5 aspect-square block relative -translate-x-px translate-y-px duration-300 hover:scale-110"
              />
            )}
          </button>
        </form>

          <p className="text-sm font-light w-full px-5 text-center mx-auto py-1">Powered by <span className="text-blue-500">Deepseek</span></p>

        </section>

      </section>
    </>
  )
}