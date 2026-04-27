//Client side
"use client";

//React import
import { useState, useRef, type RefObject } from "react";

//Prebuilt ui imports
import CreatorForm from "@/components/forms/creatorForm";
import CreatorInput from "@/components/forms/creatorInputs";
import { IconArrowLeft, IconConnection, IconDatabasePlus, IconMouse } from "@tabler/icons-react";
import { Row } from "@/components/ui/table";

//Types imports
import { type ERDTable } from "@/types/team.types";
import { useParams } from "next/navigation";


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
  const [ tables, setTables ] = useState<Array<ERDTable>>([
    {
      name: "users",
      description: "Lorem Ipsum ...",
      rows: [
        {
          value: "id",
          type: "pk"
        },
        {
          value: "username",
          type: "text"
        },
        {
          value: "email",
          type: "text"
        },
        {
          value: "password",
          type: "text"
        },
        {
          value: "posts",
          type: "jsonb[]",
          connected_at: {
            table: "posts",
            value: "post_id"
          },
          connection_type: "many-to-one"
        },
        {
          value: "created_at",
          type: "timestampz"
        },
      ],
      position: {
        x: 100,
        y: 150
      }
    },
    {
      name: "posts",
      description: "Lorem Ipsum ...",
      rows: [
        {
          value: "post_id",
          type: "pk"
        },
        {
          value: "user_id",
          type: "int",
          connected_at: {
            table: "users",
            value: "id"
          },
          connection_type: "one-to-one"
        },
        {
          value: "content",
          type: "text"
        },
        {
          value: "reposts",
          type: "jsonb[]"
        },
        {
          value: "comments",
          type: "jsonb[]"
        },
        {
          value: "likes",
          type: "jsonb[]"
        },
        {
          value: "views",
          type: "number"
        },
      ],
      position: {
        x: 500,
        y: 300
      }
    }
  ]);

  //Table states
  const [ currentMouse, setCurrentMouse ] = useState<string>("grab");
  const [ rowConnector, setRowConnector ] = useState<{
    table: string,
    value: string
  } | null>();
  const [ currentPosition, setCurrentPosition ] = useState<{
    x: number,
    y: number
  }>();

  interface ConnectionType {
      table: string,
      row: string
    };

  const [ grabbingTable, setGrabbingTable ] = useState<number | null>(null);
  const [ connections, setConnections ] = useState<Array<ConnectionType> | null>(null);

  //Connections full class
  class ConnectionClass {
    //Type
    private table: string;
    private row: string;

    //Constructor (new)
    constructor(
      table: string,
      row: string
    ) {
      this.table = table;
      this.row = row;

      //Auto Adds
      const connection : ConnectionType = {
        table: this.table,
        row: this.row
      };
      
      setConnections(
        curr => curr ? [
          ...curr,
          connection
        ] : [
          connection
        ]
      )
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

  const HandleUpdatePosition = (
    //Vales after moving
    index: number,
    x: number,
    y: number
  ) => {
    //Verifies if is valid
    if(!tables || !tables[index]) return;

    //Duplicate the table
    let duplied_tables = tables;
    //Sets values
    duplied_tables[index].position.x = x;
    duplied_tables[index].position.y = y;

    //Update tables
    setTables(duplied_tables);
  };

  const HandleUpdateOffSet = (
    //Values before moving
    index: number,
    x: number,
    y: number
  ) => {
    //Verifies
    if(!tables || !tables[index]) return;

    //Duplies the tables
    let duplied_tables = tables;
    //Sets offsets values
    duplied_tables[index].position.offSet_x = x;
    duplied_tables[index].position.offSet_y = y;

    //Updates tables
    setTables(duplied_tables);
  };

  //Function for connectiing tables values
  const handleConnectRows = (
    connector: ConnectionType,
    connected: ConnectionType,
  ) => {
    //Add connection logic
  }

  //Function for open database create form
  const toggleDBForm = () => {
    //Prevent errors
    if(!dbForm.current) return;

    const current : HTMLElement = dbForm.current;

    //Verifies class
    if(current.classList.contains("hidden")) {
      //Is hidden
      current.classList.remove("hidden");
      setButtonActive("create")
      return;
    };

    //Is shown
    current.classList.add("hidden");
    setButtonActive("mouse")
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
    <div
    className="text-text scrollbar-hidden dotted-background w-screen h-screen"
    onMouseDown={(e) => {
      setCurrentMouse("grabbing");
    }}
    onMouseMove={(e) => {
      if(
        buttonActive !== "connection" &&
        currentMouse === "grabbing"
      ) {
        setCurrentPosition({
          x: e.clientX - tables[grabbingTable!].position.offSet_x!,
          y: e.clientY - tables[grabbingTable!].position.offSet_y!,
        });
      }
    }}
    onMouseUp={() => {
      setCurrentMouse("grab");
    }}>

      <div
      ref={dbForm}
      onClick={toggleDBForm}
      className="fixed w-screen h-screen top-0 left-0 backdrop-blur brightnes-70 animate-fade-in z-20 flex justify-center py-10 hidden overflow-auto">

        <CreatorForm
        action={(e) => {
          handleCreateTable(e);
        }}
        title="Create a new table"
        hideAction={toggleDBForm}
        actionIsDisabled={!rows || !dbName}>

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

          <button
          type="button"
          className="w-full bg-neutral-800 border-2 border-dashed border-neutral-600 text-neutral-400 py-2 rounded-md cursor-pointer duration-200 hover:brightness-80"
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

          {
            rows && rows.length > 0 && rows.map((row: Row, index: number) => 
              <div
              key={index}
              className="w-full mt-2 flex flex-col justify-center items-center">
                <label
                className="text-sm text-neutral-300"> Row #{index + 1} </label>
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

                <button
                type="button"
                className="w-max mx-auto text-xs text-center px-4 py-2 rounded-sm duration-300 bg-red-700 hover:bg-red-900 cursor-pointer"
                onClick={() => {
                  setRows(prev =>
                    prev.filter(
                      (_, row_index) => row_index !== index
                    )
                  )
                }}>
                  Delete a This row
                </button>
              </div>
            )
          }

          <span className="h-6"></span>

        </CreatorForm>
      </div>

      <section
      className="fixed bottom-2 left-1/2 -translate-x-1/2 bg-neutral-800 rounded-sm px-8 py-2 z-2 flex gap-3">

        <button
        className={"p-3 rounded-lg cursor-pointer duration-200 " + (buttonActive === "mouse" ? "backdrop-brightness-60 hover:backdrop-brightness-40" : "hover:backdrop-brightness-80")}
        onClick={() => {
          setButtonActive("mouse")
        }}>
          <IconMouse
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

      </section>

      <a
      href={`/teams/${params.id}`}
      className="z-10 fixed top-2 left-2 cursor-pointer duration-200 p-3 rounded-full hover:bg-white/20">
        <IconArrowLeft
        size={25} />
      </a>

      {
        tables && tables.length > 0 && tables.map((table, index) => (
          <section
          key={index}
          className="pb-2 rounded-md bg-neutral-800 w-60 fixed z-2 border-2 border-neutral-600"
          onMouseDown={(e) => {
            if(buttonActive !== "connection") {
              HandleUpdateOffSet(
                index,
                e.clientX - tables[index].position.x,
                e.clientY - tables[index].position.y,
              );
              setGrabbingTable(index);
            }
          }}
          onMouseMove={(e) => {
            if(
              buttonActive !== "connection" &&
              currentMouse === "grabbing"
            ) {
              setCurrentPosition({
                x: e.clientX - tables[index].position.offSet_x!,
                y: e.clientY - tables[index].position.offSet_y!,
              });
            }
          }}
          onMouseUp={() => {
            if(buttonActive !== "connection") {
              HandleUpdatePosition(index, currentPosition?.x!, currentPosition?.y!);
              setGrabbingTable(null);
            }
          }}
          style={{
            cursor: buttonActive === "connection" ? "default" : currentMouse!,
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
                (row, index) => (
                  <article
                  key={index}
                  className={"flex justify-between items-center text-sm border-t-2 border-neutral-700 p-2 relative " + ( buttonActive === "connection" && "cursor-pointer" )}
                  onClick={() => {
                    if(buttonActive === "connection") {
                      setRowConnector(
                        prev =>
                        prev && prev.table === table.name && prev.value === row.value ?
                        null :
                        {
                          table: table.name,
                          value: row.value
                        }
                      )
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

                    <p>
                      {row.value}
                    </p>

                    <p
                    className="text-text/80 font-light uppercase">
                      {row.type}
                    </p>
                  </article>
                )
              )}
            </div>
          </section>
        ))
      }
    </div>
  )
}