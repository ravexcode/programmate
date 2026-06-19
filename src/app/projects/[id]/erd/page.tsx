//Client page
"use client";

//React imports
import { useState, useRef, useEffect, useCallback } from "react";

//Next imports
import { useParams, useRouter } from "next/navigation";

//Icons imports
import {
  IconAppWindow,
  IconCalendar,
  IconCheck,
  IconCopy,
  IconDatabase,
  IconDatabaseEdit,
  IconDatabaseMinus,
  IconDatabaseOff,
  IconDatabasePlus,
  IconEye,
  IconFolder,
  IconHandStop,
  IconLayoutKanban,
  IconMessage,
  IconMouse,
  IconSettings,
  IconTrash,
  IconUsers
} from "@tabler/icons-react";

//Prebuilt ui imports
import SnackBar, { showSnackbar } from "@/components/ui/snackbar";
import SideBar, { Icon } from "@/components/ui/sidebar";
import LoadingDashboard from "@/components/screens/loading-screen";
import ColumnNode from "@/components/ui/column-node";
import ButtonControl from "@/components/ui/button-control";
import { TableContainerNode } from "@/components/ui/table-node";
import CreatorForm from "@/components/forms/creator-form";
import CreatorInput from "@/components/forms/creator-inputs";

//Services imports
import getTeam from "@/services/team.service";
import getUser from "@/services/user.service";

//Hooks imports
import { useGetToken } from "@/hooks/useCookies";

//Types imports
import { type UserData } from "@/types/user.types";
import Team from "@/types/team.types";
import { ParentNode } from "@/types/table.types";

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
  type NodeTypes,
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

//Colums type
export interface Column {
  key: string;
  name: string;
  type: string;
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
  //Save button loading
  const [ isSaveLoading, setIsSaveLoading ] = useState<boolean>(false);

  //React flow states
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  //Export values
  const [ sqlValue, setsqlValue ] = useState("");
  const [ jsonValue, setJsonValue ] = useState("");

  //Copy button success
  const [ sqlCopied, setSqlCopied ] = useState(false);
  const [ jsonCopied, setJsonCopied ] = useState(false);

  //Creator form states
  //Title
  const [ newName, setNewName ] = useState<string>("");
  //Title
  const [ newRows, setNewRows ] = useState<Array<Column>>([]);

  //Components
  //Snackbar
  const snackbar = useRef(null);
  //Table creator
  const form = useRef(null);
  //Table editor
  const editor = useRef(null);
  //Table exporter
  const exporter = useRef(null);

  //Set expanded based in localstorage
  useEffect(() => {
    const expanded = window.localStorage.getItem("expanded");

    if(expanded) return setExpanded(true);

    return;
  }, []);

  //Data fetching
  useEffect(() => {
    async function fetchData(){
      const token = useGetToken();

      if(!token) return router.push("/auth/login");

      const user_data = await getUser(token);
      setUser(user_data);

      const team_data : Team = await getTeam(
        Number(params.id),
        token,
        snackbar
      );

      if(!team_data) return router.push("/dashboard");

      setTeam(team_data)
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

  const toggleExporter = () => {
    if(!exporter.current) return;

    const current : HTMLElement = exporter.current;

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
    //Rows
    let rows : Column[] = [];

    //Asigns the key for all columns
    for (let l_i = 0; l_i < newRows.length; l_i++) {
      const row = newRows[l_i];
      row.key = `row-${newName}-${l_i}`;

      rows.push(row);
    }

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
        columns: rows
      }
    }

    table_nodes.push(newTable);

    //Creates the nodes
    for (let index = 0; index < newRows.length; index++) {
      const newNode: Node = {
        id: `col-${newName}-${index + 1}`,
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
      showSnackbar(data.message, (res.status >= 500 ? "critic" : "warn"), snackbar);
      setIsSaveLoading(false);
      return;
    }

    setIsSaveLoading(false);
    return;
  }

  //Node adder
  const addNewNode = (table : Node) => {
    //Adds the row values
    setNodes((prev) =>
      prev.map((node) => {
        if (node.id !== table.id) return node

        return {
          ...node,
          data: {
            ...node.data,
            columns: [
              ...(node.data.columns as Column[]) || [], {
                key: `row-${table.data.tableName}-${(table.data.columns as Column []).length + 1}`,
                name: "",
                type: ""
              }
            ]
          }
        }
      })
    );

    //Adds the connector node
    setNodes((prev) => [
      ...prev || [],
      {
        id: `col-${table.data.tableName}-${(table.data.columns as Column[]).length + 1}`,
        type: "columnHandle",
        parentId: `${table.data.tableName}-table`,
        extent: "parent",
        position: {
          x: 0,
          y: HEADER_HEIGHT + (ROW_HEIGHT * (table.data.columns as Column[]).length)
        },
        draggable: false,
        data: {}
      }
    ]);

    return;
  }

  //Node remover
  const removeColumn = (table: Node, column_index: number) => {
    //Deletes node container
    setNodes((prev) =>
      prev.map((node) => {
        if (node.id !== table.id) return node

        return {
          ...node,
          data: {
            ...node.data,
            columns: (node.data.columns as Column[]).filter((_, index) =>
              index !== column_index
            )
          }
        }
      })
    );

    //Removes the connector node
    setNodes((prev) => {
        const filtered_nodes = prev.filter((_, index) => column_index !== index);

        let rowIndex = 0;

        return filtered_nodes.map((node) => {
          if(node.parentId === `${table.data.tableName}-table` && node.type === "columnHandle") {
            const updatedNode = {
              ...node,
              position: {
                x: 0,
                y: HEADER_HEIGHT + (ROW_HEIGHT * rowIndex)
              }
            };
            rowIndex++;

            return updatedNode;
          }

          return node;
        })
      }
    );
  }

  //Table "translator"
  //SQL
  const translateToSQL = (json: {
    tableName: String,
    columns: Column[]
  }) => {
    const columns = json.columns
    .map(col => `${col.name.toLowerCase()} ${col.type.toUpperCase()}`)
    .join(",\n    ")

const sql = `CREATE TABLE ${json.tableName} (
    ${columns}
);`;

    return sql;
  }
  //Json (yep, it needs to be translated)
  const translateToJson = (json: {
    tableName: String,
    columns: Column[]
  }) => {
    const exportJson = JSON.stringify(
      {
        name: json.tableName,
        columns: json.columns.map(col => ({
          name: col.name,
          type: col.type
        }))
      },
      null,
      2
    )

    return exportJson
  }

  //Tables filtered
  const tableNodes = nodes.filter(
    (node) => node.type === "tableContainer"
  )

  return (
    team && user ? (
      <div
      className="bg-background grid grid-cols-[auto_1fr] min-h-screen w-screen text-text overflow-hidden">
        <SnackBar ref={snackbar} />

        {/* DB Data exported */}
        <div
        className="w-screen h-screen fixed top-0 left-0 hidden justify-center items-start backdrop-brightness-50 backdrop-blur-xs z-10 overflow-y-auto animate-fade-in"
        ref={exporter}
        onClick={toggleExporter}>
          <section
          className="w-150 h-200 bg-neutral-900 my-10 mr-20 rounded-md px-6 py-3 flex flex-col gap-2 animate-fade-in-up"
          onClick={(e) => {
            e.stopPropagation();
            e.nativeEvent.stopPropagation();
          }}>
            <div
            className="w-full flex justify-between items-center">
              <p
              className="text-lg font-medium tracking-wide">
                SQL
              </p>

              <button
              type="button"
              className="p-2 rounded-full duration-200 hover:bg-black cursor-pointer w-10 aspect-square flex items-center justify-center"
              title="Copy as SQL"
              onClick={() => {
                setSqlCopied(true);

                if(sqlValue) {
                  navigator.clipboard.writeText(sqlValue)
                  setInterval(() => {
                    setSqlCopied(false);
                  }, 1000);
                  return;
                }

                navigator.clipboard.writeText((tableNodes.map(table => translateToSQL(table.data as { tableName: String, columns: Column[] }))).toString());
                setInterval(() => {
                  setSqlCopied(false);
                }, 1000);
                return;
              }}>
                {
                  sqlCopied ? (
                    <IconCheck
                    size={18}
                    stroke={2} />
                  ) : (
                    <IconCopy
                    size={18}
                    stroke={2} />
                  )
                }
              </button>
            </div>

            <textarea
            value={sqlValue || tableNodes.map(table => translateToSQL(table.data as { tableName: String, columns: Column[] }))}
            onChange={(e) => {
              setsqlValue(e.target.value);
            }}
            className="w-full min-h-max h-full bg-neutral-950/50 rounded-md outline-none p-3">
              
            </textarea>
          </section>
          
          <section
          className="w-150 h-200 bg-neutral-900 my-10 mr-20 rounded-md px-6 py-3 animate-fade-in-up"
          onClick={(e) => {
            e.stopPropagation();
            e.nativeEvent.stopPropagation();
          }}>
            <div
            className="w-full flex justify-between items-center">
              <p
              className="text-lg font-medium tracking-wide">
                JSON
              </p>

              
              <button
              type="button"
              className="p-2 rounded-full duration-200 hover:bg-black cursor-pointer w-10 aspect-square flex items-center justify-center"
              title="Copy as SQL"
              onClick={() => {
                setJsonCopied(true);

                if(jsonValue) {
                  navigator.clipboard.writeText(jsonValue);
                  setInterval(() => {
                    setJsonCopied(false);
                  }, 1000);
                  return;
                }

                navigator.clipboard.writeText((tableNodes.map(table => translateToJson(table.data as { tableName: String, columns: Column[] }))).toString());
                setInterval(() => {
                  setJsonCopied(false);
                }, 1000);
                return;
              }}>
                {
                  jsonCopied ? (
                    <IconCheck
                    size={18}
                    stroke={2} />
                  ) : (
                    <IconCopy
                    size={18}
                    stroke={2} />
                  )
                }
              </button>
            </div>

            <textarea
            value={jsonValue || tableNodes.map(table => translateToJson(table.data as { tableName: String, columns: Column[] }))}
            onChange={(e) => {
              setJsonValue(e.target.value);
            }}
            className="w-full min-h-max h-full bg-neutral-950/50 rounded-md outline-none p-3">
              
            </textarea>
          </section>
        </div>

        {/* Table creator form */}
        <div
        className="w-screen h-screen fixed hidden items-start justify-center backdrop-brightness-50 backdrop-blur-xs z-10 overflow-auto py-10 animate-fade-in"
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
                  key: ""
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
          className="h-full w-130 animate-fade-in-left bg-neutral-900 px-4"
          onClick={(e) => {
            e.nativeEvent.stopPropagation();
            e.stopPropagation();
          }}>

            {
              tableNodes && tableNodes.length > 0 ? tableNodes.map((table, table_index) =>(
                <section
                key={table_index}
                className="w-full rounded-lg bg-neutral-800 px-4 flex flex-col items-center justify-center py-4 my-5 gap-4" >
                  <div
                  className="flex justify-between items-center w-full">
                    <p
                    className="tracking-wide font-medium uppercase">
                      { table.data.tableName as String }
                    </p>

                    <IconDatabaseMinus
                    size={20}
                    color="red" />
                  </div>

                  {
                    table.data.columns as Column[] && (table.data.columns as Column[]).map((column: Column, column_index) =>
                      <div
                      className="flex gap-2 items-end justify-center"
                      key={column_index}>

                        <div
                        className="flex flex-col items-center justify-center gap-1">
                          <label
                          className="text-sm tracking-wide font-medium w-full text-start uppercase">
                            Value
                          </label>
                          <input
                          type="text"
                          defaultValue={column.name}
                          onChange={(e) => {
                            setNodes((prev) =>
                              prev.map((node) => {
                                if (node.id !== table.id) return node

                                return {
                                  ...node,
                                  data: {
                                    ...node.data,
                                    columns: (node.data.columns as Column[]).map((col) =>
                                      col.key === column.key
                                        ? {
                                            ...col,
                                            name: e.target.value
                                          }
                                        : col
                                    )
                                  }
                                }
                              })
                            )
                          }}
                          className="bg-neutral-900/50 p-2 rounded-md outline-none border border-transparent duration-400 focus:border-main" />
                        </div>
                        
                        <div
                        className="flex flex-col items-center justify-center gap-1">
                          <label
                          className="text-sm tracking-wide font-medium w-full text-start uppercase">
                            Type
                          </label>
                          <input
                          type="text"
                          defaultValue={column.type}
                          onChange={(e) => {
                            setNodes((prev) =>
                              prev.map((node) => {
                                if (node.id !== table.id) return node

                                return {
                                  ...node,
                                  data: {
                                    ...node.data,
                                    columns: (node.data.columns as Column[]).map((col) =>
                                      col.key === column.key
                                        ? {
                                            ...col,
                                            type: e.target.value
                                          }
                                        : col
                                    )
                                  }
                                }
                              })
                            )
                          }}
                          className="bg-neutral-900/50 p-2 rounded-md outline-none border border-transparent duration-400 focus:border-main" />
                        </div>

                        <button
                        type="button"
                        className="bg-neutral-900/50 flex items-center justify-center p-2 rounded-md cursor-pointer duration-400 border border-transparent outline-none hover:border-main focus:border-main"
                        onClick={() => {
                          removeColumn(table, column_index);
                        }}>
                          <IconTrash
                          color="red" />
                        </button>
                      </div>
                    )
                  }

                  <button
                  type="button"
                  className="w-full rounded-xl opacity-60 bg-neutral-900 text-center p-2 border border-neutral-600 border-dashed cursor-pointer duration-300 hover:opacity-80"
                  onClick={() => {
                    addNewNode(table);
                  }}>
                    Add a new row
                  </button>
                </section>
              )) : (
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
          action={`/projects/${params.id}`}
          name="Dashboard"
          isDisplayed={expanded}>
            <IconAppWindow
            size={23}
            stroke={2}
            color="white"/>
          </Icon>

          <Icon
          action={`/projects/${team.team_id}/integrants`}
          name="Integrants"
          isDisplayed={expanded}>
            <IconUsers
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
          className="h-10 w-25 rounded-sm bg-main cursor-pointer duration-400 hover:bg-main/60 font-medium tracking-wide disabled:grayscale disabled:hover:bg-main disabled:cursor-wait text-sm"
          disabled={isSaveLoading}
          onClick={async() => {
            await saveERD();
          }} >
            Save
          </button>

          {/* Export handler */}
          <button
          type="button"
          className="h-10 w-25 rounded-sm bg-rose-500 cursor-pointer duration-400 hover:bg-rose-700 font-medium tracking-wide disabled:grayscale disabled:hover:bg-rose-500 disabled:cursor-wait text-sm"
          disabled={isSaveLoading}
          onClick={toggleExporter} >
            Export
          </button>
        </section>
        
      </div>
    ) : (
      <LoadingDashboard />
    )
  )
};