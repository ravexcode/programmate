//Client side
"use client";

//Next imports
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

//React imports
import { useEffect, useState, useRef } from "react";

//Client imports
import {
  loadIntegrantsPage,
  saveIntegrants,
  applyRoleChange,
  removeTeamMember,
  findUsers,
  canManageTeam,
  toggleRole,
  applyRoleChangeToTeam,
  removeMemberFromTeam,
  type SearchedUser,
} from "@/client/projects/members";
import { toggleOverlay } from "@/client/projects/shared";

//Prebuilt ui imports
import TeamSideBar from "@/components/dashboard/team-sidebar";
import LoadingDashboard from "@/components/screens/loading-screen";
import SnackBar from "@/components/ui/snackbar";
import ConfirmationCard from "@/components/ui/confirmation-card";
import CreatorForm from "@/components/forms/creator-form";
import MainButton from "@/components/ui/buttons/main";

//Icons imports
import {
  IconUsers,
  IconUserPlus,
  IconTrash,
  IconShieldCheck,
  IconShield,
  IconUserCircle
} from "@tabler/icons-react";

//Types imports
import type Team from "@/types/team.types";
import type { UserData } from "@/types/user.types";
import type { IntegrantData } from "@/types/team.types";

export default function Page(){
  //NextJS Setup
  const params = useParams();
  const router = useRouter();

  //States handler
  //User data
  const [ user, setUser ] = useState<UserData>();
  //Team data
  const [ team, setTeam ] = useState<Team | null>(null);
  //Form toggler
  const [ formDisabled, setFormDisabled ] = useState<boolean>(false);
  //Searcher value
  const [ searched, setSearched ] = useState<string>("");
  //Found
  const [ found, setFound ] = useState<SearchedUser[]>();
  //Found
  const [ added, setAdded ] = useState<SearchedUser[]>();
  //Searcher status
  const [ searchStatus, setSearchStatus ] = useState<"not-searched" | "not-found" | "searching">("not-searched");

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

  useEffect(() => {
    async function get() {
      const data = await loadIntegrantsPage(Number(params.id), router, snackbar);

      if(!data) return;

      setUser(data.user);
      setTeam(data.team);

      return;
    }

    get();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const save_integrant = async(e: React.FormEvent) => {
    if(!added) return;

    e.preventDefault();
    setFormDisabled(true);

    await saveIntegrants(Number(params.id), added, router, snackbar);

    toggleOverlay(addIntgForm);
    setFound(undefined);
    setAdded(undefined);
    setFormDisabled(false);
  }

  //Change member role
  const changeMemberRole = (memberId: string, currentRole: string) => {
    if(!canManageTeam(team, user?.id)) return;

    // Open confirmation dialog
    setConfirmationMemberId(memberId);
    setConfirmationAction("role-change");
    setConfirmationNewRole(toggleRole(currentRole));
    setConfirmationOpen(true);
  }

  //Confirm role change
  const confirmRoleChange = async() => {
    if(!team) return;

    setIsProcessing(true);

    const success = await applyRoleChange(
      Number(params.id),
      confirmationMemberId,
      confirmationNewRole,
      router,
      snackbar
    );

    if(success) {
      setTeam(applyRoleChangeToTeam(team, confirmationMemberId, confirmationNewRole));
    }

    setConfirmationOpen(false);
    setIsProcessing(false);
  }

  //Delete member from team
  const deleteMember = (memberId: string) => {
    if(!canManageTeam(team, user?.id)) return;

    // Open confirmation dialog
    setConfirmationMemberId(memberId);
    setConfirmationAction("delete");
    setConfirmationOpen(true);
  }

  //Confirm member deletion
  const confirmMemberDeletion = async() => {
    if(!team) return;

    setIsProcessing(true);

    const success = await removeTeamMember(
      Number(params.id),
      confirmationMemberId,
      router,
      snackbar
    );

    if(success) {
      setTeam(removeMemberFromTeam(team, confirmationMemberId));
    }

    setConfirmationOpen(false);
    setIsProcessing(false);
  }

  //User searcher
  const searchUsersHandler = async() => {
    if(!searched || searched.length < 1) return;

    setSearchStatus("searching");

    const users = await findUsers(searched, snackbar);

    if(users.length > 0) {
      setFound(users);
      setSearchStatus("not-searched");
      return;
    }

    setFound(undefined);
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
        memberName={team.integrants.find(int => int.id === confirmationMemberId)?.username || "Unknown"}
        newRole={confirmationAction === "role-change" ? confirmationNewRole : undefined}
        onConfirm={confirmationAction === "delete" ? confirmMemberDeletion : confirmRoleChange}
        onCancel={() => setConfirmationOpen(false)}
        isLoading={isProcessing} />

        {/* Form component */}
        <section
        className="fixed backdrop-blur backdrop-brightness-60 top-0 left-0 w-screen h-screen overflow-x-hidden overflow-y-auto justify-center py-10 z-20 hidden animate-fade-in-up animate-duration-200"
        ref={addIntgForm}
        onClick={() => toggleOverlay(addIntgForm)}>

          <CreatorForm
          action={async(e) => { await save_integrant(e) }}
          title="Add a new teammate"
          actionIsDisabled={formDisabled || !found || found.length < 1}
          hideAction={() => toggleOverlay(addIntgForm)}
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
                searchUsersHandler();
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

        <TeamSideBar
        user={user}
        team={team} />

        <main
        className="w-full h-screen overflow-hidden overflow-y-auto py-5 px-18 bg-background relative flex flex-col justify-start items-start">
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
              isDisabled={!canManageTeam(team, user.id)}
              action={() => toggleOverlay(addIntgForm)}>
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
                Project integrants: {team.integrants?.length || 0}
              </h3>
            </header>

            <div className="p-6">
              {team.integrants && team.integrants.length > 0 ? (
                <ul className="space-y-1 cursor-default">
                  { team.integrants.map((member: IntegrantData) => (
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

                      {/* Member actions */}
                      {
                        member.id !== user.id ? (
                          <div className="flex justify-end gap-2">
                            <button
                            type="button"
                            onClick={() => changeMemberRole(member.id, member.type || "member")}
                            disabled={!canManageTeam(team, user.id)}
                            className="p-1 rounded-md bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            title={canManageTeam(team, user.id) ? `Change role to ${member.type === "admin" ? "member" : "admin"}` : "Only admins can change roles"}>
                              <IconUsers
                              size={16}
                              stroke={2} />
                            </button>

                            <button
                            type="button"
                            onClick={() => deleteMember(member.id)}
                            disabled={!canManageTeam(team, user.id)}
                            className="p-1 rounded-md bg-neutral-800 hover:bg-red-900 text-neutral-300 hover:text-red-400 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            title={canManageTeam(team, user.id) ? "Remove member" : "Only admins can remove members"}>
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
                  <MainButton
                  size="w-auto"
                  className="flex items-center gap-2"
                  action={() => toggleOverlay(addIntgForm)}>
                    <IconUserPlus
                    size={18}
                    stroke={2} />
                    Invite Member
                  </MainButton>
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
