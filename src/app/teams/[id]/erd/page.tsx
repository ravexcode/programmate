//Client side
"use client";

//React import
import { useState, useRef, type RefObject } from "react";

//Prebuilt ui imports
import CreatorForm from "@/components/forms/creatorForm";
import CreatorInput from "@/components/forms/creatorInputs";
import { IconArrowLeft, IconConnection, IconDatabasePlus, IconMouse } from "@tabler/icons-react";
import Table, { Row } from "@/components/ui/table";

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

  //Ref components
  const dbForm : RefObject<null> = useRef(null);

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
        y: 0
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
    className="text-text scrollbar-hidden">
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 block aspect-square w-150 rounded-full bg-main/20 blur-2xl animate-pulse z-0"></div>
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 block aspect-square w-50 rounded-full bg-white/10 blur-2xl animate-pulse z-1"></div>

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
          <Table
            key={index}
            name={table.name}
            description={table.description}
            rows={table.rows!}
            isConnectionMode={buttonActive === "connection"}
            position={table.position} />
        ))
      }
    </div>
  )
}