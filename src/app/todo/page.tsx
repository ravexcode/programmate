//Client side
"use client";

//React imports
import { useEffect, useState, useRef, RefObject } from "react";

//Hooks imports
import { getCached } from "@/hooks/cache.hook";

//Components imports
import SideBar from "@/components/ui/sidebar";
import CreatorForm from "@/components/forms/creatorForm";
import CreatorInput from "@/components/forms/creatorInputs";
import AIChat from "@/components/ui/ai_chat";
import SnackBar, { SnackbarRef } from "@/components/ui/snackbar";

//Types imports
import { UserData } from "@/types/user.types";

import { useGetToken } from "@/hooks/useCookies";

//Services imports
import UpdateUserData from "@/services/user.service";
import LoadingDashboard from "@/components/screens/loading_dashboard";

//Icons imports
import { IconDotsVertical, IconPencil, IconPlus, IconReload, IconTrash } from "@tabler/icons-react";

export default function ToDoListPage() {
  //States handler
  //User data
  const [user, setUser] = useState<UserData | null>(null);
  //Is reloading button
  const [ isReloading, setIsReloading ] = useState<boolean>(false);
  //Creator form states
  const [projectName, setProjectName] = useState<string>("");
  const [projectDescription, setProjectDescription] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  //List options state
  const [ openMenuIndex, setOpenMenuIndex ] = useState<number | null>(null);

  //Components refs
  const project_container = useRef<HTMLDivElement>(null);
  //Snackbar
  const snackBar = useRef<SnackbarRef>(null);

  //Function for hide the menu of to do list when user clicks outside
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

  //Data fetching form cache
  useEffect(() => {
    //Gets the cached user
    const user = getCached();

    //If there is a cached user, sets the user data
    if(user) {
      setUser(user);
    }
  }, []);

  //Function to update user's data
  const updateUserData = async(token: any) => {
    const updatedUser = await UpdateUserData(token);
    setUser(updatedUser);
  };

  //Function to handle project creation
  const handleCreateToDoList = async(e: any) => {
    //Prevents default
    e.preventDefault();
    //Set button to loading
    setIsLoading(true);
    
    //Sets the list data
    const new_list = {
      list_title: projectName,
      list_description: projectDescription
    };

    //Gets the token
    const token = useGetToken();

    if(!token) return window.location.href = "/auth/login";

    //Creates the new list
    const res = await fetch("/api/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.NEXT_PUBLIC_API_KEY || "",
        "Authorization": token,
      },
      body: JSON.stringify(new_list)
    });

    //Gets data from response
    const data = await res.json();

    if(res.status === 200) {
      //Updates the user data
      setUser(prev => prev ? {
        ...prev,
        to_do_list: [
          ...(prev.to_do_list ?? []),
          {
            title: new_list.list_title,
            description: new_list.list_description
          }
        ]
      } : prev);

      //Hides the form
      hideProjectContainer();
      //Change loading state
      setIsLoading(false);
      //Clear all the inputs
      setProjectName("");
      setProjectDescription("");

      //Returns success
      return;
    }
    
    //Verifies if there's an error
    if(data.error) {
      snackBar.current?.showSnackBar(data.message, true);
    }
    //Cancels loading status
    setIsLoading(false);
  };

  //Function to hide project creator form
  const hideProjectContainer = () => {
    if(!project_container.current) return;
    project_container.current.classList.add("hidden");
    project_container.current.classList.remove("flex");
  };

  //Function to show project creator form
  const showProjectContainer = () => {
    if(!project_container.current) return;
    project_container.current.classList.remove("hidden");
    project_container.current.classList.add("flex");
  };

  return (
    <div
    className="min-h-screen bg-background grid grid-cols-[auto_1fr] overflow-hidden text-text">
      { user ? (
        <>
          <SideBar
          email={user?.email}
          avatar={user.avatar_url}
          plan={user.plan}
          username={user.name}/>
          <AIChat />
          <SnackBar
          ref={snackBar}/>

          {/* Creator form */}
          <div
          ref={project_container}
          className="backdrop-brightness-60 backdrop-blur w-screen h-screen fixed top-0 left-0 flex-col justify-center items-center z-200 animate-fade-in hidden">
            <CreatorForm
            title="Create a new to do list"
            action={handleCreateToDoList}
            hideAction={hideProjectContainer}
            actionIsDisabled={ isLoading || !projectName || projectName.length < 3 || !projectDescription}>

              <CreatorInput
              label="To do list name"
              placeholder="My to do list"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}/>

              <CreatorInput
              label="To do list description"
              placeholder="Describe your to do list"
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}/>

            </CreatorForm>
          </div>

          <main
          className="relative flex flex-col h-screen overflow-y-auto px-4 md:px-8 animate-fade-in">
            <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
              <div className="absolute left-1/2 top-1/2 aspect-square block w-200 -translate-x-1/2 -translate-y-1/2 rounded-full bg-main/15 blur-3xl animate-pulse" />
            </div>

            {
              user?.plan && (
                <div
                className="flex justify-end items-center w-full my-5">
                  <span
                  className="text-sm px-5 py-1 bg-main shadow-lg shadow-main/30 rounded-full cursor-default">
                    { user.plan }
                  </span>
                </div>
              )
            }

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
                className="text-sm py-2 px-6 border-2 border-ultramarine-50/30 rounded-full cursor-pointer duration-300 hover:border-ultramarine-50/60 h-max w-max flex gap-2 my-auto disabled:hover:brightness-80 disabled:hover:bg-transparent disabled:hover:scale-100 disabled:brightness-80 disabled:cursor-wait"
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
                    To Do Lists
                  </h3>

                  <button
                  className="flex items-center gap-2 bg-main px-6 py-2 text-sm font-medium text-white rounded-full transition-all duration-300 hover:bg-main/80 focus:outline-none active:scale-95 cursor-pointer"
                  onClick={() => {
                    showProjectContainer();
                  }}>
                    <IconPlus
                    color="white"
                    size={16}
                    stroke={2.5}/>
                    Create new
                  </button>
                </div>


                <section
                className={user.to_do_list && user.to_do_list.length >= 1 ? "grid grid-cols-1 lg:grid-cols-2 gap-6" : "flex flex-col justify-center items-center"}>
                  { user?.to_do_list && user.to_do_list.length >= 1 ? 
                    user.to_do_list.map((list, index) => (
                      <section
                      key={index}
                      className="group relative w-full flex flex-col rounded-xl border border-ultramarine-50/10 bg-neutral-950 p-5"
                      onContextMenu={(e) => {
                        e.preventDefault();
                        e.nativeEvent.stopImmediatePropagation();
                        e.stopPropagation();
                        setOpenMenuIndex(prev => prev === index ? null : index);
                      }}>

                        <header className="flex items-start justify-between mb-3">

                          <h3 className="text-lg font-semibold text-text tracking-tight line-clamp-1">
                            {list.title}
                          </h3>
                          
                          <button 
                            className="flex h-8 w-8 -mr-2 -mt-2 items-center justify-center rounded-full text-text hover:bg-ultramarine-50/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-ultramarine-400"
                            onClick={(e) => {
                              e.nativeEvent.stopImmediatePropagation(); 
                              e.stopPropagation();
                              setOpenMenuIndex(prev => prev === index ? null : index);
                            }}>
                            <IconDotsVertical
                            size={16}
                            color="white"
                            stroke={3}/>
                          </button>

                          { openMenuIndex === index && (
                            <div className="absolute right-2 top-10 z-20 w-36 overflow-hidden rounded-lg border border-ultramarine-50/10 bg-neutral-900 shadow-xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-200">
                              <button
                              onClick={(e) => {
                                e.nativeEvent.stopImmediatePropagation(); 
                                e.stopPropagation();
                                setOpenMenuIndex(null);
                              }}
                              className="flex w-full items-center px-4 py-2.5 text-sm text-text transition-colors hover:bg-ultramarine-800">

                              <IconPencil
                              size={20}
                              color="white" />

                              Edit
                            </button>
                            
                            <button
                            onClick={(e) => {
                              e.nativeEvent.stopImmediatePropagation(); 
                              e.stopPropagation();
                              setOpenMenuIndex(null);
                            }}
                            className="flex w-full items-center px-4 py-2.5 text-sm text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300">

                              <IconTrash
                              size={20}
                              stroke={1} />
                              
                              Delete
                            </button>
                            </div>
                        )}
                      </header>

                      <p className="text-sm text-text/60 line-clamp-3 leading-relaxed">
                        {list.description}
                      </p>
                    </section>
                    )) : (
                    <span
                    className="w-full text-center text-2xl font-light text-text py-4"> No To Do lists found, try creating a new list!  </span>
                  ) }
                </section>

              </section>
            </div>
            
            
          </main>
        </>
      ) : (
        <LoadingDashboard />
      ) }
    </div>
  );
}