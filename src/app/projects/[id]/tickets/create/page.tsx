//Client side
"use client";

//React imports
import { useEffect, useRef, useState } from "react";

//Next imports
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

//Prebuild UI imports
import SnackBar from "@/components/ui/snackbar";
import LoadingDashboard from "@/components/screens/loading-screen";
import TeamSidebar from "@/components/ui/dashboard/team-sidebar";
import CreatorInput from "@/components/forms/creator-inputs";
import OptionsInput from "@/components/forms/options-input";
import MainButton from "@/components/ui/buttons/main";

//Icons imports
import { IconArrowLeft } from "@tabler/icons-react";

//Types imports
import { UserData } from "@/types/user.types";
import Team, { Ticket } from "@/types/team.types";

//Modules imports
import { getUser } from "@/modules/user.module";
import { getProject } from "@/modules/project/main.module";
import { createTicket } from "@/modules/project/ticket.module";

export default function TicketsTeamPage(){
  //NextJS Setup
  const params = useParams();
  const router = useRouter();

  //States handler
  //User data
  const [ user, setUser ] = useState<UserData>();
  //Team data
  const [ team, setTeam ] = useState<Team>();

  //Form stauts
  const [ loading, setLoading ] = useState(false);

  //Ref Objects
  //Snackbar data
  const snackbar = useRef(null);

  useEffect(() => {
    async function fetchData() {
      const data_user = await getUser(router);
      const data_project = await getProject({
        router,
        id: Number(params.id),
        snackbar
      });

      setUser(data_user!);
      setTeam(data_project);

      return;
    }

    fetchData();
  }, []);

  const impOptions = ["Low" , "Medium" , "High"];

  const [ importance, setImportance ] = useState("Low");

  const defaultTicket : Ticket = {
    creator: "",
    creator_id: "",
    to: "",
    title: "",
    message: "",
    importance: importance as "Low"
  }

  const [ ticket, setTicket ] = useState<Ticket>(defaultTicket);

  return (
    team && user ? (
      <div
      className="bg-background text-text h-screen grid grid-cols-[auto_1fr]">
        <SnackBar
        ref={snackbar} />
        <TeamSidebar
        user={user}
        team={team} />
        
        <main
        className="w-full flex flex-col items-center p-10">

          <div
          className="w-full max-w-130 mb-10">
            <button
            type="button"
            className="flex items-center justify-center gap-1 font-medium text-neutral-200 duration-300 hover:bg-neutral-800 cursor-pointer px-5 py-2 rounded-md">
              <IconArrowLeft
              size={20} />
              Go back
            </button>
          </div>

          <form
          className="w-full h-full max-w-130 rounded-sm border-neutral-900 bg-neutral-950 border px-6 py-5 flex flex-col items-center"
          onSubmit={async(e) => {
            e.preventDefault();

            setLoading(true);
            await createTicket({
              router,
              snackbar,
              ticket: {
                ...ticket,
                importance: importance as "Low" | "Medium" | "High",
                creator: user.name,
                creator_id: user.id
              },
              id: Number(params.id)
            });
            setLoading(false);
          }}>
            <p
            className="font-bold text-3xl tracking-wide mb-5">
              Create a new issue
            </p>

            <CreatorInput
            label="Set issue title"
            placeholder="e.g. Create database policy"
            value={ticket.title}
            onChange={(e) => [
              setTicket(prev =>
                prev ?
                  {
                    ...prev,
                    title: e.target.value
                  } :
                ticket
              )
            ]}
            bgColor="bg-neutral-900"
            required />

            <CreatorInput
            label="Set the issue message (Markdown supported)"
            type="textarea"
            placeholder="e.g. # Creating db policy..."
            value={ticket.message}
            onChange={(e) => [
              setTicket(prev =>
                prev ?
                  {
                    ...prev,
                    message: e.target.value
                  } :
                ticket
              )
            ]}
            bgColor="bg-neutral-900"
            required />

            <CreatorInput
            label="Creator"
            value={user.email}
            onChange={() => {}}
            bgColor="bg-neutral-900"
            disabled />

            <CreatorInput
            label="Set the user destinated"
            placeholder="e.g. Jhon Doe"
            value={ticket.to}
            onChange={(e) => [
              setTicket(prev =>
                prev ?
                  {
                    ...prev,
                    to: e.target.value
                  } :
                ticket
              )
            ]}
            bgColor="bg-neutral-900"
            required />
          
            <OptionsInput
            label="Set importance"
            value={importance as string}
            options={impOptions}
            onChange={setImportance}
            bgColor="bg-neutral-900" />

            <MainButton
            type="submit"
            size="w-full"
            className="mt-auto"
            isDisabled={!ticket.title || !ticket.to || !ticket.message}
            isLoading={loading}>
              Create new issue
            </MainButton>
          </form>

        </main>
      </div>
    ) : (
      <LoadingDashboard />
    )
  )
}