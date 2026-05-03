"use client";

//React imports
import { useRef, useEffect , useState} from "react";

//Next imports
import { useParams } from "next/navigation";
import { getCookie } from "cookies-next";

//Hooks imports
import { searchTeamData } from "../page";
import { getCached } from "@/hooks/cache";

//Services
import UpdateUserData from "@/services/update.user";

//Lib imports
import supabase_client from "@/lib/db_client";

//Prebuild UI Imports
import SnackBar, { SnackbarRef } from "@/components/ui/snackbar";
import LoadingDashboard from "@/components/screens/loading_dashboard";

//Icons imports
import {
  IconArrowLeft,
  IconSend
} from "@tabler/icons-react";

//Types imports
import { UserBasic, UserData } from "@/types/user.types";
import Team from "@/types/team.types";

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
  const snackbar = useRef<SnackbarRef>(null);

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
        const token = await getCookie("token");
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

      if(!team_fetched) return window.location.href = "/dashboard";

      const user_id = user_fetched ? user_fetched?.id : cached?.id;

      //Sets all team data
      setIntegrants(
        team_fetched.integrants.filter(integrant => integrant.id !== user_id)
      );
      setMessages(team_fetched.chat);

      return
    };

    setAllData();
  }, []);

  //Realtime connection
  useEffect(() => {
    const channels = supabase_client.channel('custom-all-channel')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'teams'
      },
      (payload) => {
        //Completely safe

        //@ts-ignore
        if(payload.new.chat && payload.new.chat.lenght > 0) {
          //@ts-ignore
          setMessages(payload.new.chat);
        }
      }
    )
    .subscribe();

    return () => {
      supabase_client.removeChannel(channels);
    };
  }, []);

  return (
    team ? (
      <div
      className="bg-background w-screen h-screen overflow-hidden text-text flex justify-center items-center lg:grid lg:grid-cols-[auto_1fr]">
        <SnackBar ref={snackbar} />

        <aside
        className="bg-neutral-900 w-90 h-full px-6 py-3 hidden lg:flex flex-col justify-start items-start z-2">
          <h2 className="text-xl font-medium tracking-wider w-full text-center"> Teammates </h2>

          {
            integrants && integrants.length <= 0 && (
              <h2 className="text-lg mt-3 font-thin opacity-80 tracking-wider w-full text-center"> Not teamates-found </h2>
            )
          }

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
                  user?.name.slice(0, 1) +
                  (user?.name.split(' ').slice(1).join(' ').slice(0, 1) || "")
                }
              </span>

              <p
              className="tracking-wide text-md">
                {
                  user?.name
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
                /* Add messages containers */
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
              //Save the message
            }}
            className="bg-neutral-900 h-full py-2 px-5 rounded-lg outline-none border-2 border-transparent duration-300 focus:border-main w-full" />

            <button
            onClick={() => {
              //Save the message
            }}
            className="p-4 rounded-full bg-neutral-900 cursor-pointer duration-400 hover:bg-neutral-900/60">
              <IconSend
              size={20} />
            </button>
          </footer>

        </main>

      </div>
    ) : (
      <LoadingDashboard />
    )
  )
}