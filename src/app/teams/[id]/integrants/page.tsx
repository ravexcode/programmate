//Client side
"use client";

//Next imports
import Link from "next/link";
import { getCookie } from "cookies-next";
import { useParams } from "next/navigation";

//React imports
import { useEffect, useState, useRef } from "react";

//Hooks imports
import UpdateUserData from "@/services/update.user";
import { searchTeamData } from "../page";
import { getCached } from "@/hooks/cache";

//Prebuilt ui imports
import SideBar, { IconProps } from "@/components/ui/sidebar";
import LoadingDashboard from "@/components/screens/loading_dashboard";
import SnackBar, { SnackbarRef } from "@/components/ui/snackbar";

//Icons imports
import {
  IconCalendar,
  IconDatabase,
  IconEye,
  IconFolder,
  IconLayoutKanban,
  IconMessage,
  IconUsers,
  IconUserPlus,
  IconTrash,
  IconShieldCheck,
  IconShield
} from "@tabler/icons-react";

//Types imports
import type Team from "@/types/team.types";
import { UserData } from "@/types/user.types";
import { IntegrantData } from "@/types/team.types";

//Icon button component
function Icon(props : IconProps) {
  return (
    <Link
    href={props.action}
    className={"flex justify-start items-center gap-2 p-1 md:p-2 rounded-lg hover:bg-ultramarine-600 cursor-pointer transition focus:outline-none opacity-90 duration-400 " + (props.disabled && "grayscale brightness-50 pointer-events-none ") + (props.isDisplayed ? "w-46 md:w-60" : "w-full")}>
      {props.children}
      {props.isDisplayed && <span className="text-sm animate-fade-in-right"> {props.name} </span>}
    </Link>
  )
}

export default function Page(){
  //Params value
  const params = useParams();

  //States handler
  //User data
  const [ user, setUser ] = useState<UserData>();
  //Sidebar expanded
  const [ expanded, setExpanded ] = useState<boolean>(false);
  //Team data
  const [ team, setTeam ] = useState<Team | null>(null);

  const snackbar = useRef<SnackbarRef>(null);

  useEffect(() => {
    async function getData() {
      let user_value : UserData;
      const token = await getCookie("token");

      if(!token) return window.location.href = "/auth/login";

      const cached = getCached();

      if(!cached) {
        const user_fetched = await UpdateUserData(token);

        user_value = user_fetched;
      } else {
        user_value = cached;
      }

      setUser(user_value);

      await searchTeamData(snackbar, params, setTeam);
    }

    getData();
  }, []);

  const save_integrant = async() => {
    const token = await getCookie("token");

    if(!token) return window.location.href = "/auth/login";

    const res = await fetch(`/api/teams/${params.id}/integrants/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
        "Authorization": token
      },
      body: JSON.stringify({
        //Add integrant data
      })
    });

    const data = await res.json();

    if(res.status !== 200) {
      snackbar.current?.showSnackBar(data.message, true);

      return;
    }

    snackbar.current?.showSnackBar(data.message);
    return;
  }

  return (
    team ? (
      <div
      className="grid grid-cols-[auto_1fr] w-screen h-screen overflow-hidden bg-background text-text">
        <SnackBar
        ref={snackbar} />

        <SideBar
        email={user?.email}
        setExpanded={(isExpanded : boolean) => {
          setExpanded(isExpanded === true ? false : true);
        }}
        plan={user?.plan}>
          {
            expanded && (
              <span className="w-full text-base font-bold p-2 mt-5 animate-fade-in-right">
                Project 
              </span>
            )
          }

          <Icon
          action={`/teams/${team.team_id}/integrants`}
          name="Integrants"
          isDisplayed={expanded}>
            <IconUsers
            size={23}
            stroke={2}
            color="white"/>
          </Icon>

          <Icon
          action={`/teams/${team.team_id}/tickets`}
          name="Tickets"
          isDisplayed={expanded}>
            <IconFolder
            size={23}
            stroke={2}
            color="white"/>
          </Icon>

          <Icon
          action={`/teams/${team.team_id}/erd`}
          name="ERD Creator"
          isDisplayed={expanded}
          disabled={ user?.plan === "Free" }>
            <IconDatabase
            size={23}
            stroke={2}
            color="white"/>
          </Icon>

          <Icon
          action={`/teams/${team.team_id}/chat`}
          name="Chat"
          isDisplayed={expanded}
          disabled={ user?.plan === "Free" }>
            <IconMessage
            size={23}
            stroke={2}
            color="white"/>
          </Icon>

          <Icon
          action={`/teams/${team.team_id}/json-preview`}
          name="JSON Preview"
          isDisplayed={expanded}
          disabled={ user?.plan === "Free" }>
            <IconEye
            size={23}
            stroke={2}
            color="white"/>
          </Icon>

          <Icon
          action={`/teams/${team.team_id}/kanban-board`}
          name="Kanban board"
          isDisplayed={expanded}
          disabled={ user?.plan === "Free" }>
            <IconLayoutKanban
            size={23}
            stroke={2}
            color="white"/>
          </Icon>

          <Icon
          action={`/teams/${team.team_id}/calendar`}
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
        className="w-full h-screen overflow-w-hidden overflow-y-auto py-5 px-18 bg-background relative flex flex-col justify-start items-start">
          <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
            <div className="absolute left-1/2 top-1/2 aspect-square block w-200 -translate-x-1/2 -translate-y-1/2 rounded-full bg-main/15 blur-3xl animate-pulse" />
          </div>

          {/* Team header section */}
          <section
          className="flex flex-col py-2 w-full justify-center items-start mb-8 relative z-10">
            <h2
            className="text-5xl font-semibold mb-2">
              Team Integrants
            </h2>

            <p
            className="opacity-90">
              Manage team members and their permissions for <span className="font-semibold text-blue-500">{team?.name}</span>
            </p>

            <div
            className="flex gap-3 flex-wrap w-full justify-start items-center mt-5">
              <button
              type="button"
              className="bg-main rounded-full px-6 py-2 flex gap-2 items-center justify-center duration-400 cursor-pointer hover:-translate-y-0.5 hover:brightness-125">
                <IconUserPlus
                size={20}
                stroke={2} />
                Add a new integrant
              </button>
            </div>
          </section>

          {/* Integrants section */}
          <section
          className="w-full border border-neutral-800 bg-neutral-950 backdrop-blur-sm rounded-md overflow-hidden shadow-xl relative z-10">
            <header
            className="px-6 py-4 border-b border-neutral-800 bg-neutral-950 flex justify-between items-center">
              <h3
              className="text-xl font-semibold text-white">
                Team Members ({team?.integrants?.length || 0})
              </h3>
            </header>

            <div className="p-6">
              {team?.integrants && team.integrants.length > 0 ? (
                <>
                  <div className="grid grid-cols-5 pb-3 text-xs uppercase tracking-wider font-bold text-neutral-500 border-b border-neutral-800 mb-4 px-2">
                    <span>Username</span>
                    <span>Email</span>
                    <span>Role</span>
                    <span className="text-right">Actions</span>
                  </div>

                  <ul className="space-y-1 cursor-default">
                    {team.integrants.map((member: IntegrantData, index: number) => (
                      <li
                        key={index}
                        className="grid grid-cols-5 gap-4 py-3 px-2 rounded-lg transition-colors hover:bg-white/5 items-center group">
                        <div className="flex items-center gap-3">
                          <span
                          className="p-2 w-9 text-center text-xs rounded-full bg-radial-[at_25%_25%] from-sky-600 to-blue-900">
                            {
                              member?.username.slice(0, 1) +
                              (member?.username.split(' ').slice(1).join(' ').slice(0, 1) || "")
                            }
                          </span>
                          <span className="font-medium text-neutral-200 group-hover:text-blue-500 transition-colors">
                            {member.username}
                          </span>
                        </div>

                        <span className="font-light text-neutral-400 truncate text-sm">
                          {member.email}
                        </span>

                        <div className="flex items-center gap-2">
                          {member.type === "admin" ? (
                            <>
                              <IconShieldCheck
                              size={16}
                              stroke={2}
                              className="text-green-500" />
                              <span className="text-xs font-semibold text-green-500 uppercase">Admin</span>
                            </>
                          ) : (
                            <>
                              <IconShield
                              size={16}
                              stroke={2}
                              className="text-blue-400" />
                              <span className="text-xs font-semibold text-blue-400 uppercase">Member</span>
                            </>
                          )}
                        </div>

                        <div className="flex justify-end gap-2">
                          <button
                          className="p-1 rounded-md bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors duration-200"
                          title="Edit member">
                            <IconUsers
                            size={16}
                            stroke={2} />
                          </button>

                          <button
                          className="p-1 rounded-md bg-neutral-800 hover:bg-red-900 text-neutral-300 hover:text-red-400 transition-colors duration-200"
                          title="Remove member">
                            <IconTrash
                            size={16}
                            stroke={2} />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <div
                className="flex flex-col text-neutral-500 justify-center items-center py-16">
                  <IconUsers
                  size={48}
                  stroke={1}
                  className="mb-4 opacity-50" />
                  <p className="text-center text-lg font-medium mb-4">No team members yet</p>
                  <p className="text-center text-sm opacity-70 mb-6 max-w-xs">
                    Invite your first team member to start collaborating on this project
                  </p>
                  <Link
                  href={`/teams/${team.team_id}/integrants/invite`}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-text bg-main hover:bg-main/90 duration-400 transition cursor-pointer font-medium">
                    <IconUserPlus
                    size={18}
                    stroke={2} />
                    Invite Member
                  </Link>
                </div>
              )}
            </div>
          </section>

          {/* Team roles info section */}
          <section
          className="w-full mt-8 border border-neutral-800 bg-neutral-950 backdrop-blur-sm rounded-md overflow-hidden shadow-xl relative z-10">
            <header
            className="px-6 py-4 border-b border-neutral-800 bg-neutral-950">
              <h3
              className="text-xl font-semibold text-white">
                Role Permissions
              </h3>
            </header>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Admin role */}
                <div className="border border-green-900/30 bg-green-900/10 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <IconShieldCheck
                    size={20}
                    stroke={2}
                    className="text-green-500" />
                    <h4 className="text-green-500 font-semibold">Administrator</h4>
                  </div>
                  <ul className="text-sm text-neutral-400 space-y-2">
                    <li className="flex gap-2">
                      <span className="text-green-500">✓</span>
                      <span>Full access to all features</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-green-500">✓</span>
                      <span>Manage team members</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-green-500">✓</span>
                      <span>Delete team</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-green-500">✓</span>
                      <span>Modify team settings</span>
                    </li>
                  </ul>
                </div>

                {/* Member role */}
                <div className="border border-blue-900/30 bg-blue-900/10 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <IconShield
                    size={20}
                    stroke={2}
                    className="text-blue-400" />
                    <h4 className="text-blue-400 font-semibold">Member</h4>
                  </div>
                  <ul className="text-sm text-neutral-400 space-y-2">
                    <li className="flex gap-2">
                      <span className="text-blue-400">✓</span>
                      <span>Access assigned features</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-blue-400">✓</span>
                      <span>Create and edit tickets</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-blue-400">✓</span>
                      <span>Collaborate on tasks</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-neutral-600">✗</span>
                      <span className="text-neutral-500">Cannot manage members</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    ) : (
      <LoadingDashboard />
    )
  )
};