"use client";

//React imports
import { useState } from "react";

//Hooks imports
import { IconPlus, IconTrash, IconMarkdown } from "@tabler/icons-react";

type Priority = "High" | "Medium" | "Low";

const priorityStyle: Record<Priority, string> = {
  "High": "bg-red-500/20 text-red-400 border-red-500/40",
  "Medium": "bg-orange-500/20 text-orange-400 border-orange-500/40",
  "Low": "bg-zinc-500/20 text-zinc-400 border-zinc-500/40",
};

const priorityOrder: Priority[] = ["High", "Medium", "Low"];

interface Issue {
  id: number;
  title: string;
  priority: Priority;
  author: string;
}

const seedIssues: Issue[] = [
  { id: 1, title: "Login fails with invalid session token", priority: "High", author: "ravexcode" },
  { id: 2, title: "Drag and drop reorders kanban cards", priority: "Medium", author: "laura_dev" },
  { id: 3, title: "Polish ERD export SQL formatting", priority: "Low", author: "miguel" },
];

export default function TicketsShowcase() {
  const [ issues, setIssues ] = useState<Issue[]>(seedIssues);
  const [ adding, setAdding ] = useState(false);
  const [ title, setTitle ] = useState("");

  const nextId = issues.length + 1;

  const addIssue = () => {
    if(!title.trim()) return;

    setIssues((prev) => [
      ...prev,
      { id: nextId, title: title.trim(), priority: "Medium", author: "you" },
    ]);
    setTitle("");
    setAdding(false);
  };

  const cyclePriority = (id: number) => {
    setIssues((prev) =>
      prev.map((issue) => {
        if(issue.id !== id) return issue;

        const index = priorityOrder.indexOf(issue.priority);
        return { ...issue, priority: priorityOrder[(index + 1) % priorityOrder.length] };
      })
    );
  };

  const deleteIssue = (id: number) => {
    setIssues((prev) => prev.filter((issue) => issue.id !== id));
  };

  return (
    <div
    className="w-full aspect-video rounded-md border border-neutral-800 bg-neutral-950 p-5 flex flex-col overflow-hidden">
      <div
      className="flex justify-between items-center">
        <p
        className="text-sm font-medium tracking-wide">
          Issue tracking <span className="text-main">#issues</span>
        </p>

        <button
        type="button"
        onClick={() => setAdding((prev) => !prev)}
        className="flex items-center gap-1 rounded-md bg-main px-3 py-1 text-xs duration-300 hover:brightness-80">
          <IconPlus
          size={14}
          stroke={2.5} />
          New issue
        </button>
      </div>

      {
        adding && (
          <div
          className="mt-3 rounded-md border border-main/50 bg-main/10 p-3 flex flex-col sm:flex-row gap-2">
            <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addIssue()}
            placeholder="Issue title..."
            className="w-full rounded-sm bg-neutral-900 border border-neutral-800 px-3 py-1.5 text-sm outline-none focus:border-main" />
            <button
            type="button"
            onClick={addIssue}
            className="w-full sm:w-auto rounded-sm bg-main px-4 py-1.5 text-sm duration-300 hover:brightness-80">
              Create
            </button>
          </div>
        )
      }

      <div
      className="mt-3 flex flex-col gap-2 overflow-y-auto scrollbar-hide">
        {
          issues.map((issue) => (
            <div
            key={issue.id}
            className="group rounded-md bg-neutral-900 border border-neutral-800 p-3 flex items-center gap-3 duration-300 hover:border-main">
              <span
              className={"text-[10px] font-medium px-2 py-0.5 rounded-full border w-max " + priorityStyle[issue.priority]}>
                {issue.priority}
              </span>

              <p
              className="flex-1 text-sm truncate">
                {issue.title}
              </p>

              <p
              className="text-xs text-text/50 hidden sm:block">
                @{issue.author}
              </p>

              <div
              className="flex items-center gap-1 opacity-0 group-hover:opacity-100 duration-300">
                <button
                type="button"
                onClick={() => cyclePriority(issue.id)}
                title="Cycle priority"
                className="rounded-sm bg-neutral-800 px-2 py-1 text-[10px] duration-300 hover:bg-neutral-700">
                  Priority
                </button>
                <button
                type="button"
                onClick={() => deleteIssue(issue.id)}
                title="Delete issue"
                className="rounded-sm bg-neutral-800 px-2 py-1 text-neutral-400 duration-300 hover:bg-red-600 hover:text-white">
                  <IconTrash
                  size={12}
                  stroke={2} />
                </button>
              </div>
            </div>
          ))
        }
      </div>

      <p
      className="mt-auto flex items-center gap-1 text-[10px] text-text/40">
        <IconMarkdown
        size={12}
        stroke={2} />
        Markdown supported in issue descriptions
      </p>
    </div>
  )
}
