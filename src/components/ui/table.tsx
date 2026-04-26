//React imports
import { useState } from "react";

//Types
//rows
export interface Row {
  value: string;
  type: string;
  connected_at?: {
    table: string;
    value: string;
  };
  connection_type?: string;
}
//Table component props
interface TableComponentProps {
  name: string;
  description?: string;
  rows: Array<Row>;
  isConnectionMode?: boolean;
  position?: {
    x: number;
    y: number;
  }
}
//Row hover props
export interface RowConnector {
  table: string;
  value: string
}

export default function Table( props: TableComponentProps ) {
  const [ rowConnector, setRowConnector ] = useState<RowConnector | null>(null);
  const [ currentMouse, setCurrentMouse ] = useState<string | null>("grab");
  const [ currentPositon, setCurrentPosition ] = useState<{x: number, y: number}>(props.position!);
  const [ offSet, setOffset ] = useState<{x: number, y: number} | null>(null);

  return (
    <section
    className="pb-2 rounded-md bg-neutral-800 w-60 fixed z-2"
    onMouseDown={(e) => {
      if(!props.isConnectionMode) {
        setCurrentMouse("grabbing");
        setOffset({
          x: e.clientX - currentPositon.x,
          y: e.clientY - currentPositon.y
        })
      }
    }}
    onMouseMove={(e) => {
      if(!props.isConnectionMode && currentMouse === "grabbing") {
        setCurrentPosition({
          x: e.clientX - offSet?.x!,
          y: e.clientY - offSet?.y!
        });
      }
    }}
    onMouseUp={() => {
      if(!props.isConnectionMode) {
        setCurrentMouse("grab")
      }
    }}
    style={{
      cursor: props.isConnectionMode ? "default" : currentMouse!,
      transform: `translate3d(${currentPositon.x}px, ${currentPositon.y}px, 0)`,
      userSelect: "none"
    }}>
      <h2 className="uppercase font-medium border-b-2 border-neutral-600 p-2 mb-2 bg-black/30 text-center">
        {props.name}
      </h2>

      <div className="flex flex-col px-4">
        <article className="flex justify-between items-center text-sm mb-2 uppercase font-medium p-2">
          <p>value</p>
          <p>type</p>
        </article>

        {props.rows.map(
          (row, index) => (
            <article
            key={index}
            className={"flex justify-between items-center text-sm border-t-2 border-neutral-700 p-2 relative " + ( props.isConnectionMode && "cursor-pointer" )}
            onClick={() => {
              if(props.isConnectionMode) {
                setRowConnector(
                  prev =>
                  prev &&
                  prev.table === props.name &&
                  prev.value === row.value ?
                  null :
                  {
                    table: props.name,
                    value: row.value
                  }
                )
              }
            }}>
              {
                rowConnector &&
                rowConnector.table === props.name &&
                rowConnector.value === row.value && 
                props.isConnectionMode && (
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
  );
}