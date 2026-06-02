//Client side
"use client";

//Next imports
import Link from "next/link";
import { getCookie } from "cookies-next";
import Image from "next/image";
import { useParams } from "next/navigation";

//React imports
import { useEffect, useState, useRef } from "react";

//Hooks imports
import UpdateUserData from "@/services/user.service";
import { searchTeamData } from "../page";
import { getCached } from "@/hooks/cache.hook";

//Prebuilt ui imports
import SideBar, { Icon } from "@/components/ui/sidebar";
import LoadingDashboard from "@/components/screens/loading-screen";
import SnackBar, { showSnackbar } from "@/components/ui/snackbar";
import CreatorForm from "@/components/forms/creator-form";

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
  IconShield,
  IconAppWindow
} from "@tabler/icons-react";

//Types imports
import type Team from "@/types/team.types";
import { UserData } from "@/types/user.types";
import { IntegrantData } from "@/types/team.types";

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
  //Form toggler
  const [ formDisabled, setFormDisabled ] = useState<boolean>(false);
  //Searcher value
  const [ searched, setSearched ] = useState<string>("");
  //Found
  const [ found, setFound ] = useState<Array<{
    email: string,
    display_name: string
  }> | undefined>();
  //Found
  const [ added, setAdded ] = useState<Array<{
    email: string,
    display_name: string
  }> | undefined>();
  //Searcher status
  const [ searchStatus, setSearchStatus ] = useState<"not-searched" | "not-found" | "searching">("not-searched");

  //Snackbar component
  const snackbar = useRef(null);
  //Form component
  const addIntgForm = useRef(null);

  //Set expanded based in localstorage
  useEffect(() => {
    const expanded = window.localStorage.getItem("expanded");

    if(expanded) return setExpanded(true);

    return;
  }, []);

  useEffect(() => {
    async function getData() {
      let user_value : UserData | undefined;
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

      const team = await searchTeamData(snackbar, params, setTeam);
      console.log(team);
    }

    getData();
  }, []);

  const save_integrant = async(e: SubmitEvent) => {
    if(!added) return;

    setFormDisabled(true);

    added.forEach(async (added) => {
      e.preventDefault();

      const token = await getCookie("token");

      if(!token) return window.location.href = "/auth/login";

      const res = await fetch(`/api/teams/${params.id}/integrants/request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
          "Authorization": token
        },
        body: JSON.stringify({
          requested_email: added.email
        })
      });

      const data = await res.json();

      if(res.status !== 200) {
        showSnackbar(data.message, (res.status >= 500 ? "critic" : "warn"), snackbar);
        return;
      }

      showSnackbar(data.message, "valid", snackbar);
      return;
    });

    toggleForm();
    setFound(undefined);
    setAdded(undefined);
  }

  const toggleForm = () => {
    if(!addIntgForm.current) return;

    const current : HTMLFormElement = addIntgForm.current;

    if(current.classList.contains("grid")) {
      current.classList.add("hidden");
      current.classList.remove("grid");
    } else {
      current.classList.add("grid");
      current.classList.remove("hidden");
    }
  }

  //User searcher
  const searchUsers = async() => {
    setSearchStatus("searching");

    if(!searched || searched.length < 1) {
      setSearchStatus("not-searched")
    }

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
    setSearchStatus("not-found");
    return;
  }

  return (
    team && user ? (
      <div
      className="grid grid-cols-[auto_1fr] w-screen h-screen overflow-hidden bg-background text-text">
        <SnackBar
        ref={snackbar} />

        {/* Form component */}
        <section
        className="fixed w-screen min-h-screen overflow-x-hidden p-10 hidden z-20 bg-black/30 backdrop-blur animate-fade-in justify-center items-center"
        ref={addIntgForm}
        onClick={toggleForm}>

          <CreatorForm
          action={async(e) => { await save_integrant(e) }}
          title="Add a new teammate"
          actionIsDisabled={formDisabled && (!found || found.length < 1)}
          hideAction={toggleForm}>
            
            <label
            className="text-sm font-light w-full text-start">
              Search your teammate via email
            </label>
            <input
            type="text"
            onChange={(e) => {
              setSearched(e.target.value);
            }}
            value={searched}
            onKeyDown={(e) => {
              if(e.key === "Enter" && e.ctrlKey && searched) {
                searchUsers();
              }
            }}
            className="w-full text-sm rounded-md bg-neutral-800 p-2 mt-1 border border-transparent outline-none duration-300 focus:border-main hover:bg-neutral-800/50 focus:hover:bg-neutral-800"
            placeholder="Crtl + Enter" />

            <label
            className="text-sm font-light w-full text-start mt-3">
              Users found
            </label>
            <section
            className="w-full rounded-md bg-neutral-800 py-2 mb-3">
              {
                found && found.length > 0 ? found.map((user, index) => 
                  <button
                  type="button"
                  key={index}
                  className="w-full text-sm p-2 hover:bg-black/20 cursor-pointer text-start"
                  onClick={() => {
                    setAdded(prev => prev ? [
                      ...prev,
                      user
                    ] : [
                      user
                    ]);

                    if(found.length === 1) {
                      setSearchStatus("not-searched");
                    }

                    setFound(prev => prev?.filter((_, found_index) => found_index !== index));
                  }}>
                    <p> { user.display_name } </p>
                    <p
                    className="text-xs font-light opacity-80"> { user.email } </p>
                  </button>
                ) : (
                  <p
                  className="text-sm font-light cursor-default opacity-80 animate-pulse px-2">
                    {
                      searchStatus === "not-searched" ? (
                        "Search a user..."
                      ) : searchStatus === "not-found" ? (
                        "Not found..."
                      ) : (
                        "Searching..."
                      )
                    }
                  </p>
                )
              }
            </section>

            

            <label
            className="text-sm font-light w-full text-start">
              Integrants to request
            </label>
            <section
            className="w-full rounded-md bg-neutral-800 py-2 mb-4">
              {
                added && added.length > 0 ? added.map((user, index) => 
                  <button
                  type="button"
                  key={index}
                  className="w-full text-sm p-2 hover:bg-black/20 cursor-pointer text-start"
                  onClick={() => {
                    setAdded(prev => prev?.filter((_, int_index) => int_index !== index));
                  }}>
                    <p> { user.display_name } </p>
                    <p
                    className="text-xs font-light opacity-80"> { user.email } </p>
                  </button>
                ) : (
                  <p
                  className="text-sm font-light cursor-default opacity-80 animate-pulse px-2">
                    Add a user...
                  </p>
                )
              }
            </section>

          </CreatorForm>

        </section>

        <SideBar
        email={user?.email!}
        plan={user?.plan!}
        avatar={user?.avatar_url}
        username={user?.name!}
        setExpanded={(isExpanded : boolean) => {
          setExpanded(isExpanded === true ? false : true);
        }}>
          {
            expanded && (
              <span className="w-full text-base font-bold p-2 mt-5 animate-fade-in-right">
                Project 
              </span>
            )
          }

          <Icon
          action={`/teams/${params.id}`}
          name="Team dashboard"
          isDisplayed={expanded}>
            <IconAppWindow
            size={23}
            stroke={2}
            color="white"/>
          </Icon>

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
              className="bg-main rounded-full px-6 py-2 flex gap-2 items-center justify-center duration-400 cursor-pointer hover:-translate-y-0.5 hover:brightness-125"
              onClick={toggleForm}>
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
                    { team.integrants && team.integrants.length > 0 && team.integrants.map((member: IntegrantData, index: number) => (
                      <li
                        key={index}
                        className="grid grid-cols-5 gap-4 py-3 px-2 rounded-lg transition-colors hover:bg-white/5 items-center group">
                        <div className="flex items-center gap-3">
                          <Image
                          src={user?.avatar_url!}
                          alt={user?.email + " profile picture"}
                          width={50}
                          height={50}
                          className="w-9 rounded-full" />
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
                          type="button"
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