//Client
"use client";

//React imports
import { useEffect, useState, useRef, RefObject, ChangeEvent } from "react";

//Components imports
import SideBar from "@/components/containers/sidebar";
import { getCookie } from "cookies-next";
import LoadingDashboard from "@/components/screens/loading_dashboard";

interface ProjectCardProps {
  title: string;
  description: string;
  id: number
}

interface User {
  id: string,
  email: string,
  username: string
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
  //User's data
  const [ user, setUser ] = useState({
    email: "",
    name: "",
    plan: "",
    teams: [{}] as Array<Object | null>
  });
  //User's searched and integrants
  const [ searched, setSearched ] = useState<string | undefined>();
  const [ integrants, setIntegrants ] = useState<Array<User> | undefined>();
  const [ founded, setFounded ] = useState<Array<User> | undefined>();

  const container : RefObject<null> = useRef(null);

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
    if(res.status === 200) {
      const identity = data.user.identities[0];
      let plan : string = "Free";
      let teams : Array<Object | null> = [];

      if(data.payments && data.payments.length >= 1) {
        const lastPayment = data.payments[data.payments.length - 1]; //Minus 1 because the array is 1 spot before the data
        const expires = new Date(lastPayment.paid_at);
        const now = new Date();

        if(now <= expires) {
          plan = lastPayment.plan;
          plan = plan.replaceAll('"', '');
          plan = plan.charAt(0).toUpperCase() + plan.slice(1);
        }
      }

      teams = [
        {
          name: "PrismaFlow",
          description: "SaaS project made for making a better experience doing user's projects",
        }
      ];
      
      if(data.teams && data.teams.length >= 1) {
        teams = data.teams;
      }

      setUser({
        "email": identity.email,
        "name": identity.identity_data.name || data.user.user_metadata.username,
        "plan": plan,
        "teams": teams
      });
      return;
    }

    window.location.href = "/auth/login";
  }

  useEffect(() => {
    const token = getCookie("token");
    if(!token) return;
    updateUserData(token);
  }, []);

  const showForm = () => {
    if(!container.current) return;
    setFounded(undefined);
    setSearched(undefined);
    setIntegrants(undefined)

    const current : HTMLElement = container.current;

    current.classList.remove("hidden");
  };

  const hideForm = () => {
    if(!container.current) return;

    const current : HTMLElement = container.current;

    current.classList.add("hidden");
  };

  const searchUsers = async() => {
    const res = await fetch(`/api/users/search/${searched}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.NEXT_PUBLIC_API_KEY || "",
      }
    });

    const data = await res.json();

    if(res.status === 200) {
      setFounded(data.users);
    }

    return;
  }

  const handleCreateProject = async(e: any) => {
    e.preventDefault();
  }

  return (
    <div className="min-h-screen bg-background grid grid-cols-[auto_1fr] overflow-hidden text-text">

      <div
      ref={container}
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
          className="w-full rounded-sm px-3 py-2 bg-neutral-800 text-sm focus:outline-none mb-3 text-text/80"/>

          <label
          className="font-light w-full text-sm text-start mb-1">
            Insert your project's description
          </label>
          <textarea
          required
          className="w-full rounded-sm px-3 py-2 bg-neutral-800 text-sm focus:outline-none mb-3 overflow-y-auto min-h-20 h-20 max-h-50 text-text/80"
          maxLength={20}/>

          <label
          className="font-light w-full text-sm text-start mb-1">
            Search integrants <span className="text-text/60">(by email)</span>
          </label>
          <div
          className="w-full relative h-max">
            <input
            required
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
            onBlur={() => {
              setFounded(undefined);
            }}
            className="w-full rounded-sm px-3 py-2 bg-neutral-800 text-sm focus:outline-none mb-3 text-text/80"/>

            {
              founded && founded.length >= 1 && (
                <section
                className="absolute w-full text-sm py-2 bg-zinc-900 top-2/3 z-3">
                  {
                    founded.map((data : any, index) => 
                      data.email !== user.email &&(
                      <p
                      key={index}
                      className="w-full px-3 text-start hover:backdrop-brightness-120 py-2 cursor-pointer"
                      onClick={() => {
                        setIntegrants(prev => [ ...(prev ?? []), {
                          id: data.id,
                          email: data.email,
                          username: data.display_name
                        } ])
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
            { user.name } <span className="text-text/30">(You)</span> <br />
            {
              integrants && integrants.length >= 1 &&
                integrants.map((data, index) => (
                  <p
                  key={index}>
                    { data.username } <br />
                  </p>
                ))
            }
          </div>

          <div className="flex w-full justify-end items-center gap-4">
            <button type="button"
            onClick={() => {
              hideForm();
            }}
            className="px-4 py-1 rounded-md bg-neutral-800 duration-200 hover:brightness-80 cursor-pointer">
              Cancel
            </button>

            <button type="submit"
            className="px-4 py-1 rounded-md bg-main duration-200 hover:brightness-80 cursor-pointer">
              Create
            </button>
          </div>
        </form>
      </div>


      {
        user && user.email ? (
          <>
            <SideBar email={user.email} />
            <main className="relative flex flex-col h-screen overflow-y-auto px-4 py-8 md:px-8 md:py-10 animate-fade-in">
              {
                user.plan && (
                  <span
                  className="fixed right-5 top-5 text-sm px-5 py-1 bg-main shadow-lg shadow-main/30 rounded-full cursor-default">
                    { user.plan }
                  </span>
                )
              }

              <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
                <div className="absolute left-1/2 top-0 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-main/10 blur-[100px] animate-pulse" />
              </div>

              <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col gap-10">
                
                <header className="flex flex-col gap-2">
                  <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
                    Welcome back, {user.name}!
                  </h2>
                  <p className="text-text/70 text-sm md:text-base">
                    There are your recent projects
                  </p>
                </header>
                
                <section className="flex flex-col gap-6">
                  
                  <div className="flex w-full items-center justify-between">
                    <h3 className="text-xl font-semibold tracking-tight text-white/90">
                      Projects
                    </h3>

                    <button
                    className="flex items-center gap-2 bg-main px-4 py-2 text-sm font-medium text-white rounded-lg transition-all duration-300 hover:bg-main/80 focus:outline-none focus:ring-2 focus:ring-main/50 focus:ring-offset-2 focus:ring-offset-background active:scale-95 cursor-pointer"
                    onClick={() => {
                      showForm()
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