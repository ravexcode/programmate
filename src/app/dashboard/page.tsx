//Client side
"use client";

//Table icons imports
import {
  IconPlus,
  IconSearch,
  IconReload, 
  IconAssembly
} from "@tabler/icons-react";

//React imports
import { useEffect, useState, useRef, RefObject } from "react";

//Components imports
import SideBar,  { Icon } from "@/components/ui/sidebar";
import LoadingDashboard from "@/components/screens/loading-screen";
import AIChat from "@/components/ui/ai-chat";
import CreatorForm from "@/components/forms/creator-form";
import CreatorInput from "@/components/forms/creator-inputs";
import SnackBar, { showSnackbar } from "@/components/ui/snackbar";
import ProjectCard from "@/components/ui/project-card";

//Hooks imports
import { useDeleteCookie, useGetToken } from "@/hooks/useCookies";

//Services imports
import UpdateUserData from "@/services/user.service";
import { sendRequest } from "@/services/resend.service";

//Types imports
import { UserData, UserBasic } from "@/types/user.types";
import Team, { IntegrantData } from "@/types/team.types";

//Hooks imports
import { getCached } from "@/hooks/cache.hook";
import useAnimationClose from "@/hooks/useAnimationClose";

//Next imports
import { useRouter } from "next/navigation";

export default function Dashboard(){
  //Next setup
  const router = useRouter();

  //State values
  //User data
  const [ user, setUser ] = useState<UserData>();
  //Is reloading button
  const [ isReloading, setIsReloading ] = useState<boolean>(false);

  //Projects form
  //Users searched
  const [ searched, setSearched ] = useState<string | undefined>();
  //Integrants
  const [ integrants, setIntegrants ] = useState<Array<IntegrantData> | undefined>();
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
  //Team selected data
  const [ selectedTeamData, setSelectedTeamData ] = useState<any>();
  //New status
  const [ newTeamStatus, setNewTeamStatus ] = useState<string>();
  //Sidebar expanded
  const [ expanded, setExpanded ] = useState<boolean>(false);

  //Containers
  //Project creator
  const project_creator_container : RefObject<null> = useRef(null);

  //Snackbar container
  const snackbar = useRef(null);

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
      if(!cached) user_data = await UpdateUserData(token);
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
    const token = useGetToken();

    if(!token) return router.push("/auth/login");

    //Insert user to integrants if not exists
    const integrants_created = [
      {
        id: user?.id,
        email: user?.email,
        username: user?.name,
        type: "admin",
        avatar_url: user?.avatar_url
      }
    ];

    //Fetchs to api
    const res = await fetch("/api/teams", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.NEXT_PUBLIC_API_KEY || "",
        "Authorization": token!,
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

      //Sends invitations for integrants
      if(found && found.length > 0) {
        found.forEach(async( user ) => {
          await sendRequest(
            user.email,
            data.team.id,
            token!,
            snackbar
          );
        })
      }

      //Hides the form
      toggleCreatorContainer();
      //Change loading state
      setIsLoading(false);
      //Clear all the inputs
      setNewTeamName("");
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
    showSnackbar(data.message, (res.status >= 500 ? "critic" : "warn"), snackbar)
    setIsLoading(false);
    return;
  }
  
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
    const token = useGetToken();

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
      showSnackbar(data.message, (res.status >= 500 ? "critic" : "warn"), snackbar)
      return;
    } catch(e: unknown) {
      if(e instanceof Error) {
        showSnackbar(e.message, "critic", snackbar);
      }
      
      showSnackbar("Server error", "critic", snackbar);
      return;
    }
  };

  const toggleCreatorContainer = () => {
    if(!project_creator_container.current) return;

    const current : HTMLElement = project_creator_container.current;
    const classlist = current.classList;

    if(classlist.contains("hidden")){
      //Change loading state
      setIsLoading(false);
      //Clear all the inputs
      setFound(undefined);
      setSearched(undefined);
      setIntegrants(undefined);
      setProjectName(undefined);
      setProjectDescription(undefined);

      classlist.remove("animate-fade-out-down");
      classlist.replace("hidden", "flex");

      return;
    };

    classlist.add("animate-fade-out-down");
    useAnimationClose(current, "fade-out-down", "hidden", "flex");
    return;
  }

  const toggleEditContainer = () => {
    if(!project_edit_container.current) return;

    const current : HTMLElement = project_edit_container.current;
    const classlist = current.classList;

    if(classlist.contains("hidden")){
      classlist.remove("animate-fade-out-down");
      classlist.replace("hidden", "flex");

      return;
    };

    classlist.add("animate-fade-out-down");
    useAnimationClose(current, "fade-out-down", "hidden", "flex");
    return;
  }

  //Function for update team
  const updateTeam = async() => {
    const token = useGetToken();

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
      showSnackbar(data.message, (res.status >= 500 ? "critic" : "warn"), snackbar);
      return;
    } catch(e: unknown) {
      if(e instanceof Error) {
        showSnackbar(e.message, "critic", snackbar);
      }
      
      showSnackbar("Server error", "critic", snackbar);
      return;
    }
  }

  return (
    <div className="min-h-screen bg-background grid grid-cols-[auto_1fr] overflow-hidden text-text">
      {/* Layout sections */}
      <AIChat />
      <SnackBar
      ref={snackbar} />

      {/* Project editor form */}
      <div
      ref={project_edit_container}
      className="backdrop-brightness-60 backdrop-blur w-screen h-screen fixed top-0 left-0 flex-col items-center z-200 animate-fade-in animate-duration-200 overflow-y-auto py-10 hidden"
      onClick={toggleEditContainer}
      onSubmit={async(e: React.SubmitEvent) => {
        e.preventDefault();
        setIsLoading(true);
        await updateTeam();
        toggleEditContainer();
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
          name="newprojectname"
          value={newTeamName || ""}
          onChange={(e) => {
            setNewTeamName(e.target.value);
          }}
          className="w-full rounded-sm px-3 py-2 bg-neutral-800 text-sm focus:outline-none mb-3 text-text/80 border border-transparent focus:border-main duration-400"/>

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
          className="w-full rounded-sm px-3 py-2 bg-neutral-800 text-sm focus:outline-none text-text/80 border border-transparent focus:border-main duration-400 mb-3"/>

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
          className="w-full rounded-sm px-3 py-2 bg-neutral-800 text-sm focus:outline-none mb-3 text-text/80 border border-transparent focus:border-main duration-400"/>

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
            onClick={toggleEditContainer}
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
      ref={project_creator_container}
      className="backdrop-brightness-60 backdrop-blur w-screen h-screen fixed top-0 left-0 flex-col  items-center z-200 animate-fade-in animate-duration-200 hidden overflow-y-auto py-10"
      onClick={toggleCreatorContainer}>
        <CreatorForm
        title="Create a new project"
        action={handleCreateProject}
        hideAction={toggleCreatorContainer}
        actionIsDisabled={ isLoading || !projectName || projectName.length < 3 || !projectDescription}>
          <CreatorInput
          label="Project name"
          placeholder="My project"
          value={projectName || ""}
          onChange={(e) => setProjectName(e.target.value)}
          required />

          <CreatorInput
          label="Project description"
          placeholder="Describe your project"
          value={projectDescription || ""}
          onChange={(e) => setProjectDescription(e.target.value)}
          type="textarea"
          required />

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
        className="w-full rounded-sm px-3 py-2 bg-neutral-800 text-sm focus:outline-none mb-3 text-text/80 border border-transparent focus:border-main duration-400"
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
            <SideBar
            email={user.email}
            plan={user.plan}
            avatar={user.avatar_url}
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
                  key={index + "-proyect"}>
                    <></>
                  </Icon>
                )
              }
            </SideBar>
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
                  onClick={ async(e) => {
                    setIsReloading(true);
                    const token = useGetToken();

                    await UpdateUserData(token!);
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
                      toggleCreatorContainer()
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
                      user.teams && user.teams.length >= 1 ? user.teams.map((team : Team, index: number) => (
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
                        tags={ team.tags! }
                        deleteProjectHandler={async() => {
                          await deleteProject(team.team_id, index);
                        }}
                        editProjectHandler={() => {
                          setEditTeamId(team.team_id);
                          setNewTeamName(team.name);
                          setNewTeamDescription(team.description);
                          setNewTeamTags(team.tags!);
                          setNewTeamStatus(team.status);
                          setSelectedTeamData(team)
                          toggleEditContainer();
                        }}
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