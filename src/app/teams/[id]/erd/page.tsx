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

//Services imports
import UpdateUserData from "@/services/user.service";
import { searchTeamData } from "../page";

//Hooks imports
import { useGetToken } from "@/hooks/useCookies";

//Types imports
import { type UserData } from "@/types/user.types";
import Team from "@/types/team.types";

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
import CreatorForm from "@/components/forms/creator-form";
import CreatorInput from "@/components/forms/creator-inputs";

const nodeTypes: NodeTypes = {
  tableContainer: TableContainerNode,
  columnHandle: ColumnNode,
};

type Row = {
  value: string;
  type: string;
  is_pk?: boolean;
}

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

  //React flow states
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  //Creator form states
  //Title
  const [ newName, setNewName ] = useState<string>("");
  //Title
  const [ newRows, setNewRows ] = useState<Array<Row>>([]);

  //Components
  //Snackbar
  const snackbar = useRef<SnackbarRef>(null);
  //Creator form
  const form = useRef(null);

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

  const handleUpdateField = (
    index: number,
    value?: string,
    type?: string
  ) => {
    //Duplicate the value
    let rows_duplied = [... newRows];

    //Sets value
    rows_duplied[index].value = value || "";

    //Sets type
    rows_duplied[index].type = type || "";

    //Updates
    setNewRows(rows_duplied);
  }

  return (
    team && user ? (
      <div
      className="bg-background grid grid-cols-[auto_1fr] min-h-screen w-screen text-text overflow-hidden">
        <SnackBar ref={snackbar} />

        <div
        className="w-screen h-screen fixed flex items-start justify-center backdrop-brightness-50 backdrop-blur-xs z-10 overflow-hidden"
        ref={form}
        onClick={toggleCreatorForm}>

          <CreatorForm
          title="Create a new table"
          action={() => {}}
          actionIsDisabled={!newName || !newRows || newRows.length < 1}
          hideAction={toggleCreatorForm}>

            <CreatorInput
            onChange={(e) => {
              setNewName(e.target.value);
            }}
            label="Set table name"
            value={newName}
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
                        newRows[index].value ? newRows[index].value.slice(0, 1).toUpperCase() +
                        newRows[index].value.slice(1, 10) +
                        ( newRows[index].value.length > 10 ? "..." : "" )
                        + "'s " :
                        "Undefined's "
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
                      value={newRows[index].value || ""}
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
                        handleUpdateField(index, newRows[index].value, e.target.value);
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
                  value: ""
                }
              ])
            }}>
              Add a new row +
            </button>

          </CreatorForm>

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
        className="relative">
          <Background
          variant={BackgroundVariant.Dots}
          className="brightness-75" />
        </ReactFlow>

        <section
        className="absolute bottom-4 left-1/2 -translate-x-1/2 px-6 py-2 rounded-md flex gap-3 justify-center items-center bg-neutral-900 duration-500 border border-neutral-700 animate-fade-in-up">
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
        </section>
        
      </div>
    ) : (
      <LoadingDashboard />
    )
  )
};