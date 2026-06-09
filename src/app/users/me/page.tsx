"use client";

//Next imports
import { useRouter } from "next/navigation";
import Image from "next/image";

//Hooks imports
import { getCached } from "@/hooks/cache.hook";
import { useDeleteCookie, useGetToken } from "@/hooks/useCookies";

//Prebuilt UI imports
import LoadingScreen from "@/components/screens/loading-screen";
import SideBar, { Icon } from "@/components/ui/sidebar";
import BgGradient from "@/components/ui/bg-gradient";

//Services imports
import getUser from "@/services/user.service";

//React imports
import { useEffect, useState } from "react";

//Types imports
import type { UserData } from "@/types/user.types";
import Team from "@/types/team.types";
import { IconUserCircle } from "@tabler/icons-react";

export default function ProfilePage() {
  const router = useRouter();

  //User data
  const [user, setUser] = useState<UserData | null>(null);
  const [ expanded, setExpanded ] = useState<boolean>(false);

  //Constraints
  const cardClasses = "w-full rounded-md bg-neutral-950 border border-neutral-800 p-4 flex gap-2 duration-300 hover:border-main items-center z-2 animate-fade-in-up animate-duration-500";
  
  //Gets user data
  useEffect(() => {
    //Function to update the user data
    async function updateFromToken(){
      let user_data;
      //Id isn't cached gets the data
      const token = useGetToken();

      if(!token) {
        //If hasn't token returns to log in form
        return router.push("/auth/login");
      };

      
      //Gets the cached user
      const cached = getCached();

      //If there is a cached user, sets the user data
      if(cached) {
        setUser(cached);
        user_data = cached;
      }

      //Updates the user's data
      if(!cached) user_data = await getUser(token);
      //Created at to Date
      const created_at = new Date(user_data!.created_at!);
      //Date now
      const now = new Date();

      if(user_data && (created_at.getDay() === now.getDay() && user_data.teams?.length! <= 0)) {
        router.push("/get-started");

        return;
      } else if(user_data) {
        setUser(user_data);

        return;
      }

      useDeleteCookie("token");
      localStorage.clear();
      window.localStorage.clear();
      return router.push("/auth/login");
    }

    //Executes the function
    updateFromToken();
    
    //Returns success
    return;
  }, []);
  return (
    user ? (
      <div
      className="w-full bg-background grid grid-cols-[auto_1fr] h-screen">
        <SideBar
        email={user?.email}
        avatar={user.avatar_url}
        plan={user.plan}
        username={user.name}
        setExpanded={(isExpanded : boolean) => {
          setExpanded(isExpanded === true ? false : true);
        }}>
          {
            expanded && (
              <span className="w-full text-base font-bold p-2 mt-5 animate-fade-in-right">
                Projects
              </span>
            )
          }

          {
            user.teams && user.teams.length > 0 && user.teams.map((team: Team, index) => 
              <Icon
              action={`/projects/${team.team_id}`}
              name={team.name}
              isDisplayed={expanded}
              key={index}>
                <></>
              </Icon>
            )
          }
        </SideBar>

        <main
        className="w-full min-h-max h-full px-2 py-10 relative animate-fade-in animate-duration-250">
          <BgGradient />
          <section
          className="w-full flex flex-col gap-3 p-2 max-w-250 mx-auto">

            { /* User's profile */ }
            <article
            className={cardClasses + " flex-col"}>
              <div
              className="flex gap-2 w-full">
                {
                  user.avatar_url ? (
                    <Image
                    src={user.avatar_url}
                    alt={user.name + "Profile picture"}
                    width={50}
                    height={50}
                    className="rounded-full aspect-square w-15" />
                  ) : (
                    <IconUserCircle
                    size={50}
                    stroke={1}
                    className="aspect-square w-15" />
                  )
                }

                <div
                className="flex flex-col gap-1 w-full">
                  <div
                  className="flex w-full gap-2">
                    <p className="font-medium tracking-wide"> {user.name} </p>
                    {
                      user.plan !== "free" && (
                        <span className="px-4 text-center rounded-full bg-main shadow-xl shadow-main/30 text-sm h-full flex justify-center items-center scale-75"> {user.plan} </span>
                      )
                    }
                  </div>
                  <p className="text-neutral-400 text-sm"> {user.email} </p>
                </div>
              </div>

              <p
              className="text-neutral-400 w-full text-sm">
                Created at: {(new Date(user.created_at!)).toDateString()} <br />
                UUID: {user.id}
              </p>
            </article>

            {/* User's projects */}

            {
              user.teams && (
                <article
                className={cardClasses + " flex flex-col items-center justify-center"}>
                  <p
                  className="text-xl font-medium tracking-wide text-center w-full">
                    {user.name} Projects
                  </p>

                  {
                    user.teams.map((team) => 
                      <div
                      className="w-full rounded-md bg-neutral-900 flex flex-col gap-1 p-2"
                      key={team.team_id}>
                        <p className="text-lg font-medium tracking-wide"> {team.name} </p>
                        <p
                        className="flex gap-2 items-center text-sm">
                          <span
                          className="aspect-square w-1.5 rounded-full block"
                          style={{
                            backgroundColor: (
                              team.status === "Backlog" ? "gray" :
                              team.status === "Planning" ? "sky" :
                              team.status === "In Progress" ? "orange" :
                              team.status === "On Hold" ? "red" :
                              "violet"
                            )
                          }}>

                          </span>

                          {team.status}
                        </p>
                        <p
                        className="text-sm text-neutral-300">
                          {
                            team.description.length > 200 ?
                            team.description.slice(0, 200) + "..." :
                            team.description
                          }
                        </p>
                        
                        <div
                        className="w-full flex gap-2">
                          {
                            team.tags && team.tags.map((tag, index) =>
                              <span
                              className="px-3 py-1 rounded-full text-sm font-light border border-main/50 bg-main/20 text-text/80 w-max cursor-default"
                              key={index}>
                                {tag}
                              </span>
                            )
                          }
                        </div>
                      </div>
                    )
                  }
                </article>
              )
            }

          </section>
        </main>
      </div>
    ) : (
      <LoadingScreen />
    )
  )
}