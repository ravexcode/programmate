//Client page
"use client";

//React imports
import { useState, useRef, useEffect, useCallback } from "react";

//DnD imports
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

//Next imports
import { useParams, useRouter } from "next/navigation";

//Icons imports
import {
  IconCheck,
  IconCopy,
  IconDatabaseEdit,
  IconDatabaseMinus,
  IconDatabaseOff,
  IconDatabasePlus,
  IconGripVertical,
  IconHandStop,
  IconMouse,
  IconTrash,
} from "@tabler/icons-react";

//Prebuilt ui imports
import SnackBar from "@/components/ui/snackbar";
import TeamSideBar from "@/components/dashboard/team-sidebar";
import LoadingDashboard from "@/components/screens/loading-screen";
import ColumnNode from "@/components/projects/erd/column-node";
import ButtonControl from "@/components/projects/erd/button-control";
import { TableContainerNode } from "@/components/projects/erd/table-node";
import CreatorForm from "@/components/forms/creator-form";
import CreatorInput from "@/components/forms/creator-inputs";
import MainButton from "@components/ui/buttons/main";
import AltButton from "@components/ui/buttons/alternate";

//Client imports
import {
  loadErdPage,
  buildTableNodes,
  appendColumn,
  removeColumnNode,
  updateColumnField,
  reorderColumnNodes,
  translateToSQL,
  translateToJson,
  translateAll,
  saveErdData,
  type Column,
} from "@/client/projects/erd";

//Types imports
import type { UserData } from "@/types/user.types";
import type Team from "@/types/team.types";

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

//Sortable column row — extracted outside Page to avoid re-creation
type SortableColumnRowProps = {
  column: Column;
  table_id: string;
  updateColumn: (tableId: string, columnKey: string, field: "name" | "type", value: string) => void;
  removeColumn: (tableId: string, columnKey: string) => void;
};

function SortableColumnRow({ column, table_id, updateColumn, removeColumn }: SortableColumnRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: `${table_id}-col-${column.key}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex gap-2 items-end justify-center">
      <button
        type="button"
        className="cursor-grab active:cursor-grabbing p-1 text-neutral-500 hover:text-neutral-300"
        {...attributes}
        {...listeners}>
        <IconGripVertical size={16} />
      </button>

      <div className="flex flex-col items-center justify-center gap-1">
        <label className="text-sm tracking-wide font-medium w-full text-start uppercase">
          Value
        </label>
        <input
          type="text"
          defaultValue={column.name}
          onChange={(e) => updateColumn(table_id, column.key, "name", e.target.value)}
          className="bg-neutral-900/50 p-2 rounded-md outline-none border border-transparent duration-400 focus:border-main" />
      </div>

      <div className="flex flex-col items-center justify-center gap-1">
        <label className="text-sm tracking-wide font-medium w-full text-start uppercase">
          Type
        </label>
        <input
          type="text"
          defaultValue={column.type}
          onChange={(e) => updateColumn(table_id, column.key, "type", e.target.value)}
          className="bg-neutral-900/50 p-2 rounded-md outline-none border border-transparent duration-400 focus:border-main" />
      </div>

      <button
        type="button"
        className="bg-neutral-900/50 flex items-center justify-center p-2 rounded-md cursor-pointer duration-400 border border-transparent outline-none hover:border-main focus:border-main"
        onClick={() => removeColumn(table_id, column.key)}>
        <IconTrash color="red" />
      </button>
    </div>
  );
}

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
  //React flow draggable
  const [ cursor, setCursor ] = useState<"drag" | "mouse" | "create" | "edit">("drag");
  //Save button loading
  const [ isSaveLoading, setIsSaveLoading ] = useState<boolean>(false);

  //React flow states
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  //DnD sensors
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  //Export values
  const [ sqlValue, setSqlValue ] = useState("");
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

  //Data fetching
  useEffect(() => {
    async function fetchData(){
      const data = await loadErdPage(Number(params.id), router, snackbar);

      if(!data) return;

      setUser(data.user);
      setTeam(data.team);
      setNodes(data.nodes);
      setEdges(data.edges);
    }

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //Togglers
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isExporterOpen, setIsExporterOpen] = useState(false);

  const toggleCreatorForm = () => {
    setIsCreatorOpen(!isCreatorOpen);
    setCursor(isCreatorOpen ? "mouse" : "create");
  };

  const toggleEditor = () => {
    setIsEditorOpen(!isEditorOpen);
    setCursor(isEditorOpen ? "mouse" : "edit");
  };

  const toggleExporter = () => {
    setIsExporterOpen(!isExporterOpen);
    setCursor(isExporterOpen ? "mouse" : "edit");
  };

  //Row field updater
  const handleUpdateField = (
    index: number,
    value?: string,
    type?: string
  ) => {
    setNewRows(prev =>
      prev.map((row, i) =>
        i === index ? {
          ...row,
          name: value || "",
          type: type || "",
        } : row
      )
    );
  };

  //Table creator
  const createNewTable = (e: React.FormEvent) => {
    e.preventDefault();

    if(!newName || !newRows || newRows.length < 1) return;

    const table_nodes = buildTableNodes(newName, newRows);

    setNodes((prevNodes) => [...prevNodes, ...table_nodes]);

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
  const handleSaveERD = async() => {
    setIsSaveLoading(true);

    await saveErdData(Number(params.id), nodes, edges, snackbar);

    setIsSaveLoading(false);
  }

  //Node adder
  const addNewNode = (table : Node) => {
    setNodes((prev) => appendColumn(prev, table));
    return;
  }

  //Node remover
  const removeColumn = (tableId: string, columnKey: string) => {
    setNodes((prev) => removeColumnNode(prev, tableId, columnKey));
  };

  //Column field updater
  const updateColumn = (tableId: string, columnKey: string, field: "name" | "type", value: string) => {
    setNodes((prev) => updateColumnField(prev, tableId, columnKey, field, value));
  };

  //Column reorder — also repositions columnHandle nodes on canvas
  const reorderColumns = (tableId: string, oldIndex: number, newIndex: number) => {
    setNodes((prev) => reorderColumnNodes(prev, tableId, oldIndex, newIndex));
  };

  //Tables filtered
  const tableNodes = nodes.filter(
    (node) => node.type === "tableContainer"
  )

  const copySql = async() => {
    const value = sqlValue || translateAll(tableNodes, translateToSQL);
    await navigator.clipboard.writeText(value);
    setSqlCopied(true);
    setTimeout(() => setSqlCopied(false), 1000);
  }

  const copyJson = async() => {
    const value = jsonValue || translateAll(tableNodes, translateToJson);
    await navigator.clipboard.writeText(value);
    setJsonCopied(true);
    setTimeout(() => setJsonCopied(false), 1000);
  }

  return (
    team && user ? (
      <div
      className="bg-background grid grid-cols-[auto_1fr] min-h-screen w-screen text-text overflow-hidden">
        <SnackBar ref={snackbar} />

         {/* DB Data exported */}
         <div
         className={`w-screen h-screen fixed top-0 left-0 ${isExporterOpen ? "flex" : "hidden"} justify-center items-start backdrop-brightness-50 backdrop-blur-xs z-10 overflow-y-auto animate-fade-in`}
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
              onClick={copySql}>
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
            value={sqlValue || translateAll(tableNodes, translateToSQL)}
            onChange={(e) => {
              setSqlValue(e.target.value);
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
              title="Copy as JSON"
              onClick={copyJson}>
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
            value={jsonValue || translateAll(tableNodes, translateToJson)}
            onChange={(e) => {
              setJsonValue(e.target.value);
            }}
            className="w-full min-h-max h-full bg-neutral-950/50 rounded-md outline-none p-3">

            </textarea>
          </section>
        </div>

         {/* Table creator form */}
         <div
         className={`w-screen h-screen fixed ${isCreatorOpen ? "flex" : "hidden"} items-start justify-center backdrop-brightness-50 backdrop-blur-xs z-10 overflow-auto py-10 animate-fade-in`}
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

         {/* ERD editor */}
         <div
         className={`w-screen h-screen fixed ${isEditorOpen ? "flex" : "hidden"} items-center justify-end backdrop-brightness-50 backdrop-blur-xs z-10 overflow-hidden animate-fade-in`}
         onClick={toggleEditor}>


          <section
          className="h-full w-150 animate-fade-in-left bg-neutral-900 px-4 overflow-auto"
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
                      { table.data.tableName as string }
                    </p>

                    <IconDatabaseMinus
                    size={20}
                    color="red"
                    className="cursor-pointer" />
                  </div>

                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={(event: DragEndEvent) => {
                      const { active, over } = event;
                      if (!over || active.id === over.id) return;

                      const columns = table.data.columns as Column[];
                      const activeIndex = columns.findIndex((c) => `${table.id}-col-${c.key}` === active.id);
                      const overIndex = columns.findIndex((c) => `${table.id}-col-${c.key}` === over.id);
                      if (activeIndex !== -1 && overIndex !== -1) {
                        reorderColumns(table.id, activeIndex, overIndex);
                      }
                    }}>
                    <SortableContext
                      items={(table.data.columns as Column[]).map((c) => `${table.id}-col-${c.key}`)}
                      strategy={verticalListSortingStrategy}>
                      {
                        (table.data.columns as Column[]).map((column: Column) =>
                          <SortableColumnRow
                            key={column.key}
                            column={column}
                            table_id={table.id}
                            updateColumn={updateColumn}
                            removeColumn={removeColumn} />
                        )
                      }
                    </SortableContext>
                  </DndContext>

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
                    You don&apos;t have tables yet
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

        <TeamSideBar
        user={user}
        team={team} />

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
           <MainButton
           size="w-full"
           isLoading={isSaveLoading}
           action={async() => {
             await handleSaveERD();
           }} >
             Save
           </MainButton>


          {/* Export handler */}
           <AltButton
           size="w-full"
           action={toggleExporter} >
             Export
           </AltButton>

        </section>

      </div>
    ) : (
      <LoadingDashboard />
    )
  )
};
