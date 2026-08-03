"use client";

//React imports
import { useState } from "react";

//Hooks imports
import { IconPlus } from "@tabler/icons-react";

//Status colors (matches mini-dashboard card)
const statusColor: Record<string, string> = {
  "Backlog": "bg-zinc-500",
  "Planning": "bg-blue-400",
  "In Progress": "bg-orange-400",
  "On Hold": "bg-red-400",
  "Done": "bg-purple-500",
};

const statuses = ["Backlog", "Planning", "In Progress", "On Hold", "Done"];

interface Project {
  title: string;
  description: string;
  status: string;
  tags: string[];
}

const seedProjects: Project[] = [
  {
    title: "NovaCommerce",
    description: "Modern e-commerce solution with inventory and order management",
    status: "Done",
    tags: ["NextJS", "TailwindCSS", "PostgreSQL"],
  },
  {
    title: "InsightHub",
    description: "Analytics dashboard for tracking business performance and KPIs",
    status: "Planning",
    tags: ["React", "ChartJS", "NodeJS"],
  },
  {
    title: "PixelStudio",
    description: "Creative asset management platform for designers and content teams",
    status: "In Progress",
    tags: ["NextJS", "React", "MongoDB"],
  },
];

export default function DashboardShowcase() {
  const [ projects, setProjects ] = useState<Project[]>(seedProjects);
  const [ adding, setAdding ] = useState(false);
  const [ title, setTitle ] = useState("");
  const [ status, setStatus ] = useState("Backlog");

  const addProject = () => {
    if(!title.trim()) return;

    setProjects((prev) => [
      ...prev,
      {
        title: title.trim(),
        description: "Fresh project added from the showcase.",
        status,
        tags: ["New"],
      },
    ]);
    setTitle("");
    setStatus("Backlog");
    setAdding(false);
  };

  return (
    <div
    className="w-full aspect-video rounded-md border border-neutral-800 bg-neutral-950 p-5 flex flex-col overflow-hidden">
      <div
      className="flex justify-between items-center">
        <p
        className="text-sm font-medium tracking-wide">
          Welcome back! <span className="text-main">Here are your projects</span>
        </p>

        <button
        type="button"
        onClick={() => setAdding((prev) => !prev)}
        className="flex items-center gap-1 rounded-md bg-main px-3 py-1 text-xs duration-300 hover:brightness-80">
          <IconPlus
          size={14}
          stroke={2.5} />
          New project
        </button>
      </div>

      {
        adding && (
          <div
          className="mt-3 rounded-md border border-main/50 bg-main/10 p-3 flex flex-col sm:flex-row gap-2">
            <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addProject()}
            placeholder="Project name..."
            className="w-full rounded-sm bg-neutral-900 border border-neutral-800 px-3 py-1.5 text-sm outline-none focus:border-main" />
            <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full sm:w-40 rounded-sm bg-neutral-900 border border-neutral-800 px-3 py-1.5 text-sm outline-none focus:border-main">
              {
                statuses.map((option) => (
                  <option
                  key={option}
                  value={option}>
                    {option}
                  </option>
                ))
              }
            </select>
            <button
            type="button"
            onClick={addProject}
            className="w-full sm:w-auto rounded-sm bg-main px-4 py-1.5 text-sm duration-300 hover:brightness-80">
              Add
            </button>
          </div>
        )
      }

      <div
      className="mt-3 grid grid-cols-2 gap-3 overflow-y-auto scrollbar-hide">
        {
          projects.map((project) => (
            <div
            key={project.title}
            className="rounded-md bg-neutral-900 border border-neutral-800 p-3 flex flex-col duration-300 hover:border-main">
              <p
              className="text-sm font-medium tracking-wide">
                {project.title}
              </p>

              <p
              className="mt-1 flex gap-2 text-xs items-center">
                <span
                className={"h-1.5 w-1.5 rounded-full block " + (statusColor[project.status] ?? "bg-zinc-500")} />
                {project.status}
              </p>

              <p
              className="text-xs text-text/60 line-clamp-2 leading-relaxed mt-1">
                {project.description}
              </p>

              <div
              className="flex gap-1 mt-2 flex-wrap">
                {
                  project.tags.map((tag) => (
                    <span
                    key={tag}
                    className="scale-90 px-2.5 py-0.5 rounded-full text-[10px] font-light border border-main/50 bg-main/20 text-text/80 w-max">
                      {tag}
                    </span>
                  ))
                }
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}
