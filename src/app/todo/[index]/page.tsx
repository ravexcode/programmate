//Client side 
"use client";

//Next imports
import { useParams, useRouter } from "next/navigation";

//React imports
import { useEffect, useState, useRef } from "react";

//Hooks imports
import { getCached } from "@/hooks/cache.hook";
import { useGetToken } from "@/hooks/useCookies";

//Components imports
import SideBar from "@/components/ui/sidebar";
import CreatorForm from "@/components/forms/creatorForm";
import CreatorInput from "@/components/forms/creatorInputs";
import AIChat from "@/components/ui/ai_chat";
import SnackBar, { SnackbarRef } from "@/components/ui/snackbar";

//Types imports
import { UserData, Task, ToDoList } from "@/types/user.types";

//Services imports
import UpdateUserData from "@/services/user.service";
import LoadingDashboard from "@/components/screens/loading_dashboard";
import { IconCheck } from "@tabler/icons-react";

export default function ToDoListPage() {
  //Next settings
  const router = useRouter();
  const params = useParams();

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
  //Data statuses
  const [ toDoList, setToDoList ] = useState<ToDoList>();
  //Tasks
  const [ tasks, setTasks ] = useState<Array<Task>>();

  //New task values
  const [ taskName, setTaskName ] = useState<string>("");
  const [ taskCompleted, setTaskCompleted ] = useState<boolean>(false);

  //Components refs
  const project_container = useRef<HTMLDivElement>(null);
  //Snackbar
  const snackBar = useRef<SnackbarRef>(null);
  const form = useRef(null);

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
    if(params.index === null || params.index === undefined) return router.push("/dashboard");

    async function GetData() {
      //Checks session status
      const token = useGetToken();

      if(!token) return router.push('/auth/login');

      //Variable data
      let user_data : UserData | null;

      //Gets the cached user
      user_data = getCached();

      //If there is a cached user, sets the user data
      if(!user_data) {
        //Sets data if there's no data cached
        user_data = await UpdateUserData(token);
      }

      //Sets the value of state
      setUser(user_data);
      
      setToDoList(user_data.to_do_list![Number(params.index!)]);
      setTasks(user_data.to_do_list![Number(params.index!)].tasks || []);

      return;
    }

    GetData();
  }, []);

  const handleCreateTask = async() => {
  }

  return (
    user && toDoList ? (
      <div
      className="w-screen min-h-screen bg-background grid grid-cols-[auto_1fr] text-text">
          <SideBar
          email={user?.email}
          avatar={user.avatar_url}
          plan={user.plan}
          username={user.name}/>
          <AIChat />
          <SnackBar
          ref={snackBar}/>

          <main
          className="flex flex-col w-full min-h-screen items-center justify-start p-10 relative">
            <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
              <div className="absolute left-1/2 top-1/2 aspect-square block w-200 -translate-x-1/2 -translate-y-1/2 rounded-full bg-main/15 blur-3xl animate-pulse" />
            </div>


            <section
            className="z-2 flex flex-col justify-center items-center w-full">
              <p
              className="text-2xl font-medium tracking-wider text-center mb-10">
                { toDoList.title } <br />
                <span
                className="text-lg font-light tracking-normal">
                  { toDoList.description }
                </span>
              </p>

              <section
              className="w-full rounded-md bg-neutral-900 flex justify-center items-center p-4 max-w-3xl my-1 gap-3 mb-10">
                <button
                className={`aspect-square w-7 flex items-center justify-center rounded-full border border-neutral-700 cursor-pointer duration-200 hover:border-neutral-600 ${taskCompleted && "bg-main"}`}
                type="button"
                onClick={() => {
                  setTaskCompleted(prev => prev ? false : true)
                }}>
                  {
                    taskCompleted && (
                      <IconCheck
                      color="whitesmoke"
                      size={15}
                      stroke={3}
                      className="animate-fade-in animate-duration-200" />
                    )
                  }
                </button>

                <input
                type="text"
                value={taskName}
                onChange={(e) => {
                  setTaskName(e.target.value)
                }}
                placeholder="e.g. Refactor the auth api..."
                className={`w-full outline-none duration-200 ${taskCompleted ? "line-through text-text/60" : "text-text"}`}
                onKeyDown={(e) => {
                  if(e.key === "Enter" && taskName && taskName.length > 0) {
                    setTasks( prev => [
                      ...prev || [],
                      {
                        title: taskName,
                        isCompleted: taskCompleted
                      }
                    ]);

                    setTaskName("");
                    setTaskCompleted(false);
                  }
                }} />

                <button
                type="button"
                className="text-sm p-1 flex justify-center items-center bg-main duration-300 w-25 rounded-xl cursor-pointer hover:bg-main/80 disabled:hover:bg-main disabled:grayscale disabled:cursor-not-allowed"
                disabled={!taskName || taskName.length < 1}
                onClick={() => {
                  setTasks( prev => [
                    ...prev || [],
                    {
                      title: taskName,
                      isCompleted: taskCompleted
                    }
                  ]);

                  setTaskName("");
                  setTaskCompleted(false);
                }}>
                  Add task
                </button>
              </section>

              {
                tasks && tasks.length > 0 && tasks.map((task: Task, index: number) => 
                  <section
                  key={index}
                  className="w-full rounded-md bg-neutral-900 flex justify-center items-center p-4 max-w-3xl my-1 gap-3 border border-transparent duration-300 hover:border-main hover:-translate-y-1">
                    <button
                    className={`aspect-square w-7 flex items-center justify-center rounded-full border border-neutral-700 cursor-pointer duration-200 hover:border-neutral-600 ${task.isCompleted && "bg-main"}`}
                    type="button"
                    onClick={() => {
                      setTasks(prev => 
                        prev?.map((prev_task, i) => 
                          i === index ? {
                            ...prev_task,
                            isCompleted: (prev_task.isCompleted ? false : true)
                          } : prev_task
                        )
                      )
                    }}>
                      {
                        task.isCompleted && (
                          <IconCheck
                          color="whitesmoke"
                          size={15}
                          stroke={3}
                          className="animate-fade-in animate-duration-200" />
                        )
                      }
                    </button>

                    <p
                    className={`w-full outline-none duration-200 ${task.isCompleted ? "line-through text-text/60" : "text-text"}`}>
                      { task.title }
                    </p>
                  </section>
                )
              }
            </section>
          </main>
      </div>
    ) : (
      <LoadingDashboard />
    )
  )
}