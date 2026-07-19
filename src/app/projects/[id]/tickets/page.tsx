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
import MainButton from "@/components/ui/buttons/main";
import BgGradient from "@/components/ui/bg-gradient";
import TicketCard from "@/components/ui/ticket-card";

//Types imports
import { UserData } from "@/types/user.types";
import Team from "@/types/team.types";

//Modules imports
import { getUser } from "@/modules/user.module";
import { getProject } from "@/modules/project/main.module";

export default function TicketsTeamPage(){
  //NextJS Setup
  const params = useParams();
  const router = useRouter();

  //States handler
  //User data
  const [ user, setUser ] = useState<UserData>();
  //Team data
  const [ team, setTeam ] = useState<Team>();

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

  return (
    team && user ? (
      <div
      className="bg-background text-text h-screen grid grid-cols-[auto_1fr]">
        <SnackBar
        ref={snackbar} />
        <TeamSidebar
        user={user}
        team={team} />
        
        <div
        className="grid grid-rows-[auto_1fr] relative h-max md:h-auto overflow-auto">
          <BgGradient />

          <header
          className="text-2xl h-max py-4 px-8 flex justify-between items-center">
            <div
            className="flex gap-2 justify-center items-center">
              <p> { team.name } Tickets </p>
            </div>

            <MainButton
            action={() => router.push(`/projects/${params.id}/tickets/create`)}
            size="w-35">
              Create new +
            </MainButton>
          </header>

          <main
          className="flex flex-col items-center justify-center w-full">
            {/* Tickets cards */}
            {
              team.tickets && team.tickets.length > 0 ?
              (
                <section
                className="gap-5 grid grid-rows md:grid-cols-2 xl:grid-cols-3 h-full p-10 w-full">
                  {
                    team.tickets.map((ticket, index) =>
                      <TicketCard
                      content={ticket}
                      userId={user.id}
                      index={index}
                      teamId={params.id}
                      router={router}
                      key={index}/>
                    )
                  }
                </section>
              ) : (
                <div
                className="flex flex-col text-neutral-200 justfiy-start items-center py-10 w-full z-2 h-full">
                  <section
                  className="w-150 text-sm p-4 rounded-md bg-neutral-950 mt-10 flex flex-col gap-2 items-start justify-center select-none">
                    <p
                    className="text-transparent bg-neutral-900 p-0.5 rounded-md text-sm">
                      Lorem, ipsum dolor sit amet
                    </p>
                    <p
                    className="text-transparent bg-neutral-900 p-0.5 rounded-md text-sm">
                      Lorem, ipsum dolor sit amet consectetur adipisicing
                    </p>
                    <p
                    className="text-transparent bg-neutral-900 p-0.5 rounded-md text-sm">
                      Lorem, ipsum dolor sit amet consectetur adipisicing
                    </p>
                    <p
                    className="text-transparent bg-neutral-900 p-0.5 rounded-md text-sm">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum, sit totam placeat asperiores pariatur consequuntur? Quae voluptatum vitae provident quibusdam totam eos temporibus facilis similique! Nam nobis illum dolores nihil?
                    </p>

                    
                    <p
                    className="text-transparent bg-neutral-900 p-2 rounded-md text-sm mt-3 w-full">
                      Lorem
                    </p>
                  </section>

                  <p
                  className="font-medium tracking-wide mt-3 text-2xl">
                    Track the project issues
                  </p>
                  <p
                  className="opacity-80 w-130 text-center mt-1">
                    Start tracking project issues using Issue tracker provided by NexZero creating a new issue and setting it for your teammates
                  </p>
                </div>
              )
            }
          </main>
        </div>
        
      </div>
    ) : (
      <LoadingDashboard />
    )
  )
}