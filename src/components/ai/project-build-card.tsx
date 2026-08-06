import MainButton from "@/components/ui/buttons/main";
import AltButton from "@/components/ui/buttons/alternate";

import { getStatusColor } from "@/client/projects/shared";

import type { AiProjectSpec } from "@/types/ai-project.types";

interface Props {
  spec: AiProjectSpec;
  isCommitting: boolean;
  onCommit: () => void;
  onCancel: () => void;
}

export default function ProjectBuildCard({
  spec,
  isCommitting,
  onCommit,
  onCancel,
}: Props) {
  const { project, kanban, tickets, calendar } = spec;
  const kanbanTotal =
    kanban.todo.length +
    kanban.inprogress.length +
    kanban.done.length +
    kanban.verified.length;

  return (
    <section className="w-full rounded-xl border border-neutral-800 bg-neutral-950 p-4 animate-fade-in-up">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-xl text-sky-600 truncate">{project.name}</h3>
        <span
          className={
            "px-2 py-0.5 rounded-full text-xs text-white shrink-0 " +
            getStatusColor(project.status)
          }>
          {project.status}
        </span>
      </div>

      <p className="text-sm text-neutral-400 mt-2">{project.description}</p>

      {project.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300">
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="grid grid-cols-3 gap-3 mt-4 text-sm">
        <div className="rounded-md bg-neutral-900 p-3">
          <div className="text-neutral-500 text-xs uppercase tracking-wide">
            Kanban
          </div>
          <div className="text-white font-medium mt-1">{kanbanTotal} cards</div>
        </div>
        <div className="rounded-md bg-neutral-900 p-3">
          <div className="text-neutral-500 text-xs uppercase tracking-wide">
            Tickets
          </div>
          <div className="text-white font-medium mt-1">{tickets.length}</div>
        </div>
        <div className="rounded-md bg-neutral-900 p-3">
          <div className="text-neutral-500 text-xs uppercase tracking-wide">
            Calendar
          </div>
          <div className="text-white font-medium mt-1">
            {calendar.length} events
          </div>
        </div>
      </div>

      {tickets.length > 0 && (
        <ul className="mt-3 space-y-1">
          {tickets.slice(0, 3).map((ticket) => (
            <li key={ticket.title} className="text-sm text-neutral-400 truncate">
              <span className="text-neutral-600">- </span>
              {ticket.title}
            </li>
          ))}
          {tickets.length > 3 && (
            <li className="text-xs text-neutral-600">
              +{tickets.length - 3} more
            </li>
          )}
        </ul>
      )}

      <div className="grid grid-cols-2 gap-3 mt-4">
        <AltButton size="w-full" action={onCancel} isLoading={isCommitting}>
          Cancel
        </AltButton>
        <MainButton size="w-full" action={onCommit} isLoading={isCommitting}>
          Commit changes
        </MainButton>
      </div>
    </section>
  );
}
