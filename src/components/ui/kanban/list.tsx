import { useState } from "react"

interface Props {
  type: "todo" | "inprogress" | "done" | "verified",
  children?: React.ReactNode,
  onDrop?: (sourceList: string, id: string, targetPosition?: number) => void,
  itemCount?: number
}

export default function List(props: Props) {
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [dragPosition, setDragPosition] = useState<number | null>(null);

  return (
    <section
    className="min-w-90 bg-neutral-950 h-full border border-neutral-900 flex flex-col">
      <header
      className="text-center w-full p-2 uppercase font-medium tracking-wide"
      style={{
        backgroundColor: (
          props.type === "todo" ? "#c41f14" :
          props.type === "inprogress" ? "#d65302" :
          props.type === "done" ? "#30a612" :
          "#6612a6"
        )
      }}>
        {
          props.type === "todo" ? "to do" :
          props.type === "inprogress" ? "in progress" :
          props.type === "done" ? "done" :
          "verified"
        }
      </header>

      <main
      className={`p-2 flex flex-col gap-3 items-center justify-start flex-1 w-full transition-colors ${
        isDraggingOver ? "bg-neutral-900" : ""
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        setIsDraggingOver(true);
      }}
      onDragLeave={() => {
        setIsDraggingOver(false);
        setDragPosition(null);
      }}
      onDrop={(e) => {
        e.preventDefault();
        setIsDraggingOver(false);
        setDragPosition(null);
        const sourceList = e.dataTransfer.getData("sourceList");
        const id = e.dataTransfer.getData("id");

        console.log(sourceList, id);

        props.onDrop?.(sourceList, id);
      }}>
        { props.children }
      </main>
    </section>
  )
}