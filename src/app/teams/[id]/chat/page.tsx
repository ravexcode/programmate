"use client";

import { IconArrowLeft, IconMoodSmile, IconSend } from "@tabler/icons-react";
import { useParams } from "next/navigation";
import { imported_messages, integrants } from "./data";
import { useRef, useEffect , useState} from "react";

export default function ChatPage() {
  const containerRef = useRef(null);

  const [ messages, setMessages ] = useState<any>(imported_messages);
  const [ messageToSend, setMessageToSend ] = useState("");

  useEffect(() => {
    if (containerRef.current) {
      const current : HTMLElement = containerRef.current;

      current.scrollTop = current.scrollHeight;
    }
  }, [messages]);

  const params = useParams()

  const user = {
    email: "rafa@email.com",
    username: "Rafael Martinez",
    id: "da23-j943-j89c-dj8x-hws2"
  }

  return (
    <div
    className="bg-background w-screen h-screen overflow-hidden text-text flex justify-center items-center lg:grid lg:grid-cols-[auto_1fr]">

      <aside
      className="bg-neutral-900 w-90 h-full px-6 py-3 hidden lg:flex flex-col justify-start items-start">
        <h2 className="text-xl font-medium tracking-wider w-full text-center"> Teammates </h2>

        <section
        className="flex flex-col h-full gap-2 py-3">
          {
            integrants && integrants.length > 0 && integrants.map((integrant, integrant_index) => 
              <div
              key={integrant_index}
              className="flex gap-2 items-center w-full cursor-default">
                <span
                className="p-2 w-9 text-center text-sm rounded-full bg-radial-[at_25%_25%] from-sky-600 to-blue-900">
                  {
                    integrant.username.slice(0, 1) +
                    (integrant.username.split(' ').slice(1).join(' ').slice(0, 1) || "")
                  }
                </span>

                <p
                className="tracking-wide text-md">
                  {
                    integrant.username
                  }
                </p>
              </div>
            )
          }

          <div
          className="flex gap-2 items-center w-full cursor-default mt-auto pt-10">
            <span
            className="p-2 w-9 text-center text-sm rounded-full bg-radial-[at_25%_25%] from-sky-600 to-blue-900">
              {
                user.username.slice(0, 1) +
                (user.username.split(' ').slice(1).join(' ').slice(0, 1) || "")
              }
            </span>

            <p
            className="tracking-wide text-md">
              {
                user.username
              }
              <span
              className="pl-2 opacity-60">
                (You)
              </span>
            </p>
          </div>
        </section>
      </aside>

      <main
      className="flex flex-col justify-start items-center w-screen lg:w-full h-screen">

        <header
        className="px-6 py-3 flex gap-3 justify-start items-center w-full h-max bg-neutral-900 z-2">
          <a
          href={`/teams/${params.id}`}
          className="p-2 rounded-full duration-200 hover:bg-white/20">
            <IconArrowLeft
            size={20} />
          </a>

          <h2
          className="text-xl font-medium tracking-wider">
            Your team chat
          </h2>
        </header>

        <section
        ref={containerRef}
        className="h-full relative z-1 w-full overflow-y-auto overflow-x-hidden">
          <div
          className="overflow-hidden fixed -top-1/2 -translate-y-1/5 p-5 left-1/2 -translate-x-1/2 -z-1 w-5xl aspect-square block blur-3xl bg-main/20 animate-pulse rounded-full">
          </div>

          <div
          className="z-2 h-full py-5 px-8 flex flex-col justify-start w-full gap-4 z-10">
            {
              messages && messages.length > 0 && messages.map((message : any, index : number) => 
                <div
                  key={index}
                  className={`w-full flex ${message.email === user.email ? "justify-end" : "justify-start"}`}>
                  {
                    message.email !== user.email && (
                      <span className="p-2 w-9 h-9 mt-auto text-center text-sm rounded-full bg-radial-[at_25%_25%] from-sky-600 to-blue-900 mr-2">
                        {
                          message.username.slice(0, 1) +
                          (message.username.split(' ').slice(1).join(' ').slice(0, 1) || "")
                        }
                      </span>
                    )
                  }

                  <p
                  className={`w-max max-w-2/3 px-5 py-2 rounded-xl ${
                    message.email === user.email
                      ? "bg-main rounded-br-none"
                      : "bg-neutral-800 rounded-bl-none"
                  }`}>

                    {message.content}

                    <br />

                    <span
                    className={`text-sm font-light tracking-wide uppercase ${
                      message.id === user.id ? "opacity-90" : "opacity-60"
                    }`}>
                      12:00 A.M
                    </span>

                  </p>
                </div>
              )
            }
          </div>
        </section>

        <footer
        className="h-25 px-7 py-5 flex gap-2 justify-center items-center w-full z-2">
          <input
          type="text"
          placeholder="Write a new message..."
          onChange={(e) => {
            setMessageToSend(e.target.value);
          }}
          value={messageToSend}
          onKeyDown={(e) => {
            if(e.key === "Enter" && messageToSend.length > 0) {
              setMessages((prev : any) => [
                ...prev || [],
                {
                  content: messageToSend,
                  email: user.email,
                  username: user.username
                }
              ]);

              setMessageToSend("");

              return;
            }
          }}
          className="bg-neutral-900 h-full py-2 px-5 rounded-lg outline-none border-2 border-transparent duration-300 focus:border-main w-full" />

          <button
          onClick={() => {
            if(messageToSend.length > 0) {
              setMessages((prev : any) => [
                ...prev || [],
                {
                  content: messageToSend,
                  email: user.email,
                  username: user.username
                }
              ]);

              setMessageToSend("");

              return;
            }
          }}
          className="p-4 rounded-full bg-neutral-900 cursor-pointer duration-400 hover:bg-neutral-900/60">
            <IconSend
            size={20} />
          </button>
        </footer>

      </main>

    </div>
  )
}