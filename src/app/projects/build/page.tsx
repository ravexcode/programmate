"use client";

//React imports
import { useEffect, useState, useRef } from "react";

//Next imports
import { useRouter } from "next/navigation";
import Link from "next/link";

//Prebuilt UI imports
import SideBar from "@/components/dashboard/sidebar";
import CreatorInput from "@/components/forms/creator-inputs";
import SnackBar from "@/components/ui/snackbar";
import ProjectCard from "@/components/dashboard/project-card";
import LoadingScreen from "@/components/screens/loading-screen";
import OptionsInput from "@/components/forms/options-input";

//Modules imports
import { createProject } from "@/modules/project/main.module";
import { getUser } from "@/modules/user.module";

//Types imports
import type { UserData } from "@/types/user.types";
import type { Status } from "@/types/team.types";

//Icons imports
import { IconArrowLeft } from "@tabler/icons-react";

type Project = {
  name: string;
  description: string;
  user: UserData;
  tags: string [];
  status: Status;
};

export default function CreatorPage() {
  const router = useRouter();

  const [ user, setUser ] = useState<UserData>();
  const [ project, setProject ] = useState<Project>();

  const [ loading, setLoading ] = useState(false);

  const [ status, setStatus ] = useState("Backlog");
  const [ tag, setTag ] = useState("");

  const snackbar = useRef(null);
  
  const disabled = (
    !project ||
    !project.name ||
    !user
  );

  useEffect(() => {
    async function fetch() {
      const data = await getUser(router);

      setUser(data!);
      setProject({
        name: "",
        description: "",
        user: data!,
        tags: [],
        status: status as Status
      })
    }

    fetch();
  }, []);

  const options: Status [] = [
    "Backlog",
    "Planning",
    "In progress",
    "On Hold",
    "Done",
  ];

  return (
    !user || !project ?
    <LoadingScreen /> :
    <div
    className="min-h-screen bg-background grid grid-rows-[auto_1fr] sm:grid-cols-[auto_1fr] overflow-hidden text-text select-none" >
      <SideBar
      user={user} />

      <SnackBar
      ref={snackbar} />

      <main className="relative flex flex-col h-screen overflow-y-auto px-4 md:px-8 animate-fade-in items-center">
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

        <Link
        href="/dashboard"
        className="w-30 p-1.5 duration-300 rounded-sm hover:bg-neutral-800 text-sm flex gap-1 items-center justify-center mr-auto cursor-pointer ml-10 select-none">
          <IconArrowLeft size={15} />
          Go back
        </Link>

        <div
        className="flex md:flex-row gap-10 p-10 flex-col items-start justify-center w-full">
          <form
          className="w-full max-w-120 rounded-sm border border-neutral-900 p-5 bg-neutral-950 gap-2"
          onSubmit={async(e) => {
            e.preventDefault();
            setLoading(true);
            const data = await createProject({
              router,
              snackbar,
              user,
              project: {
                ...project,
                status: status as Status
              }
            });

            if(data.team_id) return router.push(`/projects/${data.team_id}`);
            setLoading(false);
          }}>
            <p
            className="text-2xl font-medium tracking-wide w-full text-center mb-5">
              Build a new project
            </p>

            <CreatorInput
            value={project.name}
            onChange={(e) => {
              setProject(
                prev => prev ? {
                  ...prev,
                  name: e.target.value
                  } : project
              )
            }}
            label="Set project name"
            bgColor="bg-neutral-900"
            placeholder="e.g. NextJS App"
            required />

            <CreatorInput
            value={project.description}
            onChange={(e) => {
              setProject(
                prev => prev ? {
                  ...prev,
                  description: e.target.value
                  } : project
              )
            }}
            label="Set project description"
            bgColor="bg-neutral-900"
            placeholder="Make a description about your project"
            type="textarea" />

            <OptionsInput
            label="Set current project status"
            value={status}
            onChange={setStatus}
            options={options}
            bgColor="bg-neutral-900" />

            <label
            className="text-sm select-none">
              Project tags
            </label>
            <input
            className="w-full rounded-sm px-3 py-2 text-sm focus:outline-none mb-1 text-text/80 border border-transparent duration-300 bg-neutral-900 hover:border-main"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === " ") {
                e.preventDefault();

                const cleanTag = tag.trim();
                if (!cleanTag) return;
                const exists = project.tags?.includes(cleanTag);
                if (exists) return;
                setProject((prev) => {
                  if (!prev) return prev;
                  return {
                    ...prev,
                    tags: [...(prev.tags || []), cleanTag]
                  };
                });
                setTag("");
              }
            }}
            placeholder="e.g. NextJS"
          />

            <div
            className="flex gap-2 items-center justify-start mt-1">
              {
                project.tags && project.tags.length > 0 && project.tags.map((t, i) =>
                  <p
                  key={i}
                  className="px-3 py-1 rounded-md text-xs font-light border border-main/50 bg-main/20 text-text/80 w-max cursor-default hover:bg-red-950/50 hover:border-red-600"
                  onClick={() => {
                    setProject(
                      prev => prev ? {
                        ...prev,
                        tags: prev.tags.filter((_, ind) => ind !== i)
                        } : project
                    );
                  }}>
                    {t}
                  </p>
                )
              }
            </div>

            <button
            type="submit"
            disabled={loading || disabled}
            className={"w-full p-2 text-sm bg-main mt-5 rounded-md hover:brightness-75 duration-300 cursor-pointer disabled:hover:brightness-100 disabled:bg-neutral-600 " + ( loading ? "disabled:cursor-wait" : "disabled:cursor-not-allowed" )}>
              Create
            </button>
            
            {
              disabled && 
                <p
                className="w-full text-red-500 text-sm text-center mt-2 font-medium tracking-wide">
                  Please set a name for your project
                </p>
            }
          </form>


          <div
          className="flex flex-col items-start justify-center gap-5 w-150">
            <p
            className="font-semibold tracking-wide text-3xl">
              Card preview
            </p>

            <ProjectCard
            title={project.name || "Unnamed project"}
            description={project.description || "Waiting for a interesting description..."}
            id={1}
            index={0}
            status={status}
            tags={project.tags}
            goToTeam={() => {}} />
          </div>
        </div>

      </main>
    </div>
  )
}