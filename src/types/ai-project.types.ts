import type { Status } from "./team.types";

export interface AiKanbanCard {
  title: string;
}

export interface AiKanbanSpec {
  todo: AiKanbanCard[];
  inprogress: AiKanbanCard[];
  done: AiKanbanCard[];
  verified: AiKanbanCard[];
}

export interface AiTicketSpec {
  title: string;
  message: string;
  importance: "High" | "Medium" | "Low";
}

export interface AiCalendarSpec {
  title: string;
  description: string;
  // YYYY-MM-DD
  date: string;
}

export interface AiProjectSpec {
  project: {
    name: string;
    description: string;
    status: Status;
    tags: string[];
  };
  kanban: AiKanbanSpec;
  tickets: AiTicketSpec[];
  calendar: AiCalendarSpec[];
}
