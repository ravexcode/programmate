//Client side
"use client";

//Next imports
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

//React imports
import { useEffect, useState, useRef } from "react";

//Hooks imports
import { getCached } from "@/hooks/cache.hook";
import { deleteSessionStr, getSessionStr } from "@/services/session.service";
import useAnimationClose from "@/hooks/useAnimationClose";

//Services imports
import getUser from "@/services/user.service";
import getTeam from "@/services/team.service";

//Functions imports
import { isUserAdmin, getMemberById } from "@/functions/admin";

//Prebuilt ui imports
import SideBar, { Icon } from "@/components/ui/sidebar";
import LoadingDashboard from "@/components/screens/loading-screen";
import SnackBar, { showSnackbar } from "@/components/ui/snackbar";
import ConfirmationCard from "@/components/ui/confirmation-card";
import CreatorForm from "@/components/forms/creator-form";
import MainButton from "@/components/ui/buttons/main";

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
  IconAppWindow,
  IconSettings,
  IconUserCircle
} from "@tabler/icons-react";

//Types imports
import type Team from "@/types/team.types";
import { UserData } from "@/types/user.types";
import { IntegrantData } from "@/types/team.types";

export default function Page(){
  //NextJS Setup
  const params = useParams();
  const router = useRouter();

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
  const [ currentRole, setCurrentRole ] = useState("member");

  //Confirmation dialog states
  const [ confirmationOpen, setConfirmationOpen ] = useState<boolean>(false);
  const [ confirmationAction, setConfirmationAction ] = useState<"delete" | "role-change">("delete");
  const [ confirmationMemberId, setConfirmationMemberId ] = useState<string>("");
  const [ confirmationNewRole, setConfirmationNewRole ] = useState<string>("");
  const [ isProcessing, setIsProcessing ] = useState<boolean>(false);

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
      let user_data : UserData;
      const token = getSessionStr();

      if(!token) return router.push("/auth/signin");

      const cached = getCached();

      if(!cached) {
        const user_fetched = await getUserService({router});

        if(!user_fetched) {
          deleteSessionStr();
          window.localStorage.clear();
          return router.push("/auth/signin");
        }

        user_data = user_fetched;
      } else {
        user_data = cached;
      }

      setUser(user_data);

      const team_data = await getTeam(
        Number(params.id),
        token,
        snackbar
      );

      setTeam(team_data);
      
      const integrants = team_data.integrants;

      const user_index = integrants.findIndex(
        (integrant : IntegrantData) => integrant.id === user?.id
      );

      if(user_index === undefined) return router.push("/dashboard");
      
      setCurrentRole(team_data.integrants[user_index + 1].type || "member")

      return;
    }

    getData();
    return;
  }, []);

  const save_integrant = async(e: React.SubmitEvent) => {
    if(!added) return;

    setFormDisabled(true);

    added.forEach(async (added) => {
      e.preventDefault();

      const token = getSessionStr();

      if(!token) return router.push("/auth/signin");

      const res = await fetch(`/api/teams/${params.id}/integrants/request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "nexzero-api-key": process.env.NEXT_PUBLIC_API_KEY!,
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

    const current : HTMLElement = addIntgForm.current;
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

  //Change member role
  const changeMemberRole = async(memberId: string, currentRole: string) => {
    const token = getSessionStr();
    if(!team) return;
    if(!token) return router.push("/auth/signin");

    // Constants
    const integrants = team.integrants;
    // Variables
    const user_index = integrants.findIndex(
      integrant => integrant.id === user?.id
    );

    if(user_index === undefined) return router.push("/dashboard");

    if(integrants[user_index].type !== "admin") return showSnackbar("You can't do this", "warn", snackbar);

    const newRole = currentRole === "admin" ? "member" : "admin";

    // Open confirmation dialog
    setConfirmationMemberId(memberId);
    setConfirmationAction("role-change");
    setConfirmationNewRole(newRole);
    setConfirmationOpen(true);
  }

  //Confirm role change
  const confirmRoleChange = async() => {
    const token = getSessionStr();
    if(!token) return router.push("/auth/signin");

    setIsProcessing(true);

    const res = await fetch(`/api/teams/${params.id}/integrants/change-role`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "nexzero-api-key": process.env.NEXT_PUBLIC_API_KEY!,
        "Authorization": token
      },
      body: JSON.stringify({
        member_id: confirmationMemberId,
        new_role: confirmationNewRole
      })
    });

    const data = await res.json();

    if(res.status !== 200) {
      showSnackbar(data.message, (res.status >= 500 ? "critic" : "warn"), snackbar);
      setIsProcessing(false);
      return;
    }

    showSnackbar(data.message, "valid", snackbar);
    
    // Update local state
    if(team && team.integrants) {
      setTeam({
        ...team,
        integrants: team.integrants.map((member: IntegrantData) =>
          member.id === confirmationMemberId ? { ...member, type: confirmationNewRole } : member
        )
      });
    }

    setConfirmationOpen(false);
    setIsProcessing(false);
  }

  //Delete member from team
  const deleteMember = async(memberId: string) => {
    if(!team) return;
    if(!isUserAdmin(team, user?.id)) {
      return showSnackbar("You don't have permission to do this", "warn", snackbar);
    }

    // Open confirmation dialog
    setConfirmationMemberId(memberId);
    setConfirmationAction("delete");
    setConfirmationOpen(true);
  }

  //Confirm member deletion
  const confirmMemberDeletion = async() => {
    const token = getSessionStr();
    if(!token) return router.push("/auth/signin");

    setIsProcessing(true);

    const res = await fetch(`/api/teams/${params.id}/integrants/remove-member`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "nexzero-api-key": process.env.NEXT_PUBLIC_API_KEY!,
        "Authorization": token
      },
      body: JSON.stringify({
        member_id: confirmationMemberId
      })
    });

    const data = await res.json();

    if(res.status !== 200) {
      showSnackbar(data.message, (res.status >= 500 ? "critic" : "warn"), snackbar);
      setIsProcessing(false);
      return;
    }

    showSnackbar(data.message, "valid", snackbar);
    
    // Update local state
    if(team && team.integrants) {
      setTeam({
        ...team,
        integrants: team.integrants.filter((member: IntegrantData) => member.id !== confirmationMemberId)
      });
    }

    setConfirmationOpen(false);
    setIsProcessing(false);
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
        "nexzero-api-key": process.env.NEXT_PUBLIC_API_KEY!,
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

        <ConfirmationCard
        isOpen={confirmationOpen}
        title={confirmationAction === "delete" ? "Remove Member" : "Change Member Role"}
        message={
          confirmationAction === "delete"
            ? "Are you sure you want to remove this member from the team?"
            : `Are you sure you want to change this member's role to ${confirmationNewRole}?`
        }
        actionType={confirmationAction}
        memberName={getMemberById(team, confirmationMemberId)?.username || "Unknown"}
        newRole={confirmationAction === "role-change" ? confirmationNewRole : undefined}
        onConfirm={confirmationAction === "delete" ? confirmMemberDeletion : confirmRoleChange}
        onCancel={() => setConfirmationOpen(false)}
        isLoading={isProcessing} />

        {/* Form component */}
        <section
        className="fixed backdrop-blur backdrop-brightness-60 top-0 left-0 w-screen h-screen overflow-x-hidden overflow-y-auto justify-center py-10 z-20 hidden animate-fade-in-up animate-duration-200"
        ref={addIntgForm}
        onClick={toggleForm}>

          <CreatorForm
          action={async(e) => { await save_integrant(e) }}
          title="Add a new teammate"
          actionIsDisabled={formDisabled || !found || found.length < 1}
          hideAction={toggleForm}
          confirmMessage="Request integrant">
            
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
            className="w-full rounded-md bg-neutral-800/50 py-2 mb-3">
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
                  className="text-sm font-light cursor-default opacity-80 px-2">
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
            className="w-full rounded-md bg-neutral-800/50 py-2 mb-4">
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
                  className="text-sm font-light cursor-default opacity-80 px-2">
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
          action={`/projects/${params.id}`}
          name="Dashboard"
          isDisplayed={expanded}>
            <IconAppWindow
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

          <Icon
          action={`/projects/${team.team_id}/settings`}
          name="Project settings"
          isDisplayed={expanded}>
            <IconSettings
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
              { team.name } Integrants
            </h2>

            <p
            className="opacity-90">
              Manage project members and their permissions for <span className="font-semibold text-blue-500">{team?.name}</span>
            </p>

            <div
            className="flex gap-3 flex-wrap w-full justify-start items-center mt-5">
              <MainButton
              size="w-50"
              className="flex flex-row justify-center items-center gap-2"
              isDisabled={currentRole !== "admin"}
              action={toggleForm}>
                <IconUserPlus
                size={20}
                stroke={2} />
                Add a new integrant
              </MainButton>
            </div>
          </section>

          {/* Integrants section */}
          <section
          className="w-full border border-neutral-800 bg-neutral-950 backdrop-blur-sm rounded-md overflow-hidden shadow-xl relative z-10">
            <header
            className="px-6 py-4 border-b border-neutral-800 bg-neutral-950 flex justify-between items-center">
              <h3
              className="text-xl font-semibold text-white">
                Project integrants: {team?.integrants?.length || 0}
              </h3>
            </header>

            <div className="p-6">
              {team?.integrants && team.integrants.length > 0 ? (
                <>
                  <ul className="space-y-1 cursor-default">
                    { team.integrants && team.integrants.length > 0 && team.integrants.map((member: IntegrantData) => (
                      <li
                      key={member.id}
                      className="flex gap-4 py-3 px-2 rounded-lg transition-colors hover:bg-white/5 items-center group">
                          {/* Member profile picture */}
                        <div className="flex items-center gap-3">
                          {
                            member.avatar_url ? (
                            <Image
                            src={member.avatar_url}
                            alt={member.username + " profile picture"}
                            width={50}
                            height={50}
                            className="w-9 rounded-full"
                            preload
                            loading="eager" />
                            ) : (
                              <IconUserCircle
                              size={30}
                              stroke={1.5} />
                            )
                          }
                          <span className="font-medium text-neutral-200 group-hover:text-blue-500 transition-colors">
                            {member.username}
                          </span>
                        </div>

                        <span className="font-light text-neutral-400 truncate text-sm">
                          {member.email}
                        </span>


                          {/* Member role */}
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

                        {/* Member actions (Invalid in user) */}
                        {
                          member.id !== user.id ? (
                            <div className="flex justify-end gap-2">
                              <button
                              type="button"
                              onClick={() => changeMemberRole(member.id, member.type || "member")}
                              disabled={!isUserAdmin(team, user?.id)}
                              className="p-1 rounded-md bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                              title={isUserAdmin(team, user?.id) ? `Change role to ${member.type === "admin" ? "member" : "admin"}` : "Only admins can change roles"}>
                                <IconUsers
                                size={16}
                                stroke={2} />
                              </button>

                              <button
                              type="button"
                              onClick={() => deleteMember(member.id)}
                              disabled={!isUserAdmin(team, user?.id)}
                              className="p-1 rounded-md bg-neutral-800 hover:bg-red-900 text-neutral-300 hover:text-red-400 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                              title={isUserAdmin(team, user?.id) ? "Remove member" : "Only admins can remove members"}>
                                <IconTrash
                                size={16}
                                stroke={2} />
                              </button>
                            </div>
                          ) : (
                            <span
                            className="text-neutral-500 w-full text-end pr-2">
                              You
                            </span>
                          )
                        }
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
                  href={`/projects/${team.team_id}/integrants/invite`}
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
        </main>
      </div>
    ) : (
      <LoadingDashboard />
    )
  )
};