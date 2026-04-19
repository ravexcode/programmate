//Client side
"use client";

//React imports
import { useEffect, useState, useRef } from "react";

//Hooks imports
import { getCached } from "@/hooks/cache";

//Components imports
import SideBar from "@/components/dashboard/sidebar";
import CreatorForm from "@/components/forms/creatorForm";
import CreatorInput from "@/components/forms/creatorInputs";

//Types imports
import { UserData } from "@/types/user.types";

//Next imports
import { getCookie } from "cookies-next/client";

//Services imports
import UpdateUserData from "@/services/update.user";

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

  //Components refs
  const project_container = useRef<HTMLDivElement>(null);

  //Data fetching form cache
  useEffect(() => {
    const user = getCached();
    setUser(user);
  }, []);

  //Function to update user's data
  const updateUserData = async(token: any) => {
    const updatedUser = await UpdateUserData(token);
    setUser(updatedUser);
  };

  //Function to handle project creation
  const handleCreateProject = async(e: any) => {
    e.preventDefault();
    //Implement project creation logic here
  };

  //Function to hide project creator form
  const hideProjectContainer = () => {
    if(!project_container.current) return;
    project_container.current.classList.add("hidden");
  };

  //Function to show project creator form
  const showProjectContainer = () => {
    if(!project_container.current) return;
    project_container.current.classList.remove("hidden");
  };

  return (
    <div
    className="min-h-screen bg-background grid grid-cols-[auto_1fr] overflow-hidden text-text">
      <SideBar
      email={user?.email}/>

      {/* Creator form */}
      <div
      ref={project_container}
      className="backdrop-brightness-60 backdrop-blur w-screen h-screen fixed top-0 left-0 flex flex-col justify-center items-center z-200 animate-fade-in hidden">
        <CreatorForm
        title="Create a new to do list"
        action={handleCreateProject}
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
          <div className="absolute left-1/2 top-0 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-main/10 blur-[100px] animate-pulse" />
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
              {user?.name} To Do Lists
              </h2>
              <p className="text-text/70 text-sm md:text-base">
                There are your lists
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
                To Do Lists
              </h3>

              <button
              className="flex items-center gap-2 bg-main px-4 py-2 text-sm font-medium text-white rounded-lg transition-all duration-300 hover:bg-main/80 focus:outline-none cursor-pointer"
              onClick={() => {
                showProjectContainer();
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Create new
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}