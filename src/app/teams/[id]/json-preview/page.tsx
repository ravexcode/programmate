//Client side
"use client"

//Next imports
import { useParams } from "next/navigation";

//React imports
import { useEffect, useState, useRef, useCallback } from "react";

//Types imports
import { UserData } from "@/types/user.types";

//Prebuild ui imports
import SideBar, { Icon } from "@/components/ui/sidebar";
import AIChat from "@/components/ui/ai-chat";
import SnackBar, { showSnackbar } from "@/components/ui/snackbar";
import LoadingDashboard from "@/components/screens/loading-screen";
import { JsonNode } from "@/components/ui/json-node";

//Hooks imports
import { searchTeamData } from "@/app/teams/[id]/page";

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

//Reactflow imports
import {
  ReactFlow,
  Background,
  type Node,
  type NodeTypes,
  useNodesState,
  useEdgesState,
  Edge,
  Connection,
  addEdge
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

const nodeTypes: NodeTypes = {
  container: JsonNode,
}
//Edges settings
const defaultEdgeOptions = {
  type: 'default',
  animated: true,
  className: 'stroke-amber-500 stroke-2',
};

export default function Page(){
  //URL id
  const params = useParams();

  //States handler
  //User data
  const [ user, setUser ] = useState<UserData>();
  //Sidebar expanded
  const [ expanded, setExpanded ] = useState<boolean>(false);
  //Team data
  const [ team, setTeam ] = useState<any>(null);
  
  //Default nodes (initial)
  const initialNodes: Node[] = [
    {
      id: "main-parent",
      position: { x: 0, y: 0 },
      data: {
        content: "Hello world"
      },
      type: "container",
      draggable: true
    }
  ];

  //Reactflow
  const [ nodes, setNodes, onNodesChange ] = useNodesState<Node>(initialNodes);
  const [ edges, setEdges, onEdgesChange ] = useEdgesState<Edge>([]);

  //Snackbar container
  const snackbar = useRef(null);

  //Sets the data
  useEffect(() => {
    //Gets user from cache
    const cached = window.localStorage.getItem("user");
    if(!cached) window.location.href = "/auth/login";
    //Parses
    const parsed = JSON.parse(cached!);
    //Sets data
    setUser(parsed);

    //Gets team data
    searchTeamData(
      snackbar,
      params,
      setTeam
    );
  }, []);

  //Connection handler
  const onConnect = useCallback((connection: Connection) => {
    setEdges((prevEdges) => 
      addEdge(connection, prevEdges)
    );
  }, [setEdges]);

  return (
    team ? (
      <div
      className="bg-background grid grid-cols-[auto_1fr] text-text">

          <AIChat />
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
        
          <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
          colorMode="dark"
          nodeTypes={nodeTypes}
          onConnect={onConnect}
          defaultEdgeOptions={defaultEdgeOptions} >
            <Background className="brightness-80" />
          </ReactFlow>
      </div>
    ) : (
      <LoadingDashboard />
    )
  )
};