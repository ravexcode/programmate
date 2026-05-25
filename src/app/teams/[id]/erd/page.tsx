//Client page
"use client";

//React imports
import { useState, useRef, useEffect, useCallback } from "react";

//Next imports
import { useParams, useRouter } from "next/navigation";

//Icons imports
import {
  IconCalendar,
  IconDatabase,
  IconDatabaseEdit,
  IconDatabaseOff,
  IconDatabasePlus,
  IconEye,
  IconEyeOff,
  IconFolder,
  IconHandStop,
  IconLayoutKanban,
  IconMessage,
  IconMouse,
  IconTrash,
  IconUsers
} from "@tabler/icons-react";

//Prebuilt ui imports
import SnackBar, { type SnackbarRef } from "@/components/ui/snackbar";
import SideBar from "@/components/ui/sidebar";
import LoadingDashboard from "@/components/screens/loading-screen";
import { Icon } from "../page";
import ColumnNode from "@/components/ui/column-node";
import ButtonControl from "@/components/ui/button-control";
import { TableContainerNode } from "@/components/ui/table-node";
import CreatorForm from "@/components/forms/creator-form";
import CreatorInput from "@/components/forms/creator-inputs";

//Services imports
import UpdateUserData from "@/services/user.service";
import { searchTeamData } from "../page";

//Hooks imports
import { useGetToken } from "@/hooks/useCookies";

//Types imports
import { type UserData } from "@/types/user.types";
import Team from "@/types/team.types";
import { RowData, ParentNode } from "@/types/table.types";

//React flow imports
import {
  Background,
  BackgroundVariant,
  ReactFlow,
  type Node,
  type Connection,
  type Edge,
  useNodesState,
  useEdgesState,
  NodeTypes,
  addEdge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

//Reactflow settings
//Node types
const nodeTypes: NodeTypes = {
  tableContainer: TableContainerNode,
  columnHandle: ColumnNode,
};
//Edges settings
const defaultEdgeOptions = {
  type: 'default',
  animated: true,
  className: 'stroke-amber-500 stroke-2',
};

const ROW_HEIGHT = 36;
const HEADER_HEIGHT = 38;

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
  //React flow draggable
  const [ cursor, setCursor ] = useState<"drag" | "mouse" | "create" | "edit">("drag");
  //Save button loading
  const [ isSaveLoading, setIsSaveLoading ] = useState<boolean>(false);

  //React flow states
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  //Creator form states
  //Title
  const [ newName, setNewName ] = useState<string>("");
  //Title
  const [ newRows, setNewRows ] = useState<Array<RowData>>([]);

  //Components
  //Snackbar
  const snackbar = useRef<SnackbarRef>(null);
  //Table creator
  const form = useRef(null);
  //Table editor
  const editor = useRef(null);

  //Data fetching
  useEffect(() => {
    async function fetchData(){
      const token = useGetToken();

      if(!token) return router.push("/auth/login");

      const user_data = await UpdateUserData(token);
      setUser(user_data);

      const team_data : Team = await searchTeamData(
        snackbar,
        params,
        setTeam
      )

      if(!team_data) return router.push("/dashboard");

      setNodes(team_data.ERD || []);
      setEdges(team_data.ERD_connections || []);
    }

    fetchData();
  }, []);

  //Togglers
  const toggleCreatorForm = () => {
    if(!form.current) return;

    const current : HTMLElement = form.current;

    if(current.classList.contains("hidden")) {
      current.classList.remove("hidden");
      current.classList.add("flex");
      setCursor("create");

      return;
    }
    
    current.classList.add("hidden");
    current.classList.remove("flex");
    setCursor("mouse");

    return;
  };

  const toggleEditor = () => {
    if(!editor.current) return;

    const current : HTMLElement = editor.current;

    if(current.classList.contains("hidden")) {
      current.classList.remove("hidden");
      current.classList.add("flex");
      setCursor("edit");

      return;
    }
    
    current.classList.add("hidden");
    current.classList.remove("flex");
    setCursor("mouse");

    return;
  };

  //Row field updater
  const handleUpdateField = (
    index: number,
    value?: string,
    type?: string
  ) => {
    //Duplicate the value
    let rows_duplied = [... newRows];

    //Sets value
    rows_duplied[index].name = value || "";

    //Sets type
    rows_duplied[index].type = type || "";

    //Updates
    setNewRows(rows_duplied);
  };

  //Table creator
  const createNewTable = (e: React.SubmitEvent) => {
    e.preventDefault();

    if(!newName || !newRows || newRows.length < 1) return;

    //Nodes
    const table_nodes : Array<Node> = [];

    //Creates the table
    const newTable : ParentNode = {
      id: `${newName}-table`,
      type: "tableContainer",
      position: {
        x: 0,
        y: 0
      },
      data: {
        tableName: newName,
        columns: newRows
      }
    }

    table_nodes.push(newTable);

    //Creates the nodes
    for (let index = 0; index < newRows.length; index++) {
      const newNode: Node = {
        id: `col-${newName}-${newRows[index].name}`,
        type: "columnHandle",
        parentId: `${newName}-table`,
        extent: "parent",
        position: {
          x: 0,
          y: HEADER_HEIGHT + (ROW_HEIGHT * index)
        },
        draggable: false,
        data: {}
      }

      table_nodes.push(newNode);
    }

    //Saves the nodes
    setNodes((prevNodes) => [...prevNodes, ...table_nodes]);

    //Clears the data
    setNewRows([]);
    setNewName("");
    toggleCreatorForm();
  }

  //Connection handler
  const onConnect = useCallback((connection: Connection) => {
    setEdges((prevEdges) => 
      addEdge(connection, prevEdges)
    );
  }, [setEdges]);

  //Database handler
  const saveERD = async() => {
    setIsSaveLoading(true);

    const token = useGetToken();

    if(!token) return router.push("/auth/login");

    const res = await fetch(
      `/api/teams/${params.id}/erd`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
          "Authorization": token
        },
        body: JSON.stringify({
          teamId: params.id,
          connections: edges || [],
          erd: nodes || []
        })
      }
    );

    const data = await res.json();

    if(res.status !== 200) {
      snackbar.current?.showSnackBar(data.message, true);
      setIsSaveLoading(false);
      return;
    }

    setIsSaveLoading(false);
    return;
  }

  return (
    team && user ? (
      <div
      className="bg-background grid grid-cols-[auto_1fr] min-h-screen w-screen text-text overflow-hidden">
        <SnackBar ref={snackbar} />

        {/* Table creator form */}
        <div
        className="w-screen h-screen fixed hidden items-start justify-center backdrop-brightness-50 backdrop-blur-xs z-10 overflow-hidden animate-fade-in"
        ref={form}
        onClick={toggleCreatorForm}>

          <CreatorForm
          title="Create a new table"
          action={(e) => {
            createNewTable(e);
          }}
          actionIsDisabled={!newName || !newRows || newRows.length < 1}
          hideAction={toggleCreatorForm}>

            <CreatorInput
            onChange={(e) => {
              setNewName(e.target.value);
            }}
            label="Set table name"
            value={newName || ""}
            placeholder="e.g. Users" />

            {
              newRows && newRows.length > 0 && newRows.map((row, index) =>
                <section
                className="flex flex-col gap-1 w-full my-2"
                key={index}>

                  <div
                  className="flex justify-between items-center text-sm mb-2">
                    <p
                    className="tracking-wide">
                      {
                        newRows[index].name ? newRows[index].name.slice(0, 1).toUpperCase() +
                        newRows[index].name.slice(1, 10) +
                        ( newRows[index].name.length > 10 ? "..." : "" )
                        + "'s " :
                        "Undefined "
                      }
                      row
                    </p>

                    <button
                    type="button"
                    onClick={() => {
                      setNewRows(prev => 
                        prev.filter((_, _index) =>
                          _index !== index
                        )
                      )
                    }}
                    className="cursor-pointer">
                      <IconTrash
                      size={18}
                      stroke={2}
                      color="red" />
                    </button>
                  </div>

                  <div
                  className="grid grid-cols-2 gap-3 w-full">

                    <div
                    className="flex flex-col gap-1 text-sm">
                      <label
                      className="uppercase text-xs font-medium tracking-wide">
                        Value
                      </label>
                      <input
                      placeholder="e.g. email"
                      className="rounded-md w-full border border-transparent duration-200 outline-none focus:border-main bg-neutral-800 p-2"
                      value={newRows[index].name || ""}
                      onChange={(e) => {
                        handleUpdateField(index, e.target.value, newRows[index].type);
                      }} />
                    </div>

                    <div
                    className="flex flex-col gap-1 text-sm">
                      <label
                      className="uppercase text-xs font-medium tracking-wide">
                        Type
                      </label>
                      <input
                      placeholder="e.g. VARCHAR"
                      className="rounded-md w-full border border-transparent duration-200 outline-none focus:border-main bg-neutral-800 p-2"
                      value={newRows[index].type || ""}
                      onChange={(e) => {
                        handleUpdateField(index, newRows[index].name, e.target.value);
                      }} />
                    </div>

                  </div>

                </section>
              ) 
            }

            <button
            className="text-sm my-3 p-2 w-full rounded-md bg-neutral-800 opacity-50 border border-dashed border-neutral-600 cursor-pointer duration-400 hover:opacity-80"
            type="button"
            onClick={() =>{
              setNewRows(prev => [
                ...prev || [],
                {
                  type: "",
                  name: "",
                  key: `${newRows.length + 1}-id`
                }
              ])
            }}>
              Add a new row +
            </button>

          </CreatorForm>

        </div>

        {/* Table editor */}
        <div
        className="w-screen h-screen fixed hidden items-center justify-end backdrop-brightness-50 backdrop-blur-xs z-10 overflow-hidden animate-fade-in"
        ref={editor}
        onClick={toggleEditor}>

          <section
          className="h-full w-120 animate-fade-in-left bg-neutral-900 px-4"
          onClick={(e) => {
            e.nativeEvent.stopPropagation();
            e.stopPropagation();
          }}>
            {
              nodes && nodes.length > 0 ? 
                nodes.map((node: any, node_index) =>
                  node.data && node.data.tableName && (
                    <section
                    key={node_index}
                    className="w-full flex flex-col gap-2 my-6 bg-neutral-800 py-3 px-5 rounded-xl text-center">
                      <div
                      className="flex justify-between items-center">
                        <p
                        className="font-medium tracking-wider uppercase">
                          {node.data.tableName}
                        </p>

                        <IconTrash
                        size={20}
                        color="red"
                        className="cursor-pointer" />
                      </div>

                      {
                        node.data.colums && node.data.colums.map((column: any, column_index: number) => {
                          
                        })
                      }
                    </section>
                  )
              ) : (
                <div
                className="flex flex-col items-center justify-start py-10">
                  <IconDatabaseOff
                  size={50}
                  stroke={1} />
                  <p
                  className="text-xl font-medium tracking-wide mt-2">
                    You don't have tables yet
                  </p>
                  <p
                  className="text-neutral-400">
                    Create a new table for this database!
                  </p>

                  <button
                  type="button"
                  className="mt-4 rounded-lg bg-main py-2 px-6 duration-400 hover:bg-main/60 cursor-pointer"
                  onClick={() => {
                    toggleCreatorForm();
                    toggleEditor();
                  }}>
                    Create a new one
                  </button>
                </div>
              )
            }
          </section>

        </div>

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
        panOnDrag={cursor === "drag"}
        zoomOnScroll={cursor === "drag"}
        onConnect={onConnect}
        defaultEdgeOptions={defaultEdgeOptions}>
          <Background
          variant={BackgroundVariant.Dots}
          className="brightness-75" />
        </ReactFlow>

        {/* Buttons controls */}
        <section
        className="fixed bottom-4 left-1/2 -translate-x-1/2 px-6 py-2 rounded-md flex gap-3 justify-center items-center bg-neutral-900 duration-500 border border-neutral-700 animate-fade-in-up">
          {/* Mouse toggler */}
          <ButtonControl
          content="Set mouse"
          action={() => {
            setCursor("mouse");
          }}
          active={cursor === "mouse"}>
            <IconMouse
            size={20} />
          </ButtonControl>

          {/* Drag toggler */}
          <ButtonControl
          content="Toggle drag"
          action={() => {
            setCursor(prev => prev === "drag" ? "mouse" : "drag");
          }}
          active={cursor === "drag"}>
            <IconHandStop
            size={20} />
          </ButtonControl>

          {/* Table creator */}
          <ButtonControl
          content="Create new table"
          action={toggleCreatorForm}
          active={cursor === "create"}>
            <IconDatabasePlus
            size={20} />
          </ButtonControl>

          {/* Table editor */}
          <ButtonControl
          content="Edit tables"
          action={toggleEditor}
          active={cursor === "edit"}>
            <IconDatabaseEdit
            size={20} />
          </ButtonControl>

          {/* Save handler */}
          <button
          type="button"
          className="h-10 w-30 rounded-lg bg-main cursor-pointer duration-400 hover:bg-main/60 font-medium tracking-wide disabled:grayscale disabled:hover:bg-main disabled:cursor-wait"
          disabled={isSaveLoading}
          onClick={async() => {
            await saveERD();
          }} >
            Save
          </button>
        </section>
        
      </div>
    ) : (
      <LoadingDashboard />
    )
  )
};