//Next imports
import Link from "next/link";

//Hooks imports
import { IconBrain, IconCalendar, IconLayoutKanban, IconTable, IconLayoutDashboard, IconTicket, IconChecklist, IconUsers, IconArrowUpRight } from "@tabler/icons-react";

//Shared tile classes
const tileClasses =
  "w-full rounded-md border border-neutral-800 bg-neutral-950 p-6 flex flex-col items-start justify-start gap-3 duration-300 hover:border-main hover:-translate-y-1 group";

export interface Capability {
  icon: React.ElementType;
  title: string;
  text: string;
  href?: string;
}

//Product capabilities data
export const capabilities: Capability[] = [
  {
    icon: IconLayoutDashboard,
    title: "Project dashboards",
    text: "Overview your projects, track status and jump back into work.",
  },
  {
    icon: IconTicket,
    title: "Issue tracking",
    text: "Markdown tickets with priorities and assignees, tied to your build.",
    href: "/product",
  },
  {
    icon: IconLayoutKanban,
    title: "Kanban board",
    text: "Drag-and-drop workflow across four stages, from backlog to verified.",
    href: "/product",
  },
  {
    icon: IconTable,
    title: "Database diagrams",
    text: "Design your schema visually and export live SQL or JSON.",
    href: "/product",
  },
  {
    icon: IconCalendar,
    title: "Team calendar",
    text: "Plan sprints and meetings with your whole team.",
    href: "/product",
  },
  {
    icon: IconChecklist,
    title: "To-do lists",
    text: "Personal checklists with autosave, nested tasks and tags.",
    href: "/todo",
  },
  {
    icon: IconBrain,
    title: "NexZero AI",
    text: "Chat with your workflow using OpenAI, Claude or your own models.",
    href: "/ai",
  },
  {
    icon: IconUsers,
    title: "Team management",
    text: "Add members, assign roles and control permissions per project.",
    href: "/product",
  },
];

export default function CapabilitiesGrid() {
  return (
    <div
    className="mt-15 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 justify-center items-stretch w-full gap-6 timeline-view-y animate-fade-in-up animate-range-[entry_0%_cover_30%]">
      {
        capabilities.map((capability) => {
          const content = (
            <>
              <capability.icon
              size={40}
              stroke={1.5}
              className="text-main" />

              <p
              className="font-bold text-lg">
                {capability.title}
              </p>

              <p
              className="text-sm opacity-80 leading-relaxed">
                {capability.text}
              </p>

              {
                capability.href && (
                  <span
                  className="mt-auto flex items-center gap-1 text-sm text-main/80 font-medium opacity-0 -translate-x-2 duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                    Learn more
                    <IconArrowUpRight
                    size={16}
                    stroke={2} />
                  </span>
                )
              }
            </>
          );

          return capability.href ? (
            <Link
            key={capability.title}
            href={capability.href}
            className={tileClasses}>
              {content}
            </Link>
          ) : (
            <div
            key={capability.title}
            className={tileClasses}>
              {content}
            </div>
          );
        })
      }
    </div>
  )
}
