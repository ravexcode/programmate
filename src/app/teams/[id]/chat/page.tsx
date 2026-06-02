"use client";

//React imports
import { useRef, useEffect , useState} from "react";

//Next imports
import { useParams } from "next/navigation";
import Link from "next/link";

//Hooks imports
import { searchTeamData } from "../page";
import { useGetToken } from "@/hooks/useCookies";
import { getCached } from "@/hooks/cache.hook";

//Services
import UpdateUserData from "@/services/user.service";

//Lib imports
import supabase_client from "@/lib/client/db";
import { ClientEncrypt, ClientDecrypt } from "@/lib/client/crypto";

//Prebuild UI Imports
import SnackBar, { showSnackbar } from "@/components/ui/snackbar";
import LoadingDashboard from "@/components/screens/loading-screen";

//Icons imports
import {
  IconArrowLeft,
  IconCancel,
  IconClock,
  IconSend
} from "@tabler/icons-react";

//Types imports
import { UserBasic, UserData } from "@/types/user.types";
import Team, { ChatMessage } from "@/types/team.types";
import Image from "next/image";

export default function ChatPage() {
  //Params
  const params = useParams();

  //States handlers
  //Messages
  const [ messages, setMessages ] = useState<any>();
  //Message to be sent
  const [ messageToSend, setMessageToSend ] = useState("");
  //Team integrants
  const [ integrants, setIntegrants ] = useState<Array<UserBasic> | undefined>();
  //User data
  const [ user, setUser ] = useState<UserData>();
  //Team data
  const [ team, setTeam ] = useState<Team>()

  //Ref containers
  //Messages container
  const containerRef = useRef(null);
  //Snackbar
  const snackbar = useRef(null);

  //Sets the message container to bottom
  useEffect(() => {
    if (containerRef.current) {
      const current : HTMLElement = containerRef.current;

      current.scrollTop = current.scrollHeight;
    }
  }, [messages]);
  
  //Gets and sets team data
  useEffect(() => {
    async function setAllData(){
      //Sets user data

      //Sets cached
      const cached = getCached();
      let user_fetched;
      if(cached) {
        setUser(cached);
      } else {
        //Sets from db
        const token = useGetToken();
        if(!token) return window.location.href = "/auth/login";

        user_fetched = await UpdateUserData(token);
        
        if(!user) return window.location.href = "/auth/login";

        setUser(user_fetched);
      }

      //Gets team data
      const team_fetched : Team | null = await searchTeamData(
        snackbar,
        params,
        setTeam
      );

      const { data: chat_fetched } = await supabase_client
      .from("chats")
      .select("*")
      .eq("team_id", team_fetched?.team_id);

      if(!team_fetched) return window.location.href = "/dashboard";

      const user_id = user_fetched ? user_fetched?.id : cached?.id;

      //Sets all team data
      setIntegrants(
        team_fetched.integrants.filter(integrant => integrant.id !== user_id)
      );

      setMessages(chat_fetched || []);

      return
    };

    setAllData();
  }, []);

  //Realtime handler
  useEffect(() => {
    if (!params?.id) return;

    const channel = supabase_client
      .channel(`realtime-chats-${params.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chats',
          filter: `team_id=eq.${Number(params.id)}`
        },
        (payload: any) => {
          const newMessage = payload.new;

          setMessages((prev : Array<ChatMessage>) => {
            const exists = prev.some(
              msg => msg.message_id === payload.new.message_id
            );

            if (exists) return prev;

            const similarOptimistic = prev.find(
              msg =>
                typeof msg.message_id === "string" && 
                msg.content === payload.new.content &&
                msg.sender_id === payload.new.sender_id
            );

            if (similarOptimistic) {
              return prev.map(msg =>
                msg === similarOptimistic
                  ? { ...payload.new, status: "sent" }
                  : msg
              );
            }

            return [...prev, payload.new];
          });
        }
      )
      .subscribe();

    return () => {
      supabase_client.removeChannel(channel);
    };
  }, [params.id]);

  //Save message handler
  const saveMsgHandler = async () => {
    if (!user || !team) return;

    const tempId = `temp-${Date.now()}`;

    const optimisticMessage: ChatMessage = {
      sent_id: tempId,
      team_id: team.team_id,
      sender_id: user.id,
      sender_email: user.email,
      sender_name: user.name,
      content: ClientEncrypt(messageToSend),
      sent_at: new Date(),
      status: "sending",
    };

    setMessages((prev : Array<ChatMessage>) => [...prev, optimisticMessage]);

    const { data, error } = await supabase_client
      .from("chats")
      .insert({
        team_id: team.team_id,
        sender_id: user.id,
        sender_email: user.email,
        sender_name: user.name,
        content: optimisticMessage.content,
      })
      .select()
      .single();

    if (error) {
      setMessages((prev : Array<ChatMessage>) =>
        prev.map(msg =>
          msg.sent_id === tempId
            ? { ...msg, status: "error" }
            : msg
        )
      );

      console.error(error);
      return;
    }

    setMessages((prev : Array<ChatMessage>) =>
      prev.map(msg =>
        msg.sent_id === tempId
          ? { ...data, status: "sent" }
          : msg
      )
    );
  };

  return (
    team ? (
      <div className="bg-background w-screen h-screen overflow-hidden text-text flex">
        <SnackBar ref={snackbar} />

        <div className="hidden md:flex flex-col bg-neutral-900 border-r border-neutral-800 px-4 py-3 w-80">
          <h3 className="text-sm font-semibold tracking-wide text-text/70 mb-2">Team Members</h3>
          <div className="flex gap-2 overflow-x-auto py-2">
            {integrants && integrants.length > 0 && integrants.map((integrant, idx) => 
              <Link
              href={`/profiles/${integrant.id}`}
              className="w-full rounded-md bg-neutral-950/50 border border-neutral-700 px-4 py-2 text-sm flex justify-center items-center gap-3 duration-400 cursor-pointer hover:-translate-y-0.5 hover:border-main"
              key={idx}>
                <Image
                height={50}
                width={50}
                src={integrant?.avatar_url!}
                alt="Profile icon"
                className="rounded-full w-7 h-7" />

                <div
                className="w-full">
                  <p> {integrant.username} </p>
                  <p
                  className="text-xs font-light opacity-70"> {integrant.email} </p>
                </div>
              </Link>
            )}
          </div>

          <Link
          href="/settings"
          className="w-full rounded-md bg-neutral-950/50 border border-neutral-700 px-4 py-2 text-sm flex justify-center items-center gap-3 duration-400 cursor-pointer hover:-translate-y-0.5 hover:border-main mt-auto">
            <Image
            height={50}
            width={50}
            src={user?.avatar_url!}
            alt="Profile icon"
            className="rounded-full w-7 h-7" />

            <div
            className="w-full">
              <p> {user?.name} </p>
              <p
              className="text-xs font-light opacity-70"> (You) </p>
            </div>
          </Link>
        </div>

        <main
        className="flex flex-col justify-start items-center w-full h-screen lg:h-full flex-1">

          <header
          className="px-6 py-4 flex gap-3 justify-start items-center w-full h-max bg-neutral-900 border-b border-neutral-800 z-20">
            <Link
            href={`/teams/${params.id}`}
            className="p-2 rounded-lg duration-200 hover:bg-neutral-800 transition-colors">
              <IconArrowLeft size={20} stroke={2} />
            </Link>

            <div className="flex-1">
              <h2 className="text-xl font-bold tracking-tight text-text">
                {team.name.slice(0, 1).toUpperCase() + team.name.slice(1)}
              </h2>
              <p className="text-xs text-text/50">Team Chat</p>
            </div>
          </header>

          <section
          ref={containerRef}
          className="flex-1 w-full overflow-y-auto relative z-10">
            {/* Background blur effect */}
            <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden hidden lg:block">
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 aspect-square block w-200 rounded-full bg-main/10 blur-3xl animate-pulse" />
            </div>

            <div className="py-6 px-4 md:px-8 flex flex-col justify-start w-full gap-4 relative z-10">
              {messages && messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-96 text-center">
                  <p className="text-text/50 mb-2">No messages yet</p>
                  <p className="text-sm text-text/30">Start a conversation with your team</p>
                </div>
              )}

              {messages && messages.length > 0 && messages.map((message : ChatMessage, index: number) =>
                <section
                key={index}
                className={"flex items-end w-full gap-3 animate-fade-in " + (message.sender_id === user?.id ? "justify-end" : "justify-start")}>
                  {message.sender_id !== user?.id && (
                    <span className="p-2 w-8 h-8 text-center text-xs rounded-full bg-linear-to-br from-sky-600 to-blue-900 flex items-center justify-center shrink-0 font-medium">
                      {message.sender_name.slice(0, 1)}
                    </span>
                  )}

                  <div className={"flex flex-col gap-1 " + (message.sender_id === user?.id ? "items-end" : "items-start")}>
                    {message.sender_id !== user?.id && (
                      <span className="text-xs font-medium text-text/70 px-3">
                        {message.sender_name}
                      </span>
                    )}
                    
                    <div className={"flex items-end gap-2 " + (message.sender_id === user?.id ? "flex-row-reverse" : "flex-row")}>
                      <p
                      className={"max-w-xs lg:max-w-md rounded-2xl px-4 py-3 text-sm font-medium " + (message.sender_id === user?.id 
                        ? "rounded-br-none bg-main text-white shadow-lg shadow-main/20" 
                        : "rounded-bl-none bg-neutral-800 border border-neutral-700 text-text")}>
                        {ClientDecrypt(message.content)}
                      </p>

                      <div className="flex items-center gap-1">
                        {message.status === "sending" && (
                          <IconClock size={16} className="animate-spin text-text/50" />
                        )}
                        {message.status === "error" && (
                          <IconCancel size={16} className="text-red-400" />
                        )}
                      </div>
                    </div>

                    <span className="text-xs text-text/40 px-3 mt-1">
                      {new Date(message.sent_at!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </section>
              )}
            </div>
          </section>

          <footer
          className="px-4 md:px-8 py-4 flex gap-3 justify-center items-center w-full bg-neutral-900 border-t border-neutral-800 z-20">
            <input
            type="text"
            placeholder="Type a message..."
            onChange={(e) => {
              setMessageToSend(e.target.value);
            }}
            value={messageToSend}
            onKeyDown={async(e) => {
              if(e.key === "Enter" && user && messageToSend && messageToSend.length > 0) {
                setMessageToSend("");
                await saveMsgHandler();
              }
            }}
            className="flex-1 bg-neutral-800 h-full py-3 px-4 rounded-lg outline-none border border-neutral-700 duration-300 focus:border-main text-sm text-text placeholder-text/40 transition-colors" />

            <button
            onClick={async() => {
              if(user && messageToSend && messageToSend.length > 0) {
                setMessageToSend("");
                await saveMsgHandler();
              }
            }}
            disabled={!messageToSend || messageToSend.length === 0}
            className="p-3 rounded-lg bg-main text-white cursor-pointer duration-200 hover:bg-main/90 transition-all shrink-0 disabled:opacity-50 disabled:cursor-not-allowed">
              <IconSend size={20} stroke={2} />
            </button>
          </footer>

        </main>

      </div>
    ) : (
      <LoadingDashboard />
    )
  )
}