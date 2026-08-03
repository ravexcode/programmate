"use client";

//React imports
import { useState } from "react";

//Hooks imports
import { IconPlus } from "@tabler/icons-react";

const columns = [
  { id: "todo", title: "To do", color: "bg-blue-400" },
  { id: "progress", title: "In progress", color: "bg-orange-400" },
  { id: "done", title: "Done", color: "bg-purple-500" },
] as const;

type ColumnId = typeof columns[number]["id"];

const seedCards: Record<ColumnId, string[]> = {
  todo: ["Design landing page", "Set up Stripe webhooks"],
  progress: ["ERD for payments", "AI provider picker"],
  done: ["Project dashboard", "Auth with Supabase"],
};

export default function KanbanShowcase() {
  const [ cards, setCards ] = useState<Record<ColumnId, string[]>>(seedCards);
  const [ dragging, setDragging ] = useState<string | null>(null);
  const [ addingTo, setAddingTo ] = useState<ColumnId | null>(null);
  const [ draft, setDraft ] = useState("");

  const moveCard = (card: string, to: ColumnId) => {
    setCards((prev) => {
      const from = columns.find((column) => prev[column.id].includes(card))?.id;

      if(!from || from === to) return prev;

      return {
        ...prev,
        [from]: prev[from].filter((title) => title !== card),
        [to]: [...prev[to], card],
      };
    });
  };

  const addCard = (column: ColumnId) => {
    if(!draft.trim()) return;

    setCards((prev) => ({ ...prev, [column]: [...prev[column], draft.trim()] }));
    setDraft("");
    setAddingTo(null);
  };

  return (
    <div
    className="w-full aspect-video rounded-md border border-neutral-800 bg-neutral-950 p-5 flex flex-col overflow-hidden">
      <p
      className="text-sm font-medium tracking-wide">
        Kanban board <span className="text-main">drag &amp; drop</span>
      </p>

      <div
      className="mt-3 grid grid-cols-3 gap-3 flex-1 overflow-hidden">
        {
          columns.map((column) => (
            <div
            key={column.id}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => dragging && moveCard(dragging, column.id)}
            className="rounded-md bg-neutral-900 border border-neutral-800 p-2 flex flex-col gap-2 overflow-y-auto scrollbar-hide">
              <div
              className="flex items-center justify-between">
                <p
                className="flex items-center gap-2 text-xs font-medium tracking-wide">
                  <span
                  className={"h-1.5 w-1.5 rounded-full block " + column.color} />
                  {column.title}
                </p>

                <button
                type="button"
                onClick={() => setAddingTo((prev) => prev === column.id ? null : column.id)}
                className="rounded-sm bg-neutral-800 p-0.5 text-neutral-400 duration-300 hover:bg-neutral-700 hover:text-white">
                  <IconPlus
                  size={12}
                  stroke={2.5} />
                </button>
              </div>

              {
                addingTo === column.id && (
                  <div
                  className="flex flex-col gap-1">
                    <input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addCard(column.id)}
                    placeholder="Task name..."
                    className="w-full rounded-sm bg-neutral-950 border border-neutral-800 px-2 py-1 text-xs outline-none focus:border-main" />
                    <button
                    type="button"
                    onClick={() => addCard(column.id)}
                    className="w-full rounded-sm bg-main px-2 py-1 text-xs duration-300 hover:brightness-80">
                      Add
                    </button>
                  </div>
                )
              }

              {
                cards[column.id].map((card) => (
                  <div
                  key={card}
                  draggable
                  onDragStart={() => setDragging(card)}
                  onDragEnd={() => setDragging(null)}
                  className="cursor-grab active:cursor-grabbing rounded-sm bg-neutral-950 border border-neutral-800 px-2.5 py-2 text-xs duration-300 hover:border-main">
                    {card}
                  </div>
                ))
              }
            </div>
          ))
        }
      </div>
    </div>
  )
}
