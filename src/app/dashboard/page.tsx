//Client side
"use client";

//React imports
import { useEffect, useState, useRef, RefObject } from "react";

//Components imports
import SideBar from "@/components/dashboard/sidebar";
import LoadingDashboard from "@/components/screens/loading_dashboard";
import AIChat from "@/components/dashboard/ai_chat";

//Modules imports
import { getCookie } from "cookies-next";
import { deleteCookie } from "cookies-next/client";

//Types
//Project card
interface ProjectCardProps {
  title: string;
  description: string;
  id: number
}
//User
interface UserBasic {
  id: string,
  email: string,
  username: string
}
//User data type
interface UserData {
  id: string,
  email: string,
  name: string,
  plan: string,
  teams: Array<Object | null>,
  ai_chat: Array<{
    sent_by: string,
    message: string
  }>
}

export function ProjectCard({ title, description, id }: ProjectCardProps) {
  return (
    <article 
      className="group relative w-full max-w-sm flex flex-col rounded-xl border border-ultramarine-50/10 bg-neutral-950 p-5 shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-ultramarine-50/30 hover:bg-ultramarine-900/60 hover:shadow-xl hover:shadow-ultramarine-800/40 cursor-pointer"
      onClick={() => {
        window.location.href = `/teams/${id}`
      }}
      key={id}
    >
      <header className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-text tracking-tight line-clamp-1">
          {title}
        </h3>
        
        <button 
          aria-label="Opciones del proyecto"
          className="flex h-8 w-8 -mr-2 -mt-2 items-center justify-center rounded-full text-text hover:bg-ultramarine-50/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-ultramarine-400"
          onClick={(e) => e.stopPropagation()}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="1"></circle>
            <circle cx="12" cy="5" r="1"></circle>
            <circle cx="12" cy="19" r="1"></circle>
          </svg>
        </button>
      </header>

      <p className="text-sm text-text/60 line-clamp-3 leading-relaxed">
        {description}
      </p>
      
      <div className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-br from-ultramarine-400/0 via-ultramarine-400/0 to-ultramarine-400/0 transition-colors duration-500 group-hover:from-ultramarine-400/5"></div>
    </article>
  )
}

export default function Dashboard(){
  //State values
  //User data
  const [ user, setUser ] = useState<UserData>();
  //Is reloading button
  const [ isReloading, setIsReloading ] = useState<boolean>(false);

  //Projects form
  //Users searched
  const [ searched, setSearched ] = useState<string | undefined>();
  //Integrants
  const [ integrants, setIntegrants ] = useState<Array<UserBasic> | undefined>();
  //Users found
  const [ found, setFound ] = useState<Array<UserBasic> | undefined>();
  //Project name
  const [ projectName, setProjectName ] = useState<string | undefined>();
  //Project description
  const [ projectDescription, setProjectDescription ] = useState<string | undefined>();
  //Loading button state
  const [ isLoading, setIsLoading ] = useState<boolean>(false);

  //Containers
  //Project creator
  const project_container : RefObject<null> = useRef(null);


  //Function to update user's data
  const updateUserData = async(token: any) => {
    //Fetch to user api
    const res = await fetch(`/api/users/me/${token}`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        "x-api-key": process.env.NEXT_PUBLIC_API_KEY || "",
      }
    });

    //Gets the user data
    const data = await res.json();
    
    //Verifies if status is OK
    if(res.status !== 200) {
      //If there's an error
      //Deletes token auth
      deleteCookie("token");
      //Deletes cache
      localStorage.clear();
      //Returns to log in page
      window.location.href = "/auth/login";
    }

    //Else continues with the code
    //Set identity (Github)
    const identity = data.user.identities[0];
    //Plan default
    let plan : string = "Free";
    //Teams
    let teams : Array<Object | null> = [];

    //Payments section
    if(data.payments && data.payments.length >= 1) {
      //Gets the latest payment
      const lastPayment = data.payments[data.payments.length - 1]; //Minus 1 because the array is 1 spot before the data
      //Expiration date
      const expires = new Date(lastPayment.paid_at);
      //Now
      const now = new Date();

      //Verifies if the payment isn't expired
      if(now <= expires) {
        //Plan
        plan = lastPayment.plan;
        //Deletes the "" ("pro" -> pro)
        plan = plan.replaceAll('"', '');
        //First letter to capital (pro -> Pro)
        plan = plan.charAt(0).toUpperCase() + plan.slice(1);
      }
    }
    
    //Teams updater
    if(data.teams && data.teams.length >= 1) {
      teams = data.teams;
    }

    //Updates the user
    setUser({
      "id": data.user.id,
      "email": identity.email,
      "name": identity.identity_data.name || data.user.user_metadata.username, //GitHub or Google
      "plan": plan,
      "teams": teams,
      "ai_chat": data.ai_chat,
    });

    //User sent to caché
    localStorage.setItem("user", JSON.stringify({
      "id": data.user.id,
      "email": identity.email,
      "name": identity.identity_data.name || data.user.user_metadata.username,
      "plan": plan,
      "teams": teams,
      "ai_chat": data.ai_chat,
    }));
    //Returns as success
    return;
  }

  //Gets user data
  useEffect(() => {
    //User cached (can be null)
    const user_cached : string | null = localStorage.getItem("user");

    //Verifies if is cached
    if(user_cached) {
      //If is cached parses to JSON
      const user_cached_parsed : UserData = JSON.parse(user_cached);

      //Sets the user cached
      setUser(user_cached_parsed);

      //Returns success
    }

    //Id isn't cached gets the data
    const token = getCookie("token");

    if(!token) {
      //If hasn't token returns to log in form
      window.location.href = "/auth/login";
    };

    //Updates the user's data
    updateUserData(token);
    //Returns success
    return;
  }, []);

  //Function to show the proyect container
  const showProjectContainer = () => {
    //Verfies if exists
    if(!project_container.current) return;
    //Change loading state
    setIsLoading(false);
    //Clear all the inputs
    setFound(undefined);
    setSearched(undefined);
    setIntegrants(undefined);
    setProjectName(undefined);
    setProjectDescription(undefined);

    //Current container
    const current : HTMLElement = project_container.current;

    //Shows
    current.classList.remove("hidden");
  };

  //And function for hiding
  const hideProjectContainer = () => {
    //Returns if it doesb't exists
    if(!project_container.current) return;

    //Current
    const current : HTMLElement = project_container.current;

    //Hides
    current.classList.add("hidden");
  };

  //User searcher
  const searchUsers = async() => {
    //Fetch the api with user data
    const res = await fetch(`/api/users/search/${searched}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.NEXT_PUBLIC_API_KEY || "",
      }
    });

    //Data from res
    const data = await res.json();

    //If success sets the users
    if(res.status === 200) {
      setFound(data.users);
    }

    //Else, returns error
    return;
  }

  //Project creator
  const handleCreateProject = async(e: any) => {
    //Prevents premature reloads
    e.preventDefault();
    setIsLoading(true);

    //Id isn't cached gets the data
    const token = await getCookie("token") as string;

    if(!token) {
      //If hasn't token returns to log in form
      window.location.href = "/auth/login";
    };

    //Insert user to integrants if not exists
    const integrants_created = integrants ?? [];
    integrants_created.push({
      id: user?.id || "",
      email: user?.email || "",
      username: user?.name || ""
    });

    //Fetchs to api
    const res = await fetch("/api/teams", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.NEXT_PUBLIC_API_KEY || "",
        "Authorization": token,
      },
      body: JSON.stringify({
        name: projectName,
        description: projectDescription,
        integrants: integrants_created
      })
    });

    //Handles the response
    const data = await res.json();

    //If success, returns the data
    if(res.status === 200) {
      //Updates the user data
      setUser(prev => prev ? {
        ...prev,
        teams: [ ...(prev.teams ?? []), data.team ]
      } : prev);

      //Hides the form
      hideProjectContainer();
      //Change loading state
      setIsLoading(false);
      //Clear all the inputs
      setFound(undefined);
      setSearched(undefined);
      setIntegrants(undefined);
      setProjectName(undefined);
      setProjectDescription(undefined);

      //Returns success
      return;
    }

    //Else, returns error
    console.error(data)
    setIsLoading(false);
    return;
  }
  return (
    <div className="min-h-screen bg-background grid grid-cols-[auto_1fr] overflow-hidden text-text">
      <AIChat />

      {/* Project creator form */}
      <div
      ref={project_container}
      className="backdrop-brightness-60 backdrop-blur w-screen h-screen fixed top-0 left-0 flex flex-col justify-center items-center z-200 animate-fade-in hidden">
        <form
        onSubmit={(e: any) => {
          handleCreateProject(e)
        }}
        className="animate-fade-in-up w-100 bg-neutral-900 rounded-lg px-6 py-4 flex flex-col justify-center items-center">

          <h2
          className="text-lg w-full text-start mb-3">
            Create a new project
          </h2>

          <label
          className="font-light w-full text-sm text-start mb-1">
            Insert your project's name <span className="text-red-600">*</span>
          </label>
          <input
          required
          type="text"
          className="w-full rounded-sm px-3 py-2 bg-neutral-800 text-sm focus:outline-none mb-3 text-text/80"
          onChange={(e) => {
            setProjectName(e.target.value);
          }}/>

          <label
          className="font-light w-full text-sm text-start mb-1">
            Insert your project's description
          </label>
          <textarea
          required
          className="w-full rounded-sm px-3 py-2 bg-neutral-800 text-sm focus:outline-none mb-3 overflow-y-auto min-h-20 h-20 max-h-50 text-text/80"
          onChange={(e) => {
            setProjectDescription(e.target.value);
          }}/>

          <label
          className="font-light w-full text-sm text-start mb-1">
            Search integrants <span className="text-text/60">(by email)</span>
          </label>
          <div
          className="w-full relative h-max">
            <input
            type="text"
            placeholder="Ctrl + Enter"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const value = e.target.value;
              setSearched(value)
            }}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.ctrlKey && e.key === "Enter") {
                e.preventDefault();
                if(searched) {
                  searchUsers();
                }
              }
            }}
            className="w-full rounded-sm px-3 py-2 bg-neutral-800 text-sm focus:outline-none mb-3 text-text/80"/>

            {
              found && found.length >= 1 && (
                <section
                className="absolute w-full text-sm py-2 bg-zinc-900 top-2/3 z-3">
                  {
                    found.map((data : any, index) => 
                      data.email !== user?.email &&(
                      <p
                      key={index}
                      className="w-full px-3 text-start hover:backdrop-brightness-120 py-2 cursor-pointer"
                      onClick={() => {
                        setIntegrants(prev => [ ...(prev ?? []), {
                          id: data.id,
                          email: data.email,
                          username: data.display_name
                        } ]);

                        setFound(undefined);
                      }}>
                        { data.email }
                      </p>
                    ))
                  }
                </section>
              )
            }

            <img
            src="/icons/buttons/search.svg"
            alt="Icon made by RavexCode"
            className="aspect-square w-4 absolute right-2 top-1/5 cursor-pointer"
            onClick={() => {
              if(!searched || searched.length < 1) return;
              searchUsers();
            }}/>
          </div>

          <div
          className="w-full rounded-sm px-3 py-2 bg-neutral-950/50 text-sm focus:outline-none mb-10 text-text/80 cursor-default">
            { user?.name } <span className="text-text/30">(You)</span> <br />
            {
              integrants && integrants.length >= 1 &&
                integrants.map((data, index) =>
                  data.email !== user?.email && (
                    <p
                    key={index}
                    className="text-wrap">
                      { data.username } <span className="text-text/30">({data.email})</span> <br />
                    </p>
                  )
                )
            }
          </div>

          <div className="flex w-full justify-end items-center gap-4">
            <button type="button"
            onClick={() => {
              hideProjectContainer();
            }}
            className="px-4 py-1 rounded-md bg-neutral-800 duration-200 hover:brightness-80 cursor-pointer">
              Cancel
            </button>

            <button type="submit"
            className="px-4 py-1 rounded-md bg-main duration-200 hover:brightness-80 cursor-pointer disabled:bg-main/50 disabled:cursor-wait"
            disabled={ isLoading || !projectName || projectName.length < 3 || !projectDescription}>
              Create
            </button>
          </div>
        </form>
      </div>


      {/* Main container */}
      {
        user && user.email ? (
          <>
            <SideBar email={user.email} />
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
                <div className="absolute left-1/2 top-0 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-main/10 blur-[100px] animate-pulse" />
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
                  className="text-sm p-2 border-2 border-ultramarine-50/30 rounded-md cursor-pointer duration-300 hover:brightness-120 hover:scale-105 h-max my-auto disabled:hover:brightness-80 disabled:hover:bg-transparent disabled:hover:scale-100 disabled:brightness-80 disabled:cursor-wait"
                  disabled={isReloading}
                  onClick={ async(e) => {
                    setIsReloading(true);
                    const token = await getCookie("token");

                    await updateUserData(token);
                    setIsReloading(false);
                  }}>
                    <img
                    src="/icons/buttons/reload.svg"
                    alt="Icon made by RavexCode"
                    className="aspect-square block w-5"/>
                  </button>
                </header>
                
                <section className="flex flex-col gap-6">
                  
                  <div className="flex w-full items-center justify-between">
                    <h3 className="text-xl font-semibold tracking-tight text-white/90">
                      Projects
                    </h3>

                    <button
                    className="flex items-center gap-2 bg-main px-4 py-2 text-sm font-medium text-white rounded-lg transition-all duration-300 hover:bg-main/80 focus:outline-none focus:ring-2 focus:ring-main/50 focus:ring-offset-2 focus:ring-offset-background active:scale-95 cursor-pointer"
                    onClick={() => {
                      showProjectContainer()
                    }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg>
                      Create new
                    </button>
                  </div>

                  <div className={user.teams.length >= 1 ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "flex flex-col justify-center items-center"}>
                    {
                      user.teams.length >= 1 ? user.teams.map((team : any, index) => (
                        <ProjectCard
                        key={ index }
                        id={ team.team_id }
                        title={ team.name }
                        description={ team.description }/>
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