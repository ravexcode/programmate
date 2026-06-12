//Client side
"use client"

//Next imports
import { useParams, useRouter } from "next/navigation";

//React imports
import { useEffect, useState, useRef, useCallback } from "react";

//Types imports
import { UserData } from "@/types/user.types";
import Team from "@/types/team.types";

//Prebuild ui imports
import SideBar, { Icon } from "@/components/ui/sidebar";
import SnackBar, { showSnackbar } from "@/components/ui/snackbar";
import LoadingDashboard from "@/components/screens/loading-screen";
import { JsonNode } from "@/components/ui/json-node";
import ButtonControl from "@/components/ui/button-control";

//Hooks imports
import { useGetToken } from "@/hooks/useCookies";

//Services imports
import getTeam from "@/services/team.service";
import getUser from "@/services/user.service";

//Icons imports
import {
  IconCalendar,
  IconCheck,
  IconCopy,
  IconDatabase,
  IconEye,
  IconFolder,
  IconLayoutKanban,
  IconMessage,
  IconMouse,
  IconPlus,
  IconTrash,
  IconUsers,
  IconHandStop,
  IconAppWindow,
  IconSettings
} from "@tabler/icons-react";

//Reactflow imports
import {
  ReactFlow,
  Background,
  BackgroundVariant,
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
  //URL params
  const params = useParams();
  const router = useRouter();

  //States handler
  //User data
  const [ user, setUser ] = useState<UserData>();
  //Team data
  const [ team, setTeam ] = useState<Team>();
  //Sidebar expanded
  const [ expanded, setExpanded ] = useState<boolean>(false);
  //Cursor mode
  const [ cursor, setCursor ] = useState<"drag" | "mouse" | "create">("drag");
  //Save loading
  const [ isSaveLoading, setIsSaveLoading ] = useState<boolean>(false);
  //Copy button success
  const [ jsonCopied, setJsonCopied ] = useState(false);
  //Export value
  const [ jsonValue, setJsonValue ] = useState("");
  
  //Default nodes (initial)
  const initialNodes: Node[] = [];

  //Reactflow
  const [ nodes, setNodes, onNodesChange ] = useNodesState<Node>(initialNodes);
  const [ edges, setEdges, onEdgesChange ] = useEdgesState<Edge>([]);

  //Component references
  const snackbar = useRef(null);
  const editor = useRef(null);
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

      setTeam(team_data);
      setNodes(team_data.json_views || []);
      setEdges(team_data.json_connections || []);
    }

    fetchData();
  }, []);

  //Togglers
  const toggleEditor = () => {
    if(!editor.current) return;

    const current : HTMLElement = editor.current;

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

  const toggleExporter = () => {
    if(!exporter.current) return;

    const current : HTMLElement = exporter.current;

    if(current.classList.contains("hidden")) {
      current.classList.remove("hidden");
      current.classList.add("flex");
      return;
    }
    
    current.classList.add("hidden");
    current.classList.remove("flex");
    return;
  };

  //Add new node
  const addNewNode = () => {
    const nodeId = `node-${Date.now()}`;
    
    const newNode: Node = {
      id: nodeId,
      type: "container",
      position: {
        x: Math.random() * 400,
        y: Math.random() * 400
      },
      data: {
        content: ""
      },
      draggable: true
    };

    setNodes((prev) => [...prev, newNode]);
  };

  //Delete node
  const deleteNode = (nodeId: string) => {
    setNodes((prev) => prev.filter((node) => node.id !== nodeId));
    setEdges((prev) => 
      prev.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
    );
  };

  //Update node content
  const updateNodeContent = (nodeId: string, content: string) => {
    setNodes((prev) =>
      prev.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, content } }
          : node
      )
    );
  };

  //Connection handler
  const onConnect = useCallback((connection: Connection) => {
    setEdges((prevEdges) => 
      addEdge(connection, prevEdges)
    );
  }, [setEdges]);

  //Save JSON preview
  const saveJsonPreview = async() => {
    setIsSaveLoading(true);

    const token = useGetToken();

    if(!token) return router.push("/auth/login");

    const res = await fetch(
      `/api/teams/${params.id}/json-preview`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
          "Authorization": token
        },
        body: JSON.stringify({
          teamId: params.id,
          connections: edges || [],
          preview: nodes || []
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
    showSnackbar("JSON preview saved successfully!", "valid", snackbar);
    return;
  }

  //Export as JSON
  const exportAsJson = () => {
    const exportData = {
      nodes: nodes.map(node => ({
        id: node.id,
        content: node.data?.content || "",
        position: node.position
      })),
      connections: edges.map(edge => ({
        source: edge.source,
        target: edge.target,
        animated: edge.animated
      }))
    };

    return JSON.stringify(exportData, null, 2);
  };

  return (
    team && user ? (
      <div
      className="bg-background grid grid-cols-[auto_1fr] min-h-screen w-screen text-text overflow-hidden">
        <SnackBar ref={snackbar} />

        {/* Exporter modal */}
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
                JSON Export
              </p>

              <button
              type="button"
              className="p-2 rounded-full duration-200 hover:bg-black cursor-pointer w-10 aspect-square flex items-center justify-center"
              title="Copy as JSON"
              onClick={() => {
                setJsonCopied(true);
                navigator.clipboard.writeText(jsonValue || exportAsJson());
                setInterval(() => {
                  setJsonCopied(false);
                }, 1000);
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
            value={jsonValue || exportAsJson()}
            onChange={(e) => {
              setJsonValue(e.target.value);
            }}
            className="w-full min-h-max h-full bg-neutral-950/50 rounded-md outline-none p-3">
            </textarea>
          </section>
        </div>

        {/* Editor panel */}
        <div
        className="w-screen h-screen fixed hidden items-center justify-end backdrop-brightness-50 backdrop-blur-xs z-10 overflow-hidden animate-fade-in"
        ref={editor}
        onClick={toggleEditor}>

          <section
          className="h-full w-130 animate-fade-in-left bg-neutral-900 px-4 overflow-y-auto"
          onClick={(e) => {
            e.nativeEvent.stopPropagation();
            e.stopPropagation();
          }}>

            {
              nodes && nodes.length > 0 ? (
                <>
                  {nodes.map((node, index) => (
                    <section
                    key={node.id}
                    className="w-full rounded-lg bg-neutral-800 px-4 flex flex-col items-center justify-center py-4 my-5 gap-4">
                      <div
                      className="flex justify-between items-center w-full">
                        <p
                        className="tracking-wide font-medium uppercase text-sm">
                          Node {index + 1}
                        </p>

                        <button
                        type="button"
                        className="bg-neutral-900/50 flex items-center justify-center p-2 rounded-md cursor-pointer duration-400 border border-transparent outline-none hover:border-rose-500 focus:border-rose-500"
                        onClick={() => {
                          deleteNode(node.id);
                        }}>
                          <IconTrash
                          color="red"
                          size={18} />
                        </button>
                      </div>

                      <div
                      className="flex flex-col items-center justify-center gap-1 w-full">
                        <label
                        className="text-sm tracking-wide font-medium w-full text-start uppercase">
                          Content
                        </label>
                        <textarea
                        //@ts-ignore
                        defaultValue={node.data?.content || ""}
                        onChange={(e) => {
                          updateNodeContent(node.id, e.target.value);
                        }}
                        className="w-full h-24 bg-neutral-900/50 p-2 rounded-md outline-none border border-transparent duration-400 focus:border-main resize-none" />
                      </div>
                    </section>
                  ))}
                </>
              ) : (
                <div
                className="flex flex-col items-center justify-start py-10">
                  <IconEye
                  size={50}
                  stroke={1} />
                  <p
                  className="text-xl font-medium tracking-wide mt-2">
                    No nodes yet
                  </p>
                  <p
                  className="text-neutral-400">
                    Create a new node to get started!
                  </p>

                  <button
                  type="button"
                  className="mt-4 rounded-lg bg-main py-2 px-6 duration-400 hover:bg-main/60 cursor-pointer"
                  onClick={() => {
                    addNewNode();
                  }}>
                    Create a node
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
          name="Team dashboard"
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
        fitView
        colorMode="dark"
        nodeTypes={nodeTypes}
        onConnect={onConnect}
        panOnDrag={cursor === "drag"}
        zoomOnScroll={cursor === "drag"}
        defaultEdgeOptions={defaultEdgeOptions} >
          <Background 
          variant={BackgroundVariant.Dots}
          className="brightness-75" />
        </ReactFlow>

        {/* Control buttons */}
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

          {/* Create node */}
          <ButtonControl
          content="Create node"
          action={addNewNode}
          active={cursor === "create"}>
            <IconPlus
            size={20} />
          </ButtonControl>

          {/* Edit nodes */}
          <ButtonControl
          content="Edit nodes"
          action={toggleEditor}
          active={false}>
            <IconEye
            size={20} />
          </ButtonControl>

          {/* Save button */}
          <button
          type="button"
          className="h-10 w-25 rounded-sm bg-main cursor-pointer duration-400 hover:bg-main/60 font-medium tracking-wide disabled:grayscale disabled:hover:bg-main disabled:cursor-wait text-sm"
          disabled={isSaveLoading}
          onClick={async() => {
            await saveJsonPreview();
          }} >
            Save
          </button>

          {/* Export button */}
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