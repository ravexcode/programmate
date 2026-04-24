//Client side
"use client";

//Table icons imports
import {
  IconPlus,
  IconSearch,
  IconTrash,
  IconPencil,
  IconDotsVertical,
  IconReload, 
  IconAssembly} from "@tabler/icons-react";

//React imports
import { useEffect, useState, useRef, RefObject } from "react";

//Components imports
import SideBar from "@/components/ui/sidebar";
import LoadingDashboard from "@/components/screens/loading_dashboard";
import AIChat from "@/components/ui/ai_chat";
import CreatorForm from "@/components/forms/creatorForm";
import CreatorInput from "@/components/forms/creatorInputs";
import SnackBar, { type SnackbarRef } from "@/components/ui/snackbar";

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
  deleteProjectHandler: () => void;
  editProjectHandler: () => void;
}

//Types imports
import { UserData, UserBasic } from "@/types/user.types";
import { getCached } from "@/hooks/cache";

function ProjectCard(props : ProjectCardProps) {
  //Delete enabled/disabled state
  const [ isDeleteDisabled, setIsDeleteDisabled ] = useState<boolean>(false);

  return (
    <article 
      className="group relative w-full flex flex-col rounded-xl border border-ultramarine-50/10 bg-neutral-950 p-5"
      onClick={() => {
        window.location.href = `/teams/${props.id}`
      }}>
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
              props.editProjectHandler();
              props.hideMenu();
            }}
            className="flex w-full items-center px-4 py-2.5 text-sm text-text transition-colors hover:bg-ultramarine-800 gap-2">

            <IconPencil
            size={20}
            color="white" />

            Edit
          </button>
          
          <button
          onClick={async (e) => {
            e.nativeEvent.stopImmediatePropagation(); 
            e.stopPropagation();
            setIsDeleteDisabled(true);
            await props.deleteProjectHandler();
            setIsDeleteDisabled(false);
            props.hideMenu();
          }}
          className="flex w-full items-center px-4 py-2.5 text-sm text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-200 gap-2 disabled:brightness-80 disabled:cursor-wait"
          disabled={isDeleteDisabled}>

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
          props.tags && props.tags.map((tag: string, index) => (
            <div
            className="px-3 py-1 rounded-full text-sm font-light border border-main/50 bg-main/20 text-text/80 w-max cursor-default"
            key={ index }>
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
  //Status selector
  const [status, setStatus] = useState("Backlog");
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  //Tags
  const [ tags, setTags ] = useState<Array<string>>([]);
  //Current tag
  const [ currentTag, setCurrentTag ] = useState<string | null>(null);

  //Projects options state
  const [ openMenuIndex, setOpenMenuIndex ] = useState<number | null>(null);

  //Project edit state
  //Team that will be edited
  const [ editTeamId, setEditTeamId ] = useState<number | null>(null);
  //New name
  const [ newTeamName, setNewTeamName ] = useState<string>("");
  //New description
  const [ newTeamDescription, setNewTeamDescription ] = useState<string>("");
  //New tags
  const [ newTeamTags, setNewTeamTags ] = useState<Array<string>>([]);
  //New current tags
  const [ newTeamCurrentTag, setNewTeamCurrentTag ] = useState<string>("");
  //Loading status
  const [ newTeamFormIsLoading, setNewTeamFormIsLoading ] = useState<boolean>(false);
  //Team selected data
  const [ selectedTeamData, setSelectedTeamData ] = useState<any>();
  //New status
  const [ newTeamStatus, setNewTeamStatus ] = useState<string>();



  //Containers
  //Project creator
  const project_container : RefObject<null> = useRef(null);

  //Snackbar container
  const snackbarRef = useRef<SnackbarRef>(null);

  //Project editor
  const project_edit_container : RefObject<null> = useRef(null);

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
        integrants: integrants_created,
        status,
        tags
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
      setFound([]);
      setSearched(undefined);
      setIntegrants([]);
      setProjectName("");
      setProjectDescription("");
      setStatus("Backlog");
      setTags([]);

      //Returns success
      return;
    }

    //Else, returns error
    snackbarRef.current?.showSnackBar(data.message, true);
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
  
  //Status options for project
  const statusOptions = [
    { value: "Backlog", label: "Backlog", color: "bg-zinc-500" },
    { value: "Planning", label: "Planning", color: "bg-blue-400" },
    { value: "In Progress", label: "In Progress", color: "bg-orange-400" },
    { value: "On Hold", label: "On Hold", color: "bg-red-400" },
    { value: "Done", label: "Done", color: "bg-purple-500" },
  ];

  //Delete selected Project
  const deleteProject = async(id: number, index: number) => {
    const token = await getCookie("token") as string;

    try {
      //Makes the request
      const res = await fetch(`/api/teams/${id}`, {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
          "Authorization": token!
        }
      });

      //Data got
      const data = await res.json();

      //Status OK
      if(res.status === 200) {
        //Gets user from cache
        const user_cached = JSON.parse(window.localStorage.getItem("user")!);

        //Deletes the team
        user_cached.teams.splice(index, 0);

        //Updates user data
        const updated = await UpdateUserData(token!);
        setUser(updated);

        //Success return
        return;
      }

      //Error handler
      snackbarRef.current?.showSnackBar(data.message!, true);
      return;
    } catch(e: any) {
      console.log(e);
      snackbarRef.current?.showSnackBar(e.message, true);
      return;
    }
  };

  //Show / hide edit form
  //Function to show the proyect container
  const showEditProjectContainer = () => {
    //Verfies if exists
    if(!project_edit_container.current) return;
    //Change states

    //Current container
    const current : HTMLElement = project_edit_container.current;

    //Shows
    current.classList.remove("hidden");
  };

  //And function for hiding
  const hideEditProjectContainer = () => {
    //Returns if it doesb't exists
    if(!project_edit_container.current) return;

    //Current
    const current : HTMLElement = project_edit_container.current;

    //Hides
    current.classList.add("hidden");
  };

  //Function for update team
  const updateTeam = async() => {
    const token = await getCookie("token") as string;

    try {
      //Makes the request
      const res = await fetch(`/api/teams`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
          "Authorization": token!
        },
        body: JSON.stringify({
          teamId: editTeamId,
          newName: newTeamName,
          newDescription: newTeamDescription,
          newStatus: newTeamStatus,
          newTags: newTeamTags
        })
      });

      //Data got
      const data = await res.json();

      //Status OK
      if(res.status === 200) {
        //Updates user data
        const updated = await UpdateUserData(token!);
        setUser(updated);

        //Success return
        return;
      }

      //Error handler
      snackbarRef.current?.showSnackBar(data.message!, true);
      return;
    } catch(e: any) {
      console.log(e);
      snackbarRef.current?.showSnackBar(e.message, true);
      return;
    }
  }

  return (
    <div className="min-h-screen bg-background grid grid-cols-[auto_1fr] overflow-hidden text-text">
      {/* Layout sections */}
      <AIChat />
      <SnackBar />


      {/* Project editor form */}
      <div
      ref={project_edit_container}
      className="backdrop-brightness-60 backdrop-blur w-screen h-screen fixed top-0 left-0 flex flex-col  items-center z-200 animate-fade-in overflow-y-auto py-10 hidden"
      onClick={hideEditProjectContainer}
      onSubmit={async(e: React.SubmitEvent) => {
        e.preventDefault();
        setIsLoading(true);
        await updateTeam();
        hideEditProjectContainer();
        setIsLoading(false);
      }}>
        <form
        onClick={(e: React.MouseEvent) => {
          e.nativeEvent.stopImmediatePropagation();
          e.stopPropagation();
        }}
        onSubmit={(e: React.SubmitEvent) => {
          e.preventDefault();
        }}
        className="animate-fade-in-up w-100 bg-neutral-900 rounded-lg px-6 py-4 flex flex-col justify-center items-center my-auto">


          <h2
          className="text-lg w-full text-start mb-3">
            Edit your project
          </h2>

          <label className="font-light w-full text-sm text-start mb-1 block">
            Project's new name
          </label>
          <input
          type="text"
          placeholder="Ex. UnityRoots"
          value={newTeamName || ""}
          onChange={(e) => {
            setNewTeamName(e.target.value);
          }}
          className="w-full rounded-sm px-3 py-2 bg-neutral-800 text-sm focus:outline-none mb-3 text-text/80 border border-transparent focus:border-main duration-400 mb-3"/>

          <label className="font-light w-full text-sm text-start mb-1 block">
            Project's new description
          </label>
          <input
          type="text"
          placeholder="A wonderfull project, made for..."
          value={newTeamDescription || ""}
          onChange={(e) => {
            setNewTeamDescription(e.target.value)
          }}
          className="w-full rounded-sm px-3 py-2 bg-neutral-800 text-sm focus:outline-none mb-3 text-text/80 border border-transparent focus:border-main duration-400 mb-3"/>

          {/* Status */}
          <div className="w-full flex flex-col items-start mb-2 relative">
            <label className="font-light w-full text-sm text-start mb-1 block">
              Project Status
            </label>
            
            <button
              type="button"
              onClick={() => setIsStatusOpen(!isStatusOpen)}
              className="w-full flex items-center justify-between bg-neutral-800 rounded-sm px-3 py-2 text-text/80 hover:bg-neutral-700 transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <span className={`w-2 h-2 rounded-full ${
                  statusOptions.find(opt => opt.value === newTeamStatus)?.color || "bg-zinc-500"
                }`} />
                <span className="text-sm">{newTeamStatus}</span>
              </div>
              <IconAssembly
              size={14}
              stroke={2} />
            </button>

            {isStatusOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsStatusOpen(false)} />
                <div className="absolute top-[calc(100%+4px)] left-0 w-full bg-neutral-900 border border-neutral-800 rounded-md shadow-xl overflow-hidden z-20 animate-in fade-in zoom-in-95 duration-200">
                  <div className="p-1">
                    {statusOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          setNewTeamStatus(option.value);
                          setIsStatusOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-sm text-sm transition-all ${
                          status === option.value 
                          ? 'bg-neutral-800 text-white' 
                          : 'text-text/60 hover:bg-neutral-800/50 hover:text-text/90'
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${option.color}`} />
                        <span className="flex-1 text-left">{option.label}</span>
                        {newTeamStatus === option.value && <div className="w-1 h-1 bg-blue-500 rounded-full" />}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          <label className="font-light w-full text-sm text-start mb-1 block">
            Project's tags
          </label>
          <input
          type="text"
          placeholder="React, TypeScript, NodeJS..."
          value={newTeamCurrentTag || ""}
          onChange={(e) => {
            setNewTeamCurrentTag(e.target.value)
          }}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              if (newTeamCurrentTag && newTeamCurrentTag.trim().length > 0 && !newTeamTags.includes(newTeamCurrentTag)) {
                setNewTeamTags(prev => prev ? [
                  ...prev,
                  newTeamCurrentTag
                ] : [ newTeamCurrentTag ]);
                setNewTeamCurrentTag("");
              };
              
              if(newTeamTags.includes(newTeamCurrentTag!)) {
                setNewTeamCurrentTag("");
              }
            }
          }}
          className="w-full rounded-sm px-3 py-2 bg-neutral-800 text-sm focus:outline-none mb-3 text-text/80 border border-transparent focus:border-main duration-400 mb-3"/>

          { /* Current tags */ }
          <div
          className="flex gap-1 flex-wrap justify-start items-center mb-10 w-full">
            { newTeamTags && newTeamTags.length > 0 && newTeamTags.map((tag, index) => (
              <div
              key={index}
              className="w-max px-2 py-1 rounded-md bg-neutral-800 text-sm font-light cursor-default hover:bg-red-700 duration-400"
              onClick={() => { setNewTeamTags(newTeamTags.toSpliced(index, 1)); }}>
                {tag}
              </div>
            )) }
          </div>

          

          <div className="flex w-full justify-end items-center gap-4">
            <button type="button"
            onClick={hideEditProjectContainer}
            className="px-4 py-1 rounded-md bg-neutral-800 duration-200 hover:brightness-80 cursor-pointer">
              Cancel
            </button>

            <button
            type="submit"
            className="px-4 py-1 rounded-md bg-main duration-200 hover:brightness-80 cursor-pointer disabled:brightness-50 disabled:cursor-not-allowed disabled:hover:brightness-50"
            disabled={
              //Verifies valid values
              (!newTeamName && !newTeamDescription && !newTeamStatus && (!newTeamTags || newTeamTags.length <= 0) ) ||
              (
                //Verifies values aren't repeated
                newTeamName === selectedTeamData.name &&
                newTeamDescription === selectedTeamData.description &&
                newTeamStatus === selectedTeamData.status &&
                newTeamTags === selectedTeamData.tags
              )
              //Is loading
              || isLoading
            }>
              Edit
            </button>
          </div>
        </form>
      </div>




      {/* Project creator form */}
      <div
      ref={project_container}
      className="backdrop-brightness-60 backdrop-blur w-screen h-screen fixed top-0 left-0 flex flex-col  items-center z-200 animate-fade-in hidden overflow-y-auto py-10"
      onClick={hideProjectContainer}>
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
              className="w-full rounded-sm px-3 py-2 bg-neutral-800 text-sm focus:outline-none mb-3 text-text/80 border border-transparent focus:border-main duration-400"
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
          <div className="w-full rounded-sm p-3 bg-neutral-950/50 text-sm mb-2 border border-neutral-900/50">
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



        {/* Team Status option */}
        <div className="w-full flex flex-col items-start mb-2 relative">
          <label className="font-light w-full text-sm text-start mb-1 block">
            Project Status
          </label>
          
          <button
            type="button"
            onClick={() => setIsStatusOpen(!isStatusOpen)}
            className="w-full flex items-center justify-between bg-neutral-800 rounded-sm px-3 py-2 text-text/80 hover:bg-neutral-700 transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <span className={`w-2 h-2 rounded-full ${
                statusOptions.find(opt => opt.value === status)?.color || "bg-zinc-500"
              }`} />
              <span className="text-sm">{status}</span>
            </div>
            <IconAssembly
            size={14}
            stroke={2} />
          </button>

          {isStatusOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setIsStatusOpen(false)} />
              <div className="absolute top-[calc(100%+4px)] left-0 w-full bg-neutral-900 border border-neutral-800 rounded-md shadow-xl overflow-hidden z-20 animate-in fade-in zoom-in-95 duration-200">
                <div className="p-1">
                  {statusOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setStatus(option.value);
                        setIsStatusOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-sm text-sm transition-all ${
                        status === option.value 
                        ? 'bg-neutral-800 text-white' 
                        : 'text-text/60 hover:bg-neutral-800/50 hover:text-text/90'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${option.color}`} />
                      <span className="flex-1 text-left">{option.label}</span>
                      {status === option.value && <div className="w-1 h-1 bg-blue-500 rounded-full" />}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>


        {/* Tags section */}
        <label
        className="font-light w-full text-start">
          Team tags
        </label>
        <input
        type="text"
        className="w-full rounded-sm px-3 py-2 bg-neutral-800 text-sm focus:outline-none mb-3 text-text/80 border border-transparent focus:border-main duration-400 mb-3"
        value={currentTag || ""}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setCurrentTag(e.target.value)
        }}
        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            if (currentTag && currentTag.trim().length > 0 && !tags.includes(currentTag)) {
              setTags(prev => prev ? [
                ...prev,
                currentTag
              ] : [ currentTag ]);
              setCurrentTag("");
            };
            
            if(tags.includes(currentTag!)) {
              setCurrentTag("");
            }
          }
        }}
        placeholder="React, TypeScript, NodeJS..."/>

        { /* Current tags */ }
        <div
        className="flex gap-1 flex-wrap justify-start items-center mb-10 w-full">
          { tags && tags.length > 0 && tags.map((tag, index) => (
            <div
            key={index}
            className="w-max px-2 py-1 rounded-md bg-neutral-800 text-sm font-light cursor-default hover:bg-red-700 duration-400"
            onClick={() => { setTags(tags.toSpliced(index, 1)); }}>
              {tag}
            </div>
          )) }
        </div>

        </CreatorForm>
      </div>





      {/* Main container */}
      {
        user && user.email ? (
          <>
            <SideBar email={user.email} plan={user.plan}/>
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
                        tags={ team.tags }
                        deleteProjectHandler={async() => {
                          await deleteProject(team.team_id, index);
                        }}
                        editProjectHandler={() => {
                          setEditTeamId(team.team_id);
                          setNewTeamName(team.name);
                          setNewTeamDescription(team.description);
                          setNewTeamTags(team.tags);
                          setNewTeamStatus(team.status);
                          setSelectedTeamData(team)
                          showEditProjectContainer();
                        }}/>
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