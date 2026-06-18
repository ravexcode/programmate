"use client";

//Next imports
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

//React imports
import { useEffect, useState, useRef } from "react";

//Prebuilt ui imports
import SideBar, { Icon } from "@/components/ui/sidebar";
import BgGradient from "@/components/ui/bg-gradient";
import SnackBar, { showSnackbar } from "@/components/ui/snackbar";
import LoadingScreen from "@/components/screens/loading-screen";

//Services imports
import getUser from "@/services/user.service";
import getTeam from "@/services/team.service";

//Hooks imports
import { useDeleteToken, useGetToken } from "@/hooks/useCookies";

//Types imports
import { UserData } from "@/types/user.types";
import Team from "@/types/team.types";
import { getCached } from "@/hooks/cache.hook";

//Icons imports
import {
  IconAppWindow,
  IconCalendar,
  IconDatabase,
  IconEye,
  IconFolder,
  IconLayoutKanban,
  IconMessage,
  IconUsers,
  IconSpace,
  IconAssembly,
  IconLogout,
  IconTrash
} from "@tabler/icons-react";
import MainButton from "@/components/ui/buttons/main";
import HazardButton from "@/components/ui/buttons/hazard";
import { fetchTemplate } from "@/actions/template";
import useAnimationClose from "@/hooks/useAnimationClose";

export default function SettingsPage(){
  //Next setup
  const router = useRouter();
  const params = useParams();

  //Data states
  const [ user, setUser ] = useState<UserData>();
  const [ team, setTeam ] = useState<Team>();
  const [ expanded, setExpanded ] = useState(false);
  const [ isStatusOpen, setIsStatusOpen ] = useState(false);
  const [ isLoading, setIsLoading ] = useState(false);
  const [ currentTag, setCurrentTag ] = useState("");
  const [ userIndex, setUserIndex ] = useState<number>();
  const [ prevTeam, setPrevTeam ] = useState<Team>();
  const [ warnText, setWarnText ] = useState<0 | 1>(0);
  const [ confirmationText, setConfirmationText ] = useState("");

  //Components ref
  const snackbar = useRef(null);
  const warnCard = useRef(null);
  
  //Set expanded based in localstorage
  useEffect(() => {
    const expanded = window.localStorage.getItem("expanded");

    if(expanded) return setExpanded(true);

    return;
  }, []);

  //Gets data
  useEffect(() => {
    async function fetchData() {
      let user_data: UserData;

      const token = useGetToken();

      if(!token) return router.push("/auth/login");

      const cached = getCached();

      if(!cached) {
        const user_fetched = await getUser(token);

        if(!user_fetched) {
          useDeleteToken();
          window.localStorage.clear();
          return router.push("/auth/login");
        }

        user_data = user_fetched
      } else {
        user_data = cached;
      }

      setUser(user_data);

      const team = await getTeam(
        Number(params.id),
        token,
        snackbar
      );

      setTeam(team);
      setPrevTeam(team);
      const user_index = team.integrants_id.indexOf(user_data.id);

      if(user_index === undefined) return router.push("/dashboard");

      setUserIndex(user_index)
    }

    fetchData();
  }, []);

  
  //Status options for project
  const statusOptions = [
    { value: "Backlog", label: "Backlog", color: "bg-zinc-500" },
    { value: "Planning", label: "Planning", color: "bg-blue-400" },
    { value: "In Progress", label: "In Progress", color: "bg-orange-400" },
    { value: "On Hold", label: "On Hold", color: "bg-red-400" },
    { value: "Done", label: "Done", color: "bg-purple-500" },
  ];

  const handleUpdateTeam = async(e: React.SubmitEvent) => {
    e.preventDefault();
    e.nativeEvent.preventDefault();

    if(!team) return;

    const token = useGetToken();

    if(!token) return router.push("/auth/login");

    setIsLoading(true);

    await fetchTemplate(
      "/api/teams",
      "PUT",
      snackbar,
      {
        "Authorization": token
      },
      JSON.stringify({
        teamId: params.id,
        newName: team.name,
        newDescription: team.description,
        newTags: team.tags,
        newStatus: team.status
      })
    );

    setIsLoading(false);
    setPrevTeam(team);
  }

  const warnTexts = [
    "Are you shure to you want to leave from this team?",
    "Are you shure to you want to delete this team?"
  ];

  const toggleWarn = () => {
    if(!warnCard.current) return;
    setConfirmationText("");

    const current : HTMLElement = warnCard.current;
    const classlist = current.classList;

    if(classlist.contains("hidden")){
      classlist.remove("animate-fade-out-down");
      classlist.replace("hidden", "flex");

      return;
    };

    classlist.add("animate-fade-out-down");
    useAnimationClose(current, "fade-out-down", "hidden", "flex");
    return;
  };

  const handleDeleteTeam = async() => {
    const token = useGetToken();
    setIsLoading(true);

    if(!token) return;

    await fetchTemplate(
      `/api/teams/${params.id}`,
      "DELETE",
      snackbar,
      {
        "Authorization": token,
      }
    );

    router.push("/dashboard");
  }

  const handleLeave = async() => {
    if(!user) return;

    const token = useGetToken();
    setIsLoading(true);

    if(!token) return;

    await fetchTemplate(
      `/api/teams/${params.id}/integrants/remove-member`,
      "DELETE",
      snackbar,
      {
        "Authorization": token,
      },
      JSON.stringify({
        member_id: user.id
      })
    );

    router.push("/dashboard");
  }

  return (
    user && team && userIndex !== undefined ? (
      <div
      className="bg-background text-text h-screen grid grid-cols-[auto_1fr] overflow-hidden"
      onClick={() => setIsStatusOpen(false)}>
        <SnackBar
        ref={snackbar} />
        <SideBar
        email={user?.email!}
        plan={user?.plan!}
        avatar={user?.avatar_url}
        username={user?.name!}
        setExpanded={(isExpanded : boolean) => {
          setExpanded(isExpanded === true ? false : true);
        }}>
          
          { expanded && ( <span className="w-full text-base font-bold p-2 animate-fade-in-right"> Project </span> ) }

          <Icon
          action={`/projects/${params.id}`}
          name="Dashboard"
          isDisplayed={expanded}>
            <IconAppWindow
            size={23}
            stroke={2}
            color="white"/>
          </Icon>

          <Icon
          action={`/projects/${team.team_id}/integrants`}
          name="Integrants"
          isDisplayed={expanded}>
            <IconUsers
            size={23}
            stroke={2}
            color="white"/>
          </Icon>

          <Icon
          action={`/projects/${team.team_id}/tickets`}
          name="Tickets"
          isDisplayed={expanded}>
            <IconFolder
            size={23}
            stroke={2}
            color="white"/>
          </Icon>

          <Icon
          action={`/projects/${team.team_id}/erd`}
          name="ERD Creator"
          isDisplayed={expanded}
          disabled={ user?.plan === "Free" }>
            <IconDatabase
            size={23}
            stroke={2}
            color="white"/>
          </Icon>

          <Icon
          action={`/projects/${team.team_id}/chat`}
          name="Chat"
          isDisplayed={expanded}
          disabled={ user?.plan === "Free" }>
            <IconMessage
            size={23}
            stroke={2}
            color="white"/>
          </Icon>

          <Icon
          action={`/projects/${team.team_id}/json-preview`}
          name="JSON Preview"
          isDisplayed={expanded}
          disabled={ user?.plan === "Free" }>
            <IconEye
            size={23}
            stroke={2}
            color="white"/>
          </Icon>

          <Icon
          action={`/projects/${team.team_id}/kanban-board`}
          name="Kanban board"
          isDisplayed={expanded}
          disabled={ user?.plan === "Free" }>
            <IconLayoutKanban
            size={23}
            stroke={2}
            color="white"/>
          </Icon>

          <Icon
          action={`/projects/${team.team_id}/calendar`}
          name="Calendar"
          isDisplayed={expanded}
          disabled={ user?.plan === "Free" }>
            <IconCalendar
            size={23}
            stroke={2}
            color="white"/>
          </Icon>
        </SideBar>

        <main
        className="flex flex-col justify-start items-center p-10 relative overflow-auto">
          <div
          className="p-10 hidden items-center justify-center fixed z-10 backdrop-blur backdrop-brightness-75 w-screen h-screen inset-0 animate-fade-in-up animate-duration-300"
          ref={warnCard}
          onClick={toggleWarn}>
            
            <section
            className="p-3 rounded-md border border-neutral-800 bg-neutral-900 w-120 text-center flex flex-col gap-4 items-center justify-center"
            onClick={(e) => {
              e.stopPropagation();
              e.nativeEvent.stopPropagation();
            }}>
              <p
              className="text-2xl font-medium tracking-wide">
                Caution!
              </p>

              { warnTexts[warnText] }

              {
                warnText === 1 && 
                <div
                className="flex flex-col gap-1 w-full items-start justify-center px-10">
                  <label>
                    Set "{team.name.toLowerCase()}" to confirm team elimination
                  </label>
                  <input
                  type="text"
                  value={confirmationText}
                  onChange={(e) => setConfirmationText(e.target.value)}
                  placeholder="Set your confimation text"
                  className="w-full p-2 rounded-md bg-neutral-900 border border-neutral-800 outline-none duration-300 focus:border-main" />
                </div>
              }

              {
                warnText === 1 && 
                <span
                className="w-70 rounded-md border border-red-700 bg-red-950 text-red-400 p-1 text-sm">
                  This action is not reversible
                </span>
              }

              <div
              className="mt-2 grid grid-cols-2 items-center justify-center gap-3 w-full">
                <button
                type="button"
                className="h-full rounded-md bg-neutral-800 duration-500 hover:bg-neutral-950 cursor-pointer text-sm"
                onClick={toggleWarn}>
                  Cancel
                </button>

                <HazardButton
                size="w-auto"
                action={async() => {
                  if(warnText === 1) return await handleDeleteTeam();

                  if(warnText === 0) return await handleLeave();
                }}
                isDisabled={warnText === 1 && confirmationText !== team.name.toLowerCase()}>
                  {
                    warnText && warnText === 1 ? "Delete" : "Leave from the team"
                  }
                </HazardButton>
              </div>
            </section>
          </div>

          <BgGradient />

          <p
          className="text-5xl font-medium tracking-wide mb-5 z-2 animate-fade-in-down animate-duration-300">
            {team.name} settings
          </p>

          <form
          className="w-full max-w-200 rounded-md p-4 z-2 flex flex-col items-start justify-start gap-4 animate-fade-in-up animate-duration-300"
          onSubmit={async(e) => handleUpdateTeam(e)}>
            <div
            className="w-full flex flex-col gap-2 text-sm items-start justify-center">
              <label
              className="font-medium text-lg">
                Team name
              </label>
              <input
              value={team.name}
              onChange={(e) => {
                setTeam(
                  prev => prev ? {
                    ...prev,
                    name: e.target.value
                  } : team
                )
              }}
              type="text"
              className="outline-none bg-neutral-950 rounded-sm p-3 duration-300 border border-neutral-900 focus:border-main w-full"
              placeholder="e.g. Project apollo" />
            </div>
            
            <div
            className="w-full flex flex-col gap-2 text-sm items-start justify-center">
              <label
              className="font-medium text-lg">
                Team description
              </label>
              <textarea
              defaultValue={team.description}
              onChange={(e) => {
                setTeam(
                  prev => prev ? {
                    ...prev,
                    description: e.target.value
                  } : team
                )
              }}
              className="outline-none bg-neutral-950 rounded-sm p-3 duration-300 border border-neutral-900 focus:border-main w-full min-h-30 h-30 max-h-100"
              placeholder="e.g. Project apollo" />
            </div>
            
            <div
            className="w-full flex flex-col gap-2 text-sm items-start justify-center">
              <label
              className="font-medium text-lg">
                Team status
              </label>
              
              <div className="w-full flex flex-col items-start mb-2 relative">
                <label className="font-light w-full text-sm text-start mb-1 block">
                  Project Status
                </label>
                        
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  e.nativeEvent.stopPropagation();

                  setIsStatusOpen(!isStatusOpen);
                }}
                className="w-full flex items-center justify-between bg-neutral-950 rounded-sm p-2 text-text/80 hover:bg-neutral-800 transition-all duration-200" >
                <div className="flex items-center gap-3">
                  <span className={`w-2 h-2 rounded-full ${
                    statusOptions.find(opt => opt.value === team.status)?.color || "bg-zinc-500"
                  }`} />
                  <span className="text-sm">{team.status}</span>
                </div>
                <IconAssembly
                size={14}
                stroke={2} />
              </button>
    
              {isStatusOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsStatusOpen(false)} />
                  <div className="absolute top-[calc(100%+4px)] left-0 w-full bg-neutral-950 border border-neutral-800 rounded-md shadow-xl overflow-hidden z-20 animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-1">
                      {statusOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            setTeam(
                              prev => prev ? {
                                ...prev,
                                status: (option.value as any)
                              } : team
                            );
                            setIsStatusOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-sm text-sm transition-all ${
                            team.status === option.value 
                            ? 'bg-neutral-800 text-white' 
                            : 'text-text/60 hover:bg-neutral-800/50 hover:text-text/90'
                          }`}
                        >
                          <span className={`w-2 h-2 rounded-full ${option.color}`} />
                          <span className="flex-1 text-left">{option.label}</span>
                          {team.status === option.value && <div className="w-1 h-1 bg-blue-500 rounded-full" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
            </div>
            
            <div
            className="w-full flex flex-col gap-2 text-sm items-start justify-center">
              <label
              className="font-medium text-lg">
                Team tags
              </label>
              
              <div
              className="h-max w-full relative">
                <input
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyDown={(e) => {
                  if(e.key !== " " || currentTag.length < 1) return;
                  if(team.tags && team.tags && team.tags.filter(tag => tag === currentTag).length > 0) return;

                  setTeam(
                    prev => prev ?
                    {
                      ...prev,
                      tags: [
                        ...prev.tags || [],
                        currentTag
                      ]
                    } : team
                  );
                  setCurrentTag("");

                  return;
                }}
                type="text"
                className="outline-none bg-neutral-950 rounded-sm p-3 duration-300 border border-neutral-900 focus:border-main w-full"
                placeholder="e.g. NextJS, TypeScript, NodeJS" />

                <div
                className="flex gap-1 absolute right-2 top-1/2 -translate-y-1/2 w-max items-center justify-end">
                  <IconSpace
                  size={20}
                  className="rounded-md p-1 bg-zinc-800 h-6 w-6 text-neutral-500" />
                </div>
              </div>

              <div
              className="w-full flex gap-2 mt-2">
                {
                  team.tags && team.tags.map((tag, index) =>
                    <p
                    className="px-3 py-1 rounded-full text-sm font-light border border-main/50 bg-main/20 text-text/80 w-max cursor-default duration-300 hover:border-red-700 hover:bg-red-950"
                    key={ index }
                    onClick={() => setTeam(
                      prev => prev ? {
                        ...prev,
                        tags: prev.tags ?
                          prev.tags.filter((_, i) => i !== index)
                         : []
                      } : team
                    )}>
                      {tag}
                    </p>
                  )
                }
              </div>
            </div>

            <MainButton
            size="w-80"
            className="mx-auto mt-5 animate-fade-in-up animate-duration-300"
            type="submit"
            isDisabled={team === prevTeam}
            isLoading={isLoading}>
              Apply changes
            </MainButton>
          </form>
          
          <div
          className="flex gap-2 justify-center items-center w-full max-w-250">
            <span className="w-full h-px rounded-md bg-red-600 animate-fade-in-right" />
            
            <p
            className="w-80 text-center p-2 text-lg text-red-600 animate-fade-in-up animate-duration-300">
              Hazard options
            </p>

            <span className="w-full h-px rounded-md bg-red-600 animate-fade-in-left" />
          </div>

          <div
          className="w-full flex items-center justify-center gap-10 mt-5 animate-fade-in-up animate-duration-300">
            <HazardButton
            size="w-60"
            className="font-medium tracking-wide flex gap-2 items-center justify-center z-2"
            action={() => {
              toggleWarn();
              setWarnText(0);
            }}>
              Leave from the team

              <IconLogout
              size={20}
              stroke={2} />
            </HazardButton>

            {
              team.integrants[userIndex].type === "admin" &&
              <HazardButton
              size="w-60"
              className="font-medium tracking-wide flex gap-2 items-center justify-center z-2"
              action={() => {
                toggleWarn();
                setWarnText(1);
              }}>
                Delete this team

                <IconTrash
                size={20}
                stroke={2} />
              </HazardButton>
            }
          </div>
        </main>
      </div>
    ) : (
      <LoadingScreen />
    )
  )
}