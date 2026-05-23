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
import LoadingDashboard from "@/components/screens/loading-screen";
import { Icon } from "../page";
import ColumnNode from "@/components/ui/column-node";

//Services imports
import UpdateUserData from "@/services/user.service";
import { searchTeamData } from "../page";

//Hooks imports
import { useGetToken } from "@/hooks/useCookies";

//Types imports
import { type UserData } from "@/types/user.types";
import Team, { ERDTable, ERDColumns, ERDConnections } from "@/types/team.types";
import { TableNodeData } from "@/types/table.types";

//React flow imports
import {
  Background,
  BackgroundVariant,
  ReactFlow,
  type Node,
  type Edge,
  useNodesState,
  useEdgesState,
  NodeTypes
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { TableContainerNode } from "@/components/ui/table-node";

const nodeTypes: NodeTypes = {
  tableContainer: TableContainerNode,
  columnHandle: ColumnNode,
};

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
  //const [ nodes, setNodes ] = useState<Array<Node>>([]);
  //const [ edges, setEdges ] = useState<Array<Edge>>([]);

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
  }, []);




  
  //Debug

// Alturas calculadas a partir de las clases de Tailwind (h-9 = 36px)
const ROW_HEIGHT = 36;
const HEADER_HEIGHT = 38;

const initialNodes: Node[] = [
  // ==========================================
  // TABLA: USERS
  // ==========================================
  {
    id: 'users-table',
    type: 'tableContainer',
    position: { x: 100, y: 100 },
    data: {
      tableName: 'users',
      columns: [
        { name: 'id', type: 'INT', isPk: true },
        { name: 'email', type: 'VARCHAR(255)' },
      ],
    } satisfies TableNodeData,
  },
  {
    id: 'col-users-id',
    type: 'columnHandle',
    parentId: 'users-table',draggable: false,
    extent: 'parent',
    position: { x: 0, y: HEADER_HEIGHT + (ROW_HEIGHT * 0) },
  },
  {
    id: 'col-users-email',
    type: 'columnHandle',
    parentId: 'users-table',
    extent: 'parent',draggable: false,
    position: { x: 0, y: HEADER_HEIGHT + (ROW_HEIGHT * 1) },
  },

  // ==========================================
  // TABLA: ORDERS
  // ==========================================
  {
    id: 'orders-table',
    type: 'tableContainer',
    position: { x: 550, y: 150 },
    data: {
      tableName: 'orders',
      columns: [
        { name: 'id', type: 'INT', isPk: true },
        { name: 'user_id', type: 'INT' },
      ],
    } satisfies TableNodeData,
  },
  {
    id: 'col-orders-id',
    type: 'columnHandle',
    parentId: 'orders-table',draggable: false,
    extent: 'parent',
    position: { x: 0, y: HEADER_HEIGHT + (ROW_HEIGHT * 0) },
  },
  {
    id: 'col-orders-user_id',
    type: 'columnHandle',
    parentId: 'orders-table',draggable: false,
    extent: 'parent',
    position: { x: 0, y: HEADER_HEIGHT + (ROW_HEIGHT * 1) },
  },
];

const initialEdges: Edge[] = [
  {
    id: 'edge-users-orders',
    source: 'col-users-id',
    target: 'col-orders-user_id',
    className: 'stroke-amber-500 stroke-2', // Clases Tailwind para estilizar la línea
  },
];

  //@ts-ignore
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

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

        <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        colorMode="dark"
        draggable
        nodesDraggable>
          <Background
          variant={BackgroundVariant.Dots} />
        </ReactFlow>
        
      </div>
    ) : (
      <LoadingDashboard />
    )
  )
};