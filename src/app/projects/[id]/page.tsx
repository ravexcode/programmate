//Client side
"use client"

//Next imports
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

//React imports
import { useEffect, useState, useRef } from "react";

//Types imports
import { UserData } from "@/types/user.types";
import Team from "@/types/team.types";

//Prebuild ui imports
import TeamSidebar from "@/components/ui/dashboard/team-sidebar";
import SnackBar from "@/components/ui/snackbar";
import LoadingDashboard from "@/components/screens/loading-screen";
import BgGradient from "@/components/ui/bg-gradient";
import DashCard from "@/components/ui/cards/dashboard";

//Modules import
import { getUser } from "@/modules/user.module";
import { getProject } from "@/modules/project/main.module";

import { IconCircleDot, IconUserCircle } from "@tabler/icons-react";

export default function TeamPage(){
  //NextJS Setup
  const params = useParams();
  const router = useRouter();

  //States handler
  //User data
  const [ user, setUser ] = useState<UserData>();
  //Team data
  const [ team, setTeam ] = useState<Team>();

  //Snackbar container
  const snackbar = useRef(null);

  //Sets the data
  useEffect(() => {
    async function get() {
      const data_user = await getUser(router);
      const data_project = await getProject({
        router,
        id: Number(params.id),
        snackbar
      });

      if(!data_project || !data_user) return;

      setUser(data_user);
      setTeam(data_project);
  
      return;
    }

    get();
  }, []);
  
  return (
      team && user ? (
        <div
        className="bg-background grid grid-cols-[auto_1fr] text-text">
          <SnackBar
          ref={snackbar} />
          <TeamSidebar
          user={user}
          team={team} />

          <main
          className="w-full h-screen overflow-w-hidden overflow-y-auto py-5 px-18 bg-background relative flex flex-col justify-start items-start">
            <BgGradient />

            {/* Team data section */}
            <section
            className="flex flex-col py-2 w-full justify-center items-start mb-5">
              <h2
              className="text-5xl font-semibold mb-2">
                {team?.name}
              </h2>

              <p
              className="opacity-70">
                {team?.description}
              </p>

              <div
              className="flex gap-2 flex-wrap w-full justify-start items-center mt-5 cursor-default">
                {
                  team && team.tags && team.tags.length >= 1 && team.tags.map((tag: string, index: number) => 
                    <div
                    key={index}
                    className="text-sm px-4 py-1 rounded-full border border-main/50 bg-main/30 duration-400 hover:bg-main/50">
                      {tag}
                    </div>
                  )  
                }
              </div>

              <p
              className="text-sm opacity-80 font-light mt-2">
                Team ID: {team.team_id}
              </p>

              <p
              className="mt-1 flex gap-2 justify-center items-center w-max rounded-full text-sm">
                <span className={"w-1.5 h-1.5 rounded-full block " + (
                  team.status === "Backlog" ? "bg-zinc-500" :
                  team.status === "Planning" ? "bg-blue-400" :
                  team.status === "In progress" ? "bg-orange-400" :
                  team.status === "On Hold" ? "bg-red-400" :
                  "bg-purple-500" ) }></span>
                { team?.status }
              </p>
            </section>

            
            <section
            className="w-full h-full py-5 flex flex-col md:grid md:grid-cols-2 items-center justify-center gap-5">

              { /* Team integrants */ }
              <DashCard
              className="flex flex-col gap-2 items-center justify-start"
              size="w-full h-full">
                <p
                className="text-xl font-medium tracking-wide w-full text-start">
                  {team.name} integrants
                </p>

                <span
                className="my-1 h-px bg-neutral-800 rounded-full w-full" />

                {
                  team.integrants && team.integrants.length > 0 && team.integrants.map((int) =>
                    <Link
                    href={`/users/${int.id}`}
                    key={int.id}
                    className="w-full py-2 px-4 text-sm flex justify-start items-center hover:backdrop-brightness-200 rounded-sm duration-300 cursor-pointer"
                    title={"Go to " + int.username + "'s profile" }>
                      {
                        int.avatar_url ? (
                          <Image
                          src={int.avatar_url}
                          alt={int.email + " profile picture"}
                          width={50}
                          height={50}
                          className="rounded-full aspect-square block w-8" />
                        ) : (
                          <IconUserCircle />
                        )
                      }

                      <div
                      className="flex flex-col items-start justify-center px-4 mr-auto">
                        <p
                        className="text-base font-medium">
                          {
                            int.username.length > 20 ?
                              int.username.slice(0, 20) + "..." :
                              int.username
                          }
                        </p>
                        <p
                        className="text-neutral-300">
                          {
                            int.email.length > 25 ?
                              int.email.slice(0, 25) + "..." :
                              int.email
                          }
                        </p>
                      </div>

                      <p
                      className="text-sky-500 uppercase font-medium tracking-widest">
                        { int.type ?? "Member" }
                      </p>
                    </Link>
                  )
                }
              </DashCard>

              { /* Team tickets */ }
              <DashCard
              className="flex flex-col gap-2 items-center justify-start"
              size="w-full h-full">
                <p
                className="text-xl font-medium tracking-wide w-full text-start">
                  {team.name} issues
                </p>

                <span
                className="my-1 h-px bg-neutral-800 rounded-full w-full" />

                {
                  team.tickets && team.tickets.length > 0 ? 
                    team.tickets.map((ticket, i) =>
                      <div
                      key={"Ticket" + i}
                      className="w-full py-2 px-4 rounded-md hover:backdrop-brightness-200">
                        {
                          ticket.title 
                        }
                      </div>
                    )
                  : 
                    <div
                    className="w-full h-full flex flex-col items-center justify-center text-neutral-300">
                      <IconCircleDot
                      size={50}
                      stroke={1.5} />
                      <p
                      className="text-2xl font-medium">
                        No issues found!
                      </p>
                      <Link
                      href={`/projects/${params.id}/tickets`}
                      className="duration-400 text-neutral-400 hover:text-sky-600 hover:underline">
                        Try creating a new one...
                      </Link>
                    </div>
                }
              </DashCard>

            </section>
          </main>
        </div>
      ) : (
        <LoadingDashboard />
      )
  )
}