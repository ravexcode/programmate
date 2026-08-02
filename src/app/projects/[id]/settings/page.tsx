"use client";

//Next imports
import { useParams, useRouter } from "next/navigation";

//React imports
import { useEffect, useState, useRef } from "react";

//Prebuilt ui imports
import BgGradient from "@/components/ui/bg-gradient";
import SnackBar from "@/components/ui/snackbar";
import LoadingScreen from "@/components/screens/loading-screen";
import TeamSideBar from "@/components/dashboard/team-sidebar";

//Client imports
import {
  loadSettingsPage,
  addTag,
  removeTag,
  applySettings,
  deleteTeam,
  leaveTeam,
  STATUS_OPTIONS,
  WARN_TEXTS,
} from "@/client/projects/settings";
import { toggleOverlay } from "@/client/projects/shared";

//Types imports
import type { UserData } from "@/types/user.types";
import type Team from "@/types/team.types";

//Icons imports
import {
  IconSpace,
  IconAssembly,
  IconLogout,
  IconTrash
} from "@tabler/icons-react";
import MainButton from "@/components/ui/buttons/main";
import HazardButton from "@/components/ui/buttons/hazard";

export default function SettingsPage(){
  //Next setup
  const router = useRouter();
  const params = useParams();

  //Data states
  const [ user, setUser ] = useState<UserData>();
  const [ team, setTeam ] = useState<Team>();
  const [ isStatusOpen, setIsStatusOpen ] = useState(false);
  const [ isLoading, setIsLoading ] = useState(false);
  const [ currentTag, setCurrentTag ] = useState("");
  const [ prevTeam, setPrevTeam ] = useState<Team>();
  const [ warnText, setWarnText ] = useState<0 | 1>(0);
  const [ confirmationText, setConfirmationText ] = useState("");

  //Components ref
  const snackbar = useRef(null);
  const warnCard = useRef(null);

  //Gets data
  useEffect(() => {
    async function fetchData() {
      const data = await loadSettingsPage(Number(params.id), router, snackbar);

      if(!data) return router.push("/dashboard");

      setUser(data.user);
      setTeam(data.team);
      setPrevTeam(data.team);
    }

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDeleteTeam = async() => {
    setIsLoading(true);

    await deleteTeam(router, snackbar, Number(params.id));

    router.push("/dashboard");
  }

  const handleLeave = async() => {
    if(!user) return;

    setIsLoading(true);

    await leaveTeam(router, snackbar, Number(params.id), user.id);

    router.push("/dashboard");
  }

  return (
    user && team ? (
      <div
      className="bg-background text-text h-screen grid grid-cols-[auto_1fr] overflow-hidden"
      onClick={() => setIsStatusOpen(false)}>
        <SnackBar
        ref={snackbar} />
        <TeamSideBar
        user={user}
        team={team} />

        <main
        className="flex flex-col justify-start items-center p-10 relative overflow-auto">
          { /* Warn card */ }
          <div
          className="p-10 hidden items-center justify-center fixed z-10 backdrop-blur backdrop-brightness-75 w-screen h-screen inset-0 animate-fade-in-up animate-duration-300"
          ref={warnCard}
          onClick={() => toggleOverlay(warnCard)}>

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

              { WARN_TEXTS[warnText] }

              {
                warnText === 1 &&
                <div
                className="flex flex-col gap-1 w-full items-start justify-center px-10">
                  <label>
                    Set &quot;{team.name.toLowerCase()}&quot; to confirm team elimination
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
                onClick={() => toggleOverlay(warnCard)}>
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
                    warnText === 1 ? "Delete" : "Leave from the team"
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
          onSubmit={async(e) => {
            e.preventDefault();
            setIsLoading(true);
            await applySettings(router, snackbar, team)
            .finally(() => setPrevTeam(team));
            setIsLoading(false);
          }}>
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
              value={team.description}
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
                      STATUS_OPTIONS.find(opt => opt.value === team.status)?.color || "bg-zinc-500"
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
                      {STATUS_OPTIONS.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            setTeam(
                              prev => prev ? {
                                ...prev,
                                status: option.value
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

                  e.preventDefault();
                  setTeam(prev => prev ? addTag(prev, currentTag.trim()) : team);
                  setCurrentTag("");

                  return;
                }}
                type="text"
                className="w-full px-3 py-2 pr-10 rounded-sm bg-neutral-950 border border-neutral-900 outline-none duration-300 focus:border-main"
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
                      prev => prev ? removeTag(prev, index) : team
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
              setConfirmationText("");
              setWarnText(0);
              toggleOverlay(warnCard);
            }}>
              Leave from the team

              <IconLogout
              size={20}
              stroke={2} />
            </HazardButton>

            {
              user && team.integrants.find(int => int.id === user.id)?.type === "admin" &&
              <HazardButton
              size="w-60"
              className="font-medium tracking-wide flex gap-2 items-center justify-center z-2"
              action={() => {
                setConfirmationText("");
                setWarnText(1);
                toggleOverlay(warnCard);
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
