//Client side
"use client";

//Table icons imports
import {
  IconPlus,
  IconReload
} from "@tabler/icons-react";

//React imports
import { useEffect, useState, useRef } from "react";

//Components imports
import Sidebar from "@/components/ui/dashboard/sidebar";
import LoadingDashboard from "@/components/screens/loading-screen";
import SnackBar from "@/components/ui/snackbar";
import ProjectCard from "@/components/ui/project-card";

//Types imports
import { UserData } from "@/types/user.types";
import Team from "@/types/team.types";

//Next imports
import { useRouter } from "next/navigation";

//Modules imports
import { getUser } from "@/modules/user.module";
import Link from "next/link";

export default function Dashboard(){
  //Next setup
  const router = useRouter();

  //State values
  //User data
  const [ user, setUser ] = useState<UserData>();
  //Is reloading button
  const [ isReloading, setIsReloading ] = useState<boolean>(false);
  //Snackbar container
  const snackbar = useRef(null);

  //Gets user data
  useEffect(() => {
    async function update() {
      const got = await getUser(router);

      setUser(got!);
    }

    update();
    
    //Returns success
    return;
  }, [router]);

  return (
    !user ? <LoadingDashboard />
      :
    <div className="min-h-screen bg-background grid grid-rows-[auto_1fr] sm:grid-cols-[auto_1fr] overflow-hidden text-text">
      {/* Layout sections */}
      <SnackBar
      ref={snackbar} />

      {/* Main container */}
      {
        user && user.email ? (
          <>
            <Sidebar
            user={user} />
            <main className="relative flex flex-col h-screen overflow-y-auto px-4 md:px-8 animate-fade-in">
              {
                user.plan && (
                  <div
                  className="flex justify-end items-center w-full my-5">
                    <span
                    className="text-sm px-5 py-1 bg-main shadow-lg shadow-main/30 rounded-full cursor-default">
                      { user.plan }
                    </span>
                  </div>
                )
              }

              <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
                <div className="absolute left-1/2 top-1/2 aspect-square block w-200 -translate-x-1/2 -translate-y-1/2 rounded-full bg-main/15 blur-3xl animate-pulse" />
              </div>

              <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col gap-10">
                
                <header className="flex h-max">
                  <div
                  className="flex flex-col justify-center items-between gap-2 w-full">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
                    Welcome back, {user.name}!
                    </h2>
                    <p className="text-text/70 text-sm md:text-base">
                      There are your recent projects
                    </p>
                  </div>

                  <button
                  className="text-sm py-2 px-6 border border-neutral-800 rounded-full cursor-pointer duration-300 hover:border-neutral-700 h-max w-max flex gap-2 my-auto disabled:hover:brightness-80 disabled:hover:bg-transparent disabled:hover:scale-100 disabled:brightness-80 disabled:cursor-wait"
                  disabled={isReloading}
                  onClick={ async() => {
                    setIsReloading(true);

                    await getUser(router);
                    setIsReloading(false);
                  }}>
                    <IconReload
                    size={20}
                    color="white"
                    stroke={2} />

                    Refresh
                  </button>
                </header>
                
                <section className="flex flex-col gap-6">
                  
                  <div className="flex w-full items-center justify-between">
                    <h3 className="text-xl font-semibold tracking-tight text-white/90">
                      Projects
                    </h3>

                    <Link
                    className="flex items-center gap-2 bg-main px-6 py-1.5 text-sm font-medium text-white rounded-md transition-all duration-300 hover:bg-main/80 focus:outline-none active:scale-95 cursor-pointer"
                    href="/projects/build">
                      <IconPlus
                      color="white"
                      size={16}
                      stroke={2.5}/>
                      Create new
                    </Link>
                  </div>

                  <div className={user.teams && user.teams.length > 0 ? "grid grid-cols-1 lg:grid-cols-2 gap-6" : "flex flex-col justify-center items-center"}>
                    {
                      user.teams && user.teams.length >= 1 ? user.teams.map((team : Team, index: number) => (
                        <ProjectCard
                        key={ index }
                        id={ team.team_id }
                        title={ team.name }
                        description={ team.description }
                        index={ index }
                        status={team.status}
                        tags={ team.tags! }
                        goToTeam={() => { return router.push(`/projects/${team.team_id}`) }}/>
                      )) : (
                        <span
                        className="w-full text-center text-2xl font-light text-text py-4"> No projects found, try creating a new project!  </span>
                      )
                    }
                  </div>
                </section>
              </div>
            </main>
          </>
        ) : (
          <LoadingDashboard />
        )
      }
    </div>
  )
}