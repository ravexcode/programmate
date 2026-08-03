"use client";

//React imports
import { useState } from "react";

//Dnd-kit imports
import { DndContext, PointerSensor, useDraggable, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";

//Hooks imports
import { IconPlus, IconTable } from "@tabler/icons-react";

interface TableRow {
  name: string;
  type: string;
}

interface ErTable {
  id: number;
  title: string;
  x: number;
  y: number;
  rows: TableRow[];
}

const seedTables: ErTable[] = [
  {
    id: 1,
    title: "users",
    x: 24,
    y: 40,
    rows: [
      { name: "id", type: "uuid" },
      { name: "email", type: "text" },
      { name: "created_at", type: "timestamp" },
    ],
  },
  {
    id: 2,
    title: "projects",
    x: 320,
    y: 80,
    rows: [
      { name: "id", type: "uuid" },
      { name: "owner_id", type: "uuid" },
      { name: "name", type: "text" },
    ],
  },
];

function TableNode(props: {
  table: ErTable;
  dragging: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: props.table.id,
  });

  const style = {
    left: props.table.x,
    top: props.table.y,
    zIndex: isDragging || props.dragging ? 20 : 10,
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
  };

  return (
    <div
    ref={setNodeRef}
    suppressHydrationWarning
    style={style}
    {...attributes}
    {...listeners}
    className={"absolute w-44 cursor-grab active:cursor-grabbing select-none rounded-md border overflow-hidden " + (isDragging ? "border-main shadow-lg shadow-main/20" : "border-neutral-700 bg-neutral-900")}>
      <p
      className="px-3 py-1.5 text-xs font-bold bg-main/20 border-b border-main/40 flex items-center gap-2">
        <IconTable
        size={12}
        stroke={2} />
        {props.table.title}
      </p>

      <div
      className="px-2 py-1.5 flex flex-col gap-1">
        {
          props.table.rows.map((row) => (
            <div
            key={row.name}
            className="flex items-center justify-between gap-2 text-[10px]">
              <span
              className="text-text/80">
                {row.name}
              </span>
              <span
              className="text-main/70 font-mono">
                {row.type}
              </span>
            </div>
          ))
        }
      </div>
    </div>
  );
}

export default function ErdShowcase() {
  const [ tables, setTables ] = useState<ErTable[]>(seedTables);
  const [ activeId, setActiveId ] = useState<number | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event;

    setTables((prev) =>
      prev.map((table) =>
        table.id === active.id
          ? {
              ...table,
              x: Math.max(0, Math.min(560 - 176, table.x + delta.x)),
              y: Math.max(0, Math.min(320 - 120, table.y + delta.y)),
            }
          : table
      )
    );
    setActiveId(null);
  };

  const addTable = () => {
    const nextId = Math.max(...tables.map((table) => table.id), 0) + 1;

    setTables((prev) => [
      ...prev,
      {
        id: nextId,
        title: "table_" + nextId,
        x: 120 + Math.min(prev.length * 40, 120),
        y: 140 + Math.min(prev.length * 30, 80),
        rows: [
          { name: "id", type: "uuid" },
          { name: "name", type: "text" },
        ],
      },
    ]);
  };

  return (
    <div
    className="w-full aspect-video rounded-md border border-neutral-800 bg-neutral-950 flex flex-col overflow-hidden">
      <div
      className="flex justify-between items-center px-5 py-3 border-b border-neutral-800">
        <p
        className="text-sm font-medium tracking-wide">
          Database diagram <span className="text-main">drag the tables</span>
        </p>

        <button
        type="button"
        onClick={addTable}
        className="flex items-center gap-1 rounded-md bg-main px-3 py-1 text-xs duration-300 hover:brightness-80">
          <IconPlus
          size={14}
          stroke={2.5} />
          Table
        </button>
      </div>

      <div
      className="relative flex-1 dotted-background overflow-hidden"
      onDragOver={(e) => e.preventDefault()}>
        <DndContext
        sensors={sensors}
        onDragStart={(event) => setActiveId(event.active.id as number)}
        onDragEnd={handleDragEnd}>
          {
            tables.map((table) => (
              <TableNode
              key={table.id}
              table={table}
              dragging={activeId === table.id} />
            ))
          }
        </DndContext>
      </div>
    </div>
  )
}
