import { useState, useRef } from "react"

interface Props {
  content: {
    id: string;
    title: string;
    created_by: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  sourceList: string;
  isDraggingOver?: boolean;
}

interface Current {
  cursor: string;
  isDragging?: boolean;
}

export default function Card(props: Props) {
  const current_default = {
    cursor: "grab",
    isDragging: false
  };

  const createDragImage = () => {
    const image = document.createElement("div");
    image.style.background = "#1f2937";
    image.style.border = "1px solid #4b5563";
    image.style.borderRadius = "0.375rem";
    image.style.padding = "0.5rem 1rem";
    image.style.color = "white";
    image.style.fontSize = "0.875rem";
    image.textContent = props.content.title || "Card";
    image.style.position = "absolute";
    image.style.left = "-1000px";

    return image;
  }

  const [ current, updateCurrent ] = useState<Current>(current_default);
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <div
    ref={cardRef}
    className={`border rounded-md w-full duration-300 ${
      props.isDraggingOver 
        ? "border-main bg-neutral-800 scale-95" 
        : "border-neutral-700 bg-neutral-900 hover:border-main"
    } ${current.isDragging ? "opacity-50" : ""}`}
    draggable
    style={{
      cursor: current.cursor,
      userSelect: "none",
      WebkitUserSelect: "none",
      msUserSelect: "none"
    }}
    onMouseDown={() => {
      updateCurrent(prev => prev ? {
        ...prev,
        cursor: "grabbing"
      } : current_default);
    }}
    onMouseUp={() => {
      updateCurrent(prev => prev ? {
        ...prev,
        cursor: "grab"
      } : current_default);
    }}
    onDragStart={(e) => {
      updateCurrent(prev => ({...prev, isDragging: true}));
      e.dataTransfer!.effectAllowed = "move";
      e.dataTransfer!.setData("sourceList", props.sourceList);
      e.dataTransfer!.setData("id", props.content.id);
      
      const dragImage = createDragImage();
      document.body.appendChild(dragImage);
      e.dataTransfer!.setDragImage(dragImage, 0, 0);
      setTimeout(() => document.body.removeChild(dragImage), 0);
    }}
    onDragEnd={() => {
      updateCurrent(prev => ({...prev, isDragging: false}));
    }}>

      <main
      className="py-2 px-4">
        <input
        value={props.content.title}
        onChange={props.onChange}
        className="w-full outline-none py-2"
        placeholder="Card title..."
        type="text" />

        <p
        className="text-sm">
          Made by {" "}
          <span
          className="text-sky-600">
            {props.content.created_by}
          </span>
        </p>
      </main>
    </div>
  )
}