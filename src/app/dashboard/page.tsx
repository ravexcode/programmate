//Client side
"use client";

//React imports
import { useEffect, useState, useRef, RefObject } from "react";

//Components imports
import SideBar from "@/components/dashboard/sidebar";
import LoadingDashboard from "@/components/screens/loading_dashboard";
import AIChat from "@/components/dashboard/ai_chat";
import CreatorForm from "@/components/forms/creatorForm";
import CreatorInput from "@/components/forms/creatorInputs";
import SnackBar from "@/components/containers/snackbar";

//Modules imports
import { getCookie } from "cookies-next";

//Services imports
import UpdateUserData from "@/services/update.user";

//Types
//Project card
interface ProjectCardProps {
  title: string;
  description: string;
  id: number
}

//Types imports
import { UserData, UserBasic } from "@/types/user.types";
import { getCached } from "@/hooks/cache";

export function ProjectCard({ title, description, id }: ProjectCardProps) {
  return (
    <article 
      className="group relative w-full max-w-sm flex flex-col rounded-xl border border-ultramarine-50/10 bg-neutral-950 p-5 shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-ultramarine-50/30 hover:bg-ultramarine-900/60 hover:shadow-xl hover:shadow-ultramarine-800/40 cursor-pointer"
      onClick={() => {
        window.location.href = `/teams/${id}`
      }}>
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

  //Snackbar
  //Message
  const [ snackBarMessage, setSnackBarMessage ] = useState<string | null>(null);
  //Status
  const [ snackBarIsError, setSnackBarIsError ] = useState<boolean>(false);

  //Containers
  //Project creator
  const project_container : RefObject<null> = useRef(null);

  //Snackbar container
  const snackBar : RefObject<null> = useRef(null);

  //Show snackbar function
  const showSnackBar = (
    message: string,
    isError: boolean
  ) => {
    //Verifies if snackbar is avaible
    if(!snackBar.current) return;

    //Current snackbar
    const current : HTMLElement = snackBar.current;

    //Shows snackbar
    current.classList.remove("hidden");
    //Shows data
    setSnackBarMessage(message);
    setSnackBarIsError(isError);

    //Hides snackbar after 2 seconds
    setTimeout(() => {
      current.classList.add("hidden");
      //Clears snackbar's data
      setSnackBarMessage(message);
      setSnackBarIsError(isError);
    }, 2000)
  }

  //Gets user data
  useEffect(() => {
    //Gets the cached user
    const user = getCached();

    //If there is a cached user, sets the user data
    if(user) {
      setUser(user);
    }

    //Function to update the user data
    async function updateFromToken(){
      //Id isn't cached gets the data
      const token = await getCookie("token") as string;

      if(!token) {
        //If hasn't token returns to log in form
        window.location.href = "/auth/login";
      };

      //Updates the user's data
      UpdateUserData(token);
    }

    //Executes the function
    updateFromToken();
    
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
    showSnackBar(data.message, true);
    setIsLoading(false);
    return;
  }
  return (
    <div className="min-h-screen bg-background grid grid-cols-[auto_1fr] overflow-hidden text-text">
      <AIChat />
      <SnackBar
      message={snackBarMessage}
      isError={snackBarIsError}
      ref={snackBar}/>

      {/* Project creator form */}
      <div
      ref={project_container}
      className="backdrop-brightness-60 backdrop-blur w-screen h-screen fixed top-0 left-0 flex flex-col justify-center items-center z-200 animate-fade-in hidden">
        <CreatorForm
        title="Create a new project"
        action={handleCreateProject}
        hideAction={hideProjectContainer}
        actionIsDisabled={ isLoading || !projectName || projectName.length < 3 || !projectDescription}>
          <CreatorInput
          label="Project name"
          placeholder="My project"
          value={projectName || ""}
          onChange={(e) => setProjectName(e.target.value)}/>

          <CreatorInput
          label="Project description"
          placeholder="Describe your project"
          value={projectDescription || ""}
          onChange={(e) => setProjectDescription(e.target.value)}
          type="textarea"/>

          <div className="w-full">
          <label 
            htmlFor="user-search"
            className="font-light w-full text-sm text-start mb-1 block"
          >
            Search integrants <span className="text-text/60">(by email)</span>
          </label>
          
          {/* SEARCH INPUT CONTAINER */}
          <div className="w-full relative h-max">
            <input
              id="user-search"
              type="text"
              value={searched || ""} // Make input controlled to clear it later
              placeholder="Press Enter to search..."
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setSearched(e.target.value);
              }}
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                // UX: Standard Enter key is much more intuitive than Ctrl+Enter
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (searched && searched.trim().length > 0) {
                    searchUsers();
                  }
                }
              }}
              className="w-full rounded-sm px-3 py-2 pr-10 bg-neutral-800 text-sm focus:outline-none mb-3 text-text/80 focus:ring-1 focus:ring-blue-500 transition-all"
            />

            {/* SEARCH ICON */}
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 -mt-1.5 p-1 hover:bg-neutral-700 rounded-sm transition-colors"
              onClick={() => {
                if (!searched || searched.trim().length < 1) return;
                searchUsers();
              }}
              aria-label="Search users"
            >
              <img
                src="/icons/buttons/search.svg"
                alt="Search icon"
                className="aspect-square w-4 cursor-pointer opacity-70 hover:opacity-100"
              />
            </button>

            {/* DROPDOWN RESULTS */}
            {found && found.length > 0 && (
              <section className="absolute w-full text-sm py-1 bg-zinc-900 top-full left-0 z-50 rounded-md shadow-lg border border-neutral-800 max-h-48 overflow-y-auto">
                {found.map((data: any) => {
                  // Prevent showing the current user or already added integrants in the search results
                  const isAlreadyAdded = integrants?.some(i => i.email === data.email);
                  if (data.email === user?.email || isAlreadyAdded) return null;

                  return (
                    <div
                      key={data.id}
                      className="w-full px-3 text-start hover:bg-neutral-800 py-2 cursor-pointer transition-colors flex flex-col"
                      onClick={() => {
                        // Add user
                        setIntegrants(prev => [
                          ...(prev ?? []), 
                          {
                            id: data.id,
                            email: data.email,
                            username: data.display_name
                          }
                        ]);
                        
                        // UX: Clear the search state and input after selection
                        setFound(undefined);
                        setSearched(""); 
                      }}
                    >
                      <span className="font-medium text-text/90">{data.display_name}</span>
                      <span className="text-xs text-text/50">{data.email}</span>
                    </div>
                  );
                })}
              </section>
            )}
          </div>

          {/* SELECTED USERS LIST */}
          <div className="w-full rounded-sm p-3 bg-neutral-950/50 text-sm mb-10 border border-neutral-900/50">
            <h4 className="text-text/50 text-xs mb-2 uppercase tracking-wider">Team Members</h4>
            
            <div className="flex flex-col gap-2">
              {/* Current User */}
              <div className="flex items-center justify-between text-text/80 bg-neutral-900/50 px-3 py-2 rounded-sm cursor-default">
                <div>
                  <span className="font-medium">{user?.name}</span>
                  <span className="text-text/40 ml-2 text-xs">({user?.email})</span>
                </div>
                <span className="text-text/30 text-xs font-medium px-2 py-1 bg-neutral-800 rounded-sm">You</span>
              </div>

              {/* Added Integrants */}
              {integrants && integrants.map((data) => (
                data.email !== user?.email && (
                  <div 
                    key={data.id} 
                    className="flex items-center justify-between text-text/80 bg-neutral-800/40 px-3 py-2 rounded-sm"
                  >
                    <div>
                      <span className="font-medium">{data.username}</span>
                      <span className="text-text/40 ml-2 text-xs">({data.email})</span>
                    </div>
                    
                    {/* UX: Allow users to undo/remove a selection */}
                    <button
                      onClick={() => {
                        setIntegrants(prev => prev?.filter(i => i.id !== data.id));
                      }}
                      className="text-red-400/70 hover:text-red-400 text-xs font-medium px-2 py-1 hover:bg-red-400/10 rounded-sm transition-colors"
                      aria-label={`Remove ${data.username}`}
                    >
                      Remove
                    </button>
                  </div>
                )
              ))}
            </div>
          </div>
        </div>
        </CreatorForm>
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
                <div className="absolute left-1/2 top-0 aspect-square block w-200 -translate-x-1/2 -translate-y-1/2 rounded-full bg-main/40 blur-3xl animate-pulse" />
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
                    const token = await getCookie("token") as string;

                    await UpdateUserData(token);
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

                  <div className={user.teams && user.teams.length >= 1 ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "flex flex-col justify-center items-center"}>
                    {
                      user.teams && user.teams.length >= 1 ? user.teams.map((team : any, index) => (
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