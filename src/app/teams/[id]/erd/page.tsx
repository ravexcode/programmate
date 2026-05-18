//Client page
"use client";

//React imports
import { useState, useRef, useEffect } from "react";

//Next imports
import { useParams, useRouter } from "next/navigation";

//Icons imports
import {
  IconCalendar,
  IconDatabase,
  IconEye,
  IconFolder,
  IconLayoutKanban,
  IconMessage,
  IconUsers
} from "@tabler/icons-react";

//Prebuilt ui imports
import SnackBar, { type SnackbarRef } from "@/components/ui/snackbar";
import SideBar from "@/components/ui/sidebar";
import LoadingDashboard from "@/components/screens/loading_dashboard";
import { Icon } from "../page";

//Services imports
import UpdateUserData from "@/services/user.service";
import { searchTeamData } from "../page";

//Hooks imports
import { useGetToken } from "@/hooks/useCookies";

//Types imports
import { type UserData } from "@/types/user.types";
import Team, { ERDTable, ERDColumns, ERDConnections } from "@/types/team.types";

//React flow imports
import {
  Background,
  BackgroundVariant,
  ReactFlow,
  type Node,
  type Edge
} from "@xyflow/react";

export default function Page(){
  //Next router data
  //Params
  const params = useParams();
  //Router
  const router = useRouter();

  //React states
  //User
  const [ user, setUser ] = useState<UserData>();
  //Team
  const [ team, setTeam ] = useState<Team>();
  //Sidebar expanded
  const [ expanded, setExpanded ] = useState<boolean>(false);

  //React flow states
  const [ nodes, setNodes ] = useState<Array<Node>>([]);
  const [ edges, setEdges ] = useState<Array<Edge>>([]);

  //Components
  const snackbar = useRef<SnackbarRef>(null);

  //Data fetching
  useEffect(() => {
    async function fetchData(){
      const token = useGetToken();

      if(!token) return router.push("/auth/login");

      const user_data = await UpdateUserData(token);
      setUser(user_data);

      await searchTeamData(
        snackbar,
        params,
        setTeam
      )
    }

    fetchData();
  }, [])

  return (
    team && user ? (
      <div
      className="bg-background grid grid-cols-[auto_1fr] min-h-screen w-screen text-text">
        
        <SnackBar ref={snackbar} />

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
      </div>
    ) : (
      <LoadingDashboard />
    )
  )
};