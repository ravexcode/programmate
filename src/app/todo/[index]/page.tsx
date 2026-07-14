//Client side 
"use client";

//Next imports
import { useParams, useRouter } from "next/navigation";

//React imports
import { useEffect, useState, useRef } from "react";

//Hooks imports
import { getSessionStr } from "@/services/session.service";

//Components imports
import SideBar from "@/components/ui/sidebar";
import SnackBar, { showSnackbar } from "@/components/ui/snackbar";

//Types imports
import { UserData, Task, ToDoList } from "@/types/user.types";

//Services imports
import UpdateUserData from "@/services/user.service";
import LoadingDashboard from "@/components/screens/loading-screen";
import { IconArrowLeft, IconCheck, IconTrash } from "@tabler/icons-react";
import AltButton from "@/components/ui/buttons/alternate";

export default function ToDoListPage() {
  //Next settings
  const router = useRouter();
  const params = useParams();

  //States handler
  //User data
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  //Data statuses
  const [ toDoList, setToDoList ] = useState<ToDoList>();
  //Tasks
  const [ tasks, setTasks ] = useState<Array<Task>>();
  //Initial tasks (for prevent autosave)
  const [ initialTasks, setInitialTasks ] = useState<Array<Task>>();

  //New task values
  const [ taskName, setTaskName ] = useState<string>("");
  const [ taskCompleted, setTaskCompleted ] = useState<boolean>(false);

  //Snackbar
  const snackbar = useRef(null);

  //Data fetching form cache
  useEffect(() => {
    if(params.index === null || params.index === undefined) return router.push("/dashboard");

    async function GetData() {
      //Checks session status
      const token = getSessionStr();

      if(!token) return router.push('/auth/signin');

      //Sets data if there's no data cached
      const user_data = await UpdateUserData(token);

      if(!user_data) return router.push("/");

      //Sets the value of state
      setUser(user_data);

      setToDoList(user_data.to_do_list![Number(params.index)]);
      setTasks(user_data.to_do_list![Number(params.index)].tasks || []);
      setInitialTasks(user_data.to_do_list![Number(params.index)].tasks || []);

      return;
    }

    GetData();
  }, []);

  const handleSaveToDoList = async() => {
    setIsLoading(true);

    const token = getSessionStr();

    if(!token) return router.push("/auth/signin");

    const res = await fetch(
      `/api/todos`,
      {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
          "nexzero-api-key": process.env.NEXT_PUBLIC_API_KEY!,
          "Authorization": token
        },
        body: JSON.stringify({
          tasks,
          list_index: params.index,
        })
      }
    );

    const data = await res.json();

    if(res.status === 200) {
      showSnackbar(data.message, "valid", snackbar);
      setIsLoading(false);
      setInitialTasks(tasks);
      return;
    }

    showSnackbar(data.message, (res.status >= 500 ? "critic" : "warn"), snackbar);

    setIsLoading(false);
    return
  }

  return (
    user && toDoList ? (
      <div
      className="h-screen bg-background grid grid-cols-[auto_1fr] text-text overflow-hidden">
          <SideBar
          email={user?.email}
          avatar={user.avatar_url}
          plan={user.plan}
          username={user.name}/>
          <SnackBar
          ref={snackbar}/>

          <main
          className="flex flex-col w-full min-h-screen items-center justify-start relative overflow-auto">
            <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
              <div className="absolute left-1/2 top-1/2 aspect-square block w-200 -translate-x-1/2 -translate-y-1/2 rounded-full bg-main/15 blur-3xl animate-pulse" />
            </div>


            <section
            className="z-2 flex flex-col justify-center items-center w-full max-w-200">
              <button
              type="button"
              onClick={() => router.back()}
              className="p-2 flex gap-2 rounded-md duration-400 hover:bg-neutral-800 mt-10 mr-auto w-30 cursor-pointer items-center justify-center">
                <IconArrowLeft
                size={20}
                stroke={2} />

                Go back
              </button>
              <p
              className="text-2xl font-medium tracking-wider text-center mb-10 animate-fade-in-down">
                { toDoList.title } <br />
                <span
                className="text-lg font-light tracking-normal">
                  { toDoList.description }
                </span>
              </p>

              <section
              className="w-full rounded-md bg-neutral-900 flex justify-center items-center p-4 max-w-3xl my-1 gap-3 mb-10 animate-fade-in-up">
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
                placeholder="e.g. Refactor App API..."
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
                  className="w-full rounded-md bg-neutral-900 flex justify-center items-center p-4 max-w-3xl my-1 gap-3 border border-transparent duration-300 hover:border-main hover:-translate-y-1 cursor-pointer animate-fade-in-up"
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
                    <div
                    className={`aspect-square w-7 h-7 flex items-center justify-center rounded-full border border-neutral-700 cursor-pointer duration-200 hover:border-neutral-600 ${task.isCompleted && "bg-main"}`}>
                      {
                        task.isCompleted && (
                          <IconCheck
                          color="whitesmoke"
                          size={15}
                          stroke={3}
                          className="animate-fade-in animate-duration-200" />
                        )
                      }
                    </div>

                    <p
                    className={`w-full outline-none duration-200 ${task.isCompleted ? "line-through text-text/60" : "text-text"}`}>
                      { task.title }
                    </p>

                    <button
                    type="button"
                    className="ml-auto w-7 h-7 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.nativeEvent.stopPropagation();

                      setTasks( prev => 
                        prev?.filter((_, i) => i !== index)
                      );
                    }}>
                      <IconTrash
                      color="red"
                      size={22}
                      stroke={1.5} />
                    </button>
                  </section>
                )
              }

              <button
              type="button"
              className={`w-30 p-2 bg-main rounded-xl cursor-pointer duration-300 hover:bg-main/80 hover:-translate-y-1 mt-10 disabled:grayscale hover:disabled:bg-main hover:disabled:translate-y-0 animate-fade-in-up mb-10 ${tasks === initialTasks ? "disabled:cursor-not-allowed" : "disabled:cursor-wait"}`}
              onClick={handleSaveToDoList}
              disabled={isLoading || tasks === initialTasks}>
                Save
              </button>
            </section>
          </main>
      </div>
    ) : (
      <LoadingDashboard />
    )
  )
}