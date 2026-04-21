//Client side
"use client";

//Table icons imports
import {
  IconPlus,
  IconSearch,
  IconTrash,
  IconPencil,
  IconDotsVertical,
  IconReload } from "@tabler/icons-react";

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
  id: number;
  menuIndex: number | null;
  hideMenu: () => void;
  showMenu: () => void;
  index: number;
  status: string;
  tags: Array<string>;
  key: number;
}

//Types imports
import { UserData, UserBasic } from "@/types/user.types";
import { getCached } from "@/hooks/cache";

export function ProjectCard(props : ProjectCardProps) {
  return (
    <article 
      className="group relative w-full flex flex-col rounded-xl border border-ultramarine-50/10 bg-neutral-950 p-5"
      onClick={() => {
        window.location.href = `/teams/${props.id}`
      }}
      key={ "team_" + props.key }>
      <header className="flex items-start justify-between mb-3">
        <div
        className="w-full flex flex-col gap-1">
          <h3 className="text-lg font-semibold text-text">
            {props.title}
          </h3>
          <p
          className="text-sm font-extralight flex justify-start items-center gap-2">
            <span
            className={"h-2 w-2 rounded-full block " + ( props.status === "Backlog" ? "bg-zinc-500" : props.status === "Planning" ? "bg-blue-400" : props.status === "In Progress" ? "bg-orange-400" : props.status === "On Hold" ? "bg-red-400" : "bg-purple-500" )}></span>
            {props.status}
          </p>
        </div>
        
        <button
          className="flex h-8 w-8 -mr-2 -mt-2 items-center justify-center rounded-full text-text hover:bg-ultramarine-50/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-ultramarine-400 cursor-pointer"
          onClick={(e) => {
            e.nativeEvent.stopImmediatePropagation();
            e.stopPropagation();
            props.showMenu();
          }}>
          <IconDotsVertical
          size={16}
          color="white"
          stroke={3}/>
        </button>

        { props.menuIndex === props.index && (
          <div className="absolute right-2 top-10 z-20 w-36 overflow-hidden rounded-lg border border-ultramarine-50/10 bg-neutral-900 shadow-xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-200">
            <button
            onClick={(e) => {
              e.nativeEvent.stopImmediatePropagation(); 
              e.stopPropagation();
              props.hideMenu();
            }}
            className="flex w-full items-center px-4 py-2.5 text-sm text-text transition-colors hover:bg-ultramarine-800 gap-2">

            <IconPencil
            size={20}
            color="white" />

            Edit
          </button>
          
          <button
          onClick={(e) => {
            e.nativeEvent.stopImmediatePropagation(); 
            e.stopPropagation();
            props.hideMenu();
          }}
          className="flex w-full items-center px-4 py-2.5 text-sm text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-200 gap-2">

            <IconTrash
            size={20}
            stroke={1} />

            Delete
          </button>
          </div>
      )}
      </header>

      <p className="text-sm text-text/60 line-clamp-3 leading-relaxed">
        {props.description}
      </p>
      
      <div
      className="flex gap-2 mt-2">
        {
          props.tags && props.tags.map(tag => (
            <div
            className="px-3 py-1 rounded-full text-sm font-light border border-main/50 bg-main/20 text-text/80 w-max cursor-default">
              {tag}
            </div>
          ))
        }
      </div>
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

  //Projects options state
  const [ openMenuIndex, setOpenMenuIndex ] = useState<number | null>(null);

  //Containers
  //Project creator
  const project_container : RefObject<null> = useRef(null);

  //Snackbar container
  const snackBar : RefObject<null> = useRef(null);

  //Function for hide the menu of projects when user clicks outside
  useEffect(() => {
    //Function for close menu
    const closeMenu = () => {
      //Menu index
      setOpenMenuIndex(null);
      return;
    }
    
    //Event that listens the click
    document.addEventListener("click", closeMenu);
    
    //Remove the event listener
    return () => document.removeEventListener("click", closeMenu);
  }, []);

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
      const user = await UpdateUserData(token);
      if(user) {
        setUser(user)
      }
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

  //Verifies if user is new
  useEffect(() => {
    //Verifies if exists
    if(!user) return;

    //Created at to Date
    const created_at = new Date(user.created_at!);
    //Date now
    const now = new Date();

    //Verifies if the sign up dat and now have the same day value, and teams don't exists
    if(created_at.getDay() === now.getDay() && user.teams?.length! <= 0) {
      window.location.href = "/get-started";
    }
  }, [user]);

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
          
          <div className="w-full relative h-max">
            <input
              id="user-search"
              type="text"
              value={searched || ""}
              placeholder="Press Enter to search..."
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setSearched(e.target.value);
              }}
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (searched && searched.trim().length > 0) {
                    searchUsers();
                  }
                }
              }}
              className="w-full rounded-sm px-3 py-2 pr-10 bg-neutral-800 text-sm focus:outline-none mb-3 text-text/80 focus:ring-1 focus:ring-blue-500 transition-all"
            />

            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 -mt-1.5 p-1 hover:bg-neutral-700 rounded-sm transition-colors"
              onClick={() => {
                if (!searched || searched.trim().length < 1) return;
                searchUsers();
              }}
              aria-label="Search users"
            >
              <IconSearch
              size={16}
              color="white"
              stroke={2}/>
            </button>

            {found && found.length > 0 && (
              <section className="absolute w-full text-sm py-1 bg-zinc-900 top-full left-0 z-50 rounded-md shadow-lg border border-neutral-800 max-h-48 overflow-y-auto">
                {found.map((data: any) => {
                  const isAlreadyAdded = integrants?.some(i => i.email === data.email);
                  if (data.email === user?.email || isAlreadyAdded) return null;

                  return (
                    <div
                      key={data.id}
                      className="w-full px-3 text-start hover:bg-neutral-800 py-2 cursor-pointer transition-colors flex flex-col"
                      onClick={() => {
                        setIntegrants(prev => [
                          ...(prev ?? []), 
                          {
                            id: data.id,
                            email: data.email,
                            username: data.display_name
                          }
                        ]);
                        
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
                    
                    <button
                      onClick={() => {
                        setIntegrants(prev => prev?.filter(i => i.id !== data.id));
                      }}
                      className="text-red-400/70 hover:text-red-400 text-xs font-medium px-2 py-1 hover:bg-red-400/10 rounded-sm transition-colors"
                      aria-label={`Remove ${data.username}`}>
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
                  className="text-sm py-2 px-6 border-2 border-ultramarine-50/30 rounded-full cursor-pointer duration-300 hover:border-ultramarine-50/60 h-max w-max flex gap-2 text-lg my-auto disabled:hover:brightness-80 disabled:hover:bg-transparent disabled:hover:scale-100 disabled:brightness-80 disabled:cursor-wait"
                  disabled={isReloading}
                  onClick={ async(e) => {
                    setIsReloading(true);
                    const token = await getCookie("token") as string;

                    await UpdateUserData(token);
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

                    <button
                    className="flex items-center gap-2 bg-main px-6 py-2 text-sm font-medium text-white rounded-full transition-all duration-300 hover:bg-main/80 focus:outline-none active:scale-95 cursor-pointer"
                    onClick={() => {
                      showProjectContainer()
                    }}>
                      <IconPlus
                      color="white"
                      size={16}
                      stroke={2.5}/>
                      Create new
                    </button>
                  </div>

                  <div className={user.teams && user.teams.length >= 1 ? "grid grid-cols-1 lg:grid-cols-2 gap-6" : "flex flex-col justify-center items-center"}>
                    {
                      user.teams && user.teams.length >= 1 ? user.teams.map((team : any, index) => (
                        <ProjectCard
                        key={ index }
                        id={ team.team_id }
                        title={ team.name }
                        description={ team.description }
                        index={ index }
                        hideMenu={ () => {
                          setOpenMenuIndex(null)
                        } }
                        showMenu={ () => {
                          setOpenMenuIndex(prev => prev === index ? null : index);
                        } }
                        menuIndex={ openMenuIndex! }
                        status={team.status}
                        tags={ team.tags }/>
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