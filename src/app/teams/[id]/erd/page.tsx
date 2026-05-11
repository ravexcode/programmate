//Client side
"use client";

//React import
import { useState, useRef, type RefObject, useEffect } from "react";
import Xarrow, { Xwrapper } from "react-xarrows";

//Hooks imports
import { saveERD, getERD } from "@/hooks/erd.hook";

//Prebuilt ui imports
import CreatorForm from "@/components/forms/creatorForm";
import CreatorInput from "@/components/forms/creatorInputs";
import SnackBar, { SnackbarRef } from "@/components/ui/snackbar";

//Icons imports
import {
  IconArrowLeft,
  IconConnection,
  IconDatabase,
  IconDatabaseMinus,
  IconDatabasePlus,
  IconDeviceFloppy,
  IconHandStop,
  IconMouse,
  IconTrash
} from "@tabler/icons-react";

//Types imports
import { type ERDTable } from "@/types/team.types";
import { useParams } from "next/navigation";
import { getCookie } from "cookies-next/client";
import LoadingDashboard from "@/components/screens/loading_dashboard";

//Types declarations
//Table rows
interface Row {
  value: string;
  type: string;
  connected_at?: {
    table: string;
    value: string;
  };
  connection_type?: string;
}

//Connection reference
interface Reference {
  table: string;
  row: string;
};

//Connection type
interface ConnectionType {
  connector: Reference;
  connected: Reference;
  type: "oto" | "mto" | "mtm";
}

export default function ErdCreatorPage() {
  const params = useParams();

  //States handler
  //Button active
  const [ buttonActive, setButtonActive ] = useState("mouse");

  //Form enabled / disabled form
  const [ dbFormDisabled, setDBFormDisabled ] = useState<boolean>(false);
  //Database name value
  const [ dbName, setDBName ] = useState<string>("");
  //Database description value
  const [ dbDescription, setDBDescription ] = useState<string>("");
  //DB total rows
  const [ rows, setRows ] = useState<Array<Row>>([]);
  //Tables
  const [ tables, setTables ] = useState<Array<ERDTable> | null>(null);

  //Table states
  const [ currentMouse, setCurrentMouse ] = useState<string>("default");
  const [ rowConnector, setRowConnector ] = useState<{
    table: string,
    value: string
  } | null>();
  const [ currentPosition, setCurrentPosition ] = useState<{
    x: number,
    y: number
  }>();

  const [ grabbingTable, setGrabbingTable ] = useState<number | null>(null);
  const [ connections, setConnections ] = useState<Array<ConnectionType> | null>(null);

  //Snackbar container
  const snackbar = useRef<SnackbarRef>(null);

  const isAlreadyConnected = (
    connections: ConnectionType[], 
    newConn: { connector: Reference, connected: Reference }
  ) => {
    return connections.some(conn => 
      (conn.connector.table === newConn.connector.table && 
      conn.connector.row === newConn.connector.row &&
      conn.connected.table === newConn.connected.table &&
      conn.connected.row === newConn.connected.row) ||
      (conn.connector.table === newConn.connected.table && 
      conn.connector.row === newConn.connected.row &&
      conn.connected.table === newConn.connector.table &&
      conn.connected.row === newConn.connector.row)
    );
  };

  //Get the db data
  useEffect(() => {
    async function getERDData(){
      const token = await getCookie("token");

      const data = await getERD(
        params.id,
        token!
      );

      if(data) {
        setTables(data.tables!);
        setConnections(data.connections!);
        return;
      }

      setTables([]);
      setConnections([]);
      return;
    }

    getERDData();
  }, []);

  //Connections full class
  class Connection {
    //Type
    public connector: Reference;
    public connected: Reference;
    public type: "oto" | "mto" | "mtm";

    //Constructor (new)
    constructor(
      connector: Reference,
      connected: Reference,
      type: "oto" | "mto" | "mtm"
    ) {
      this.connector = connector;
      this.connected = connected;
      this.type = type;

      //Auto adds
      setConnections(prev => {
        if(prev) {
          return [
            ...prev,
            {
              connector,
              connected,
              type
            }
          ]
        }

        return [
          {
            connector,
            connected,
            type
          }
        ];
      });
    };

    //Remove function
    remove(index : number) {
      setConnections(
        //Using filter with index
        curr => curr && curr.filter(
        (_, curr_index) => {
          curr_index !== index
          }
        )
      );
    }
  }

  //Ref components
  const dbForm : RefObject<null> = useRef(null);

  const HandleUpdatePosition = (index: number, x: number, y: number) => {
    setTables(prev => prev!.map((table, i) => 
      i === index ? { ...table, position: { ...table.position, x, y } } : table
    ));
  };

  const HandleUpdateOffSet = (index: number, x: number, y: number) => {
    setTables(prev => prev!.map((table, i) => 
      i === index ? { ...table, position: { ...table.position, offSet_x: x, offSet_y: y } } : table
    ));
  };

  //Function for open database create form
  const toggleDBForm = () => {
    //Prevent errors
    if(!dbForm.current) return;

    const current : HTMLElement = dbForm.current;

    //Verifies class
    if(current.classList.contains("hidden")) {
      //Is hidden
      current.classList.add("flex");
      current.classList.remove("hidden");
      //Sets cursor selection
      setCurrentMouse("default");
      setButtonActive("create")
      return;
    };

    //Is shown
    current.classList.add("hidden");
    current.classList.remove("flex");
    //Sets cursor selection
    setCurrentMouse("default");
    setButtonActive("mouse");
    return;
  };

  //Function for update value using index
  const handleUpdateField = (
    index: number,
    value?: string,
    type?: string
  ) => {
    //Duplicate the value
    let rows_duplied = [... rows];

    //Sets value
    rows_duplied[index].value = value || "";

    //Sets type
    rows_duplied[index].type = type || "";
    
    //Updates
    setRows(rows_duplied);
  }

  //Function for set a new Table
  const handleCreateTable = (e: React.SubmitEvent) => {
    e.preventDefault();

    //Creates the new table in pos 0, 0
    const newTable : ERDTable = {
      name: dbName,
      description: dbDescription,
      rows: rows,
      position: {
        x: 0,
        y: 0,
        offSet_x: 0,
        offSet_y: 0
      }
    };

    //Update tables
    setTables( prev => prev ? [
      ...prev,
      newTable
    ] : [
      newTable
    ]);

    //Clear inputs
    setDBName("");
    setDBDescription("");
    setRows([]);

    //Toggles form
    toggleDBForm();
  };

  return (
     tables ? (
    <div
    className="text-text scrollbar-hide dotted-background min-w-screen min-h-screen"
    onMouseDown={(e) => {
      if(
        buttonActive === "hand"
      ) {
        setCurrentMouse("grabbing");
      }
    }}
    onMouseMove={(e) => {
      if(
        buttonActive === "hand" &&
        currentMouse === "grabbing" &&
        grabbingTable !== null
      ) {
        setCurrentPosition({
          x: e.clientX - tables![grabbingTable].position.offSet_x!,
          y: e.clientY - tables![grabbingTable].position.offSet_y!,
        });
      }
    }}
    onMouseUp={() => {
      setCurrentMouse("grab");
      setGrabbingTable(null);
      setCurrentPosition(undefined);
    }}>

      <SnackBar ref={snackbar} />

      {/* DB Form */ }
      <div
      ref={dbForm}
      onClick={toggleDBForm}
      className="fixed w-screen h-screen top-0 left-0 backdrop-blur brightnes-70 animate-fade-in z-20 justify-center py-10 hidden overflow-auto">

        <CreatorForm
        action={(e) => {
          handleCreateTable(e);
        }}
        title="Create a new table"
        hideAction={toggleDBForm}
        actionIsDisabled={!rows || rows.length < 0 || !dbName}>

          <CreatorInput
          label="Insert Database name"
          placeholder="e.g. Profiles"
          type="text"
          value={dbName || ""}
          onChange={(e) => {
            setDBName(e.target.value);
          }}
          required/>

          <CreatorInput
          label="Insert Database description"
          placeholder="This database is made for..."
          type="textarea"
          value={dbDescription || ""}
          onChange={(e) => {
            setDBDescription(e.target.value);
          }}/>

          {
            rows && rows.length > 0 && rows.map((row: Row, index: number) => 
              <div
              key={index}
              className="w-full mt-2 flex flex-col justify-center items-center">
                <div
                className="flex w-full justify-between py-1">
                  <label
                  className="text-sm text-neutral-300">
                    Row #{index + 1}
                  </label>

                  <button
                  type="button"
                  className="text-red-500 cursor-pointer"
                  onClick={() => {
                    setRows(prev =>
                      prev.filter(
                        (_, row_index) => row_index !== index
                      )
                    )
                  }}>
                    <IconTrash
                    size={20} />
                  </button>
                </div>
                <input
                type="text"
                placeholder="e.g. email"
                className="w-full p-2 text-sm bg-neutral-800 rounded-md mb-2 border-2 duration-400 border-transparent focus:outline-none focus:border-main"
                value={rows[index].value}
                onChange={(e) => {
                  handleUpdateField(index, e.target.value, rows[index].type);
                }} />

                <input
                type="text"
                placeholder="e.g. text"
                className="w-full p-2 text-sm bg-neutral-800 rounded-md mb-2 border-2 duration-400 border-transparent focus:outline-none focus:border-main"
                value={rows[index].type}
                onChange={(e) => {
                  handleUpdateField(index, rows[index].value, e.target.value);
                }} />
              </div>
            )
          }

          <button
          type="button"
          className="w-full bg-neutral-800 border-2 border-dashed border-neutral-600 text-neutral-400 py-2 rounded-md cursor-pointer duration-200 hover:brightness-80 mt-3"
          onClick={() => {
            setRows(prev => prev ? [
              ...prev,
              {
                value: "",
                type: ""
              }
            ] : [
              {
                value: "",
                type: ""
              }
            ]);
          }}>
            Add a new row
          </button>

          <span className="h-6"></span>

        </CreatorForm>
      </div>

      {/* Settings section */}
      <section
      className={"w-screen h-screen flex justify-end backdrop-brightness-60 animate-fade-in fixed top-0 left-0 z-20 " + (buttonActive !== "settings" && "hidden")}
      onClick={() => {
        setButtonActive("mouse");
        setCurrentMouse("default");
      }}
      onKeyDown={(e) => {
        if(e.key === "Escape") {
          setButtonActive("mouse");
          setCurrentMouse("default");
        }
      }}>

        <div
        className="h-screen w-full md:w-md bg-neutral-900 animate-fade-in-left px-4 py-4 overflow-y-auto flex flex-col items-center"
        onClick={(e) => {
          e.nativeEvent.stopPropagation();
          e.stopPropagation();
        }}>
          <h2 className="text-center text-xl md:text-2xl font-medium tracking-wider mb-5"> Databases </h2>



          {
            tables && tables.length > 0 ? tables.map((table, table_index) => 
              <div
              key={table_index}
              className="bg-black/30 px-6 pt-3 pb-6 rounded-lg max-w-md mb-20">
                <div
                className="w-full flex justify-between items-center">
                  <h2
                  className="font-medium traking-wide uppercase text-center text-lg">
                    { table.name }
                  </h2>

                  <button
                  type="button"
                  className="text-red-500 cursor-pointer"
                  title="Delete this database">
                    <IconDatabaseMinus
                    size={20} />
                  </button>
                </div>

                <label
                className="text-sm">
                  Description
                </label>
                <textarea
                value={table.description}
                onChange={(e) => {
                  const duplicated = [...tables];

                  duplicated[table_index] = {
                    ...duplicated[table_index],
                    description: e.target.value,
                  };

                  setTables(duplicated);
                }}
                placeholder="e.g. email"
                className="w-full px-4 py-2 rounded-md bg-neutral-900 border-2 border-neutral-600 duration-300 hover:brightness-80 focus:hover:brightness-100 focus:outline-none focus:border-main mb-3 min-h-30 max-h-30"/>

                <p
                className="text-lg font-medium mb-2">Rows</p>

                {
                  tables[table_index].rows!.map((row, row_index) => 
                    <div
                    key={row_index}
                    className="w-full mb-2 flex flex-col gap-1">
                      <label
                      className="text-sm">
                        Row value
                      </label>
                      <input
                      type="text"
                      value={row.value}
                      onChange={(e) => {
                        const duplicated = [...tables];

                        duplicated[table_index].rows![row_index] = {
                          ...duplicated[table_index].rows![row_index],
                          value: e.target.value,
                        };

                        setTables(duplicated);
                      }}
                      placeholder="e.g. email"
                      className="w-full px-4 py-2 rounded-md bg-neutral-900 border-2 border-neutral-600 duration-300 hover:brightness-80 focus:hover:brightness-100 focus:outline-none focus:border-main"/>

                      <label
                      className="text-sm">
                        Row type
                      </label>
                      <input
                      type="text"
                      value={row.type}
                      onChange={(e) => {
                        const duplicated = [...tables];

                        duplicated[table_index].rows![row_index] = {
                          ...duplicated[table_index].rows![row_index],
                          type: e.target.value,
                        };

                        setTables(duplicated);
                      }}
                      placeholder="e.g. text"
                      className="w-full px-4 py-2 rounded-md bg-neutral-900 border-2 border-neutral-600 duration-300 hover:brightness-80 focus:hover:brightness-100 focus:outline-none focus:border-main"/>

                      <button
                      type="button"
                      className="bg-neutral-900 w-full rounded-md px-4 py-2 flex gap-2 justify-center items-center duration-400 mt-2 hover:scale-102 hover:bg-red-600 cursor-pointer"
                      onClick={() => {
                        setTables((prev) =>
                          prev!.map((table, i) =>
                            i === table_index
                              ? {
                                  ...table,
                                  rows: table.rows?.filter(
                                    (_, indexDeleted) => indexDeleted !== row_index
                                  ),
                                }
                              : table
                          )
                        );
                      }}>
                        <IconTrash
                        size={20}
                        />

                        Delete this row
                      </button>
                    </div>
                  )
                }

                <button
                type="button"
                className="w-full py-2 rounded-md cursor-pointer duration-300 bg-main mt-2 mb-1 hover:bg-main/70"
                onClick={() => {
                  setTables(prev =>
                    prev!.map((table, i) =>
                      i === table_index
                        ? {
                            ...table,
                            rows: [
                              ...(table.rows || []),
                              {
                                value: "",
                                type: "",
                              },
                            ],
                          }
                        : table
                    )
                  );
                }}>
                  Add new row
                </button>

                <label
                className="text-sm">
                  Position
                </label>

                <div
                className="flex justify-center items-center gap-3">
                  <p> X: </p>
                  <input
                  type="text"
                  value={table.position.x}
                  onChange={(e) => {
                    //TODO: Implement change logic
                  }}
                  placeholder="e.g. 100"
                  className="w-full px-4 py-2 rounded-md bg-neutral-900 border-2 border-neutral-600 duration-300 hover:brightness-80 focus:hover:brightness-100 focus:outline-none focus:border-main text-sm"/>

                  <p> Y: </p>
                  <input
                  type="text"
                  value={table.position.y}
                  onChange={(e) => {
                    //TODO: Implement change logic
                  }}
                  placeholder="e.g. 100"
                  className="w-full px-4 py-2 rounded-md bg-neutral-900 border-2 border-neutral-600 duration-300 hover:brightness-80 focus:hover:brightness-100 focus:outline-none focus:border-main"/>
                </div>

                <label
                className="text-sm">
                  Offset
                </label>

                <div
                className="flex justify-center items-center gap-3">
                  <p> X: </p>
                  <input
                  type="text"
                  value={table.position.offSet_x || 0}
                  onChange={(e) => {
                    //TODO: Implement change logic
                  }}
                  placeholder="e.g. 100"
                  className="w-full px-4 py-2 rounded-md bg-neutral-900 border-2 border-neutral-600 duration-300 hover:brightness-80 focus:hover:brightness-100 focus:outline-none focus:border-main text-sm"/>

                  <p> Y: </p>
                  <input
                  type="text"
                  value={table.position.offSet_y || 0}
                  onChange={(e) => {
                    //TODO: Implement change logic
                  }}
                  placeholder="e.g. 100"
                  className="w-full px-4 py-2 rounded-md bg-neutral-900 border-2 border-neutral-600 duration-300 hover:brightness-80 focus:hover:brightness-100 focus:outline-none focus:border-main"/>
                </div>
              </div>
            ) : (
              <div
              className="text-text/60 w-full flex flex-col justify-center items-center gap-1 mt-10">
                <IconDatabaseMinus
                size={35} />
                <p
                className="text-lg">
                  Actually you don't have databases now...
                </p>
                <button
                className="bg-main px-6 py-2 mt-4 rounded-md text-text cursor-pointer duration-300 hover:bg-main/60"
                onClick={() => {
                  setCurrentMouse("default");
                  toggleDBForm();
                }}>
                  + Create one
                </button>
              </div>
            )
          }

          { tables!.length > 0 && (
            <button
            type="button"
            className="bg-main w-full py-2 text-lg font-medium tracking-wide mt-4 rounded-md text-text cursor-pointer duration-300 hover:bg-main/60"
            onClick={() => {
              setCurrentMouse("default");
              toggleDBForm();
            }}>
              + Create a new database
            </button>
          )
            
          }
        </div>

      </section>

      {/* Bottom bar */}
      <section
      className="fixed bottom-2 left-1/2 -translate-x-1/2 bg-neutral-800 rounded-sm p-2 z-2 flex gap-3">

        <button
        className={"p-3 rounded-lg cursor-pointer duration-200 " + (buttonActive === "mouse" ? "backdrop-brightness-60 hover:backdrop-brightness-40" : "hover:backdrop-brightness-80")}
        onClick={() => {
          setButtonActive("mouse");
          setCurrentMouse("default");
        }}>
          <IconMouse
          size={20} />
        </button>

        <button
        className={"p-3 rounded-lg cursor-pointer duration-200 " + (buttonActive === "hand" ? "backdrop-brightness-60 hover:backdrop-brightness-40" : "hover:backdrop-brightness-80")}
        onClick={() => {
          setButtonActive(prev => prev === "hand" ? "mouse" : "hand")
          setCurrentMouse("grab")
        }}>
          <IconHandStop
          size={20} />
        </button>

        <button
        className={"p-3 rounded-lg cursor-pointer duration-200 " + (buttonActive === "create" ? "backdrop-brightness-60 hover:backdrop-brightness-40" : "hover:backdrop-brightness-80")}
        onClick={toggleDBForm}>
          <IconDatabasePlus
          size={20} />
        </button>

        <button
        className={"p-3 rounded-lg cursor-pointer duration-200 " + (buttonActive === "connection" ? "backdrop-brightness-60 hover:backdrop-brightness-40" : "hover:backdrop-brightness-80")}
        onClick={() => {
          setButtonActive(prev => prev === "connection" ? "mouse" : "connection")
        }}>
          <IconConnection
          size={20} />
        </button>

        <button
        className={"p-3 rounded-lg cursor-pointer duration-200 " + (buttonActive === "settings" ? "backdrop-brightness-60 hover:backdrop-brightness-40" : "hover:backdrop-brightness-80")}
        onClick={() => {
          setButtonActive(prev => prev === "settings" ? "mouse" : "settings")
          setCurrentMouse("default")
        }}>
          <IconDatabase
          size={20} />
        </button>

      </section>

      <a
      href={`/teams/${params.id}`}
      className="z-10 fixed top-2 left-2 cursor-pointer duration-200 p-3 rounded-full hover:bg-white/20">
        <IconArrowLeft
        size={25} />
      </a>

      <button
      type="button"
      className="z-10 fixed top-2 right-2 cursor-pointer duration-200 p-3 rounded-full hover:bg-white/20 text-green-500 disabled:grayscale disabled:hover:bg-transparent disabled:cursor-wait"
      disabled={dbFormDisabled}
      onClick={async () => {
        setDBFormDisabled(true);
        const token = await getCookie("token");

        await saveERD(
          params.id,
          tables!,
          connections!,
          token!,
          snackbar
        )
        setDBFormDisabled(false);
      }}>
        <IconDeviceFloppy
        size={25} />
      </button>

      {/* Tables & Connections section */}
      <Xwrapper>
        {
          tables && tables.length > 0 && tables.map((table, index) => (
          <section
          key={index}
          className="pb-2 rounded-md bg-neutral-800 w-60 relative z-2 border-2 border-neutral-600"
          onMouseDown={(e) => {
            if(buttonActive === "hand") {
              setGrabbingTable(index);
              HandleUpdateOffSet(
                index,
                e.clientX - tables[index].position.x,
                e.clientY - tables[index].position.y,
              );
              setCurrentPosition({
                x: tables[index].position.x,
                y: tables[index].position.y
              })
            }
          }}
          onMouseUp={(e) => {
            if(buttonActive === "hand") {
              HandleUpdatePosition(index, currentPosition?.x!, currentPosition?.y!);
              setGrabbingTable(null);
            }
          }}
          style={{
            cursor: currentMouse ?? "default",
            transform: `translate3d(${grabbingTable !== null && grabbingTable === index ? currentPosition?.x : tables[index].position.x}px, ${grabbingTable !== null && grabbingTable === index ? currentPosition?.y : tables[index].position.y}px, 0)`,
            userSelect: "none"
          }}>
            <h2 className="uppercase font-medium border-b-2 border-neutral-600 p-2 mb-2 bg-black/30 text-center">
              {table.name}
            </h2>

            <div className="flex flex-col px-4">
              <article className="flex justify-between items-center text-sm mb-2 uppercase font-medium p-2">
                <p>value</p>
                <p>type</p>
              </article>

              {table && table.rows?.map(
                (row, row_index) => (
                  <article
                  key={row_index}
                  className={"flex justify-between items-center text-sm border-t-2 border-neutral-700 p-2 relative " + ( buttonActive === "connection" && "cursor-pointer" )}
                  id={`row-${table.name}-${row.value}`}
                  onClick={() => {
                  if (buttonActive === "connection") {
                    setRowConnector(prev => {
                      if (prev && prev.table !== table.name) {
                        const newConnectionData = {
                          connector: { table: prev.table, row: prev.value },
                          connected: { table: table.name, row: row.value }
                        };

                        // VALIDACIÓN: Solo agrega si no existe
                        if (!isAlreadyConnected(connections || [], newConnectionData)) {
                          new Connection(
                            newConnectionData.connector,
                            newConnectionData.connected,
                            "oto"
                          );
                        } else {
                          console.warn("Esta conexión ya existe");
                        }
                        return null;
                      }
                      return { table: table.name, value: row.value };
                    });
                  }
                }}>
                    {
                      rowConnector &&
                      rowConnector.table === table.name &&
                      rowConnector.value === row.value && 
                      buttonActive === "connection" && (
                        <span
                        className="w-5 aspect-square block rounded-full border-3 border-neutral-400 z-3 absolute -right-6 top-1/2 -translate-y-1/2 bg-neutral-950 animate-zoom-in"
                        style={{
                          //Custom duration
                          animationDuration: "200ms"
                        }} />
                      )
                    }

                    <p
                    className="lowercase">
                      {row.value || "unnamed row"}
                    </p>

                    <p
                    className="text-text/80 font-light uppercase">
                      {row.type || "n/a"}
                    </p>
                  </article>
                )
              )}
            </div>
          </section>
        ))
      }

      {/* Renderizado de Conexiones */}
      {connections && connections.map((conn, index) => (
        <Xarrow
          key={index}
          start={`row-${conn.connector.table}-${conn.connector.row}`}
          end={`row-${conn.connected.table}-${conn.connected.row}`}
          color="#6b7280" // neutral-500
          strokeWidth={2}
          path="smooth"
          showHead={false} // Quitamos la flecha clásica si prefieres el punto
          // Añadimos el punto en el medio de la línea
          labels={{
            start: (
              <div className="w-5 h-5 bg-neutral-900 rounded-full border-3 border-neutral-400 shadow-sm relative translate-y-1.5" />
            ),
            end: (
              <div className="w-5 h-5 bg-neutral-900 rounded-full border-3 border-neutral-400 shadow-sm relative -translate-y-1.5" />
            )
          }}
          tailShape="circle"
          headShape="circle"
        />
      ))}
      </Xwrapper>
    </div>) : (
      <LoadingDashboard />
    )
  )
}