import type { Status } from "@/types/team.types";
import type {
  AiProjectSpec,
  AiTicketSpec,
  AiCalendarSpec,
} from "@/types/ai-project.types";

const STATUS_VALUES: Status[] = [
  "Backlog",
  "Planning",
  "In progress",
  "On Hold",
  "Done",
];

const IMPORTANCE_VALUES = ["High", "Medium", "Low"];

const LIMITS = {
  name: 80,
  description: 500,
  tagLength: 24,
  tags: 5,
  kanbanTitle: 60,
  kanbanColumn: 10,
  ticketTitle: 80,
  ticketMessage: 300,
  calendarTitle: 80,
  calendarDescription: 200,
  tickets: 15,
  calendar: 10,
};

/**
 * The exact schema expected from the AI. Sent to the model so it knows
 * what shape to return. Keep in sync with AiProjectSpec.
 */
export function buildProjectSystemPrompt(): string {
  return [
    "You are a project builder assistant inside a project management app.",
    "When the user asks to build, create, make, generate, start or scaffold a project, app, application, website, product, system, tool or platform, you MUST respond with ONLY a valid JSON object.",
    "Do not add explanations, markdown, code fences or text outside the JSON object.",
    "The JSON must match EXACTLY this schema:",
    JSON.stringify(
      {
        project: {
          name: "string (required, max 80 chars)",
          description: "string (required, max 500 chars)",
          status: "one of: Backlog, Planning, In progress, On Hold, Done (default Backlog)",
          tags: ["string (max 5 tags, each max 24 chars)"],
        },
        kanban: {
          todo: [{ title: "string" }],
          inprogress: [{ title: "string" }],
          done: [{ title: "string" }],
          verified: [{ title: "string" }],
        },
        tickets: [
          {
            title: "string",
            message: "string",
            importance: "one of: High, Medium, Low",
          },
        ],
        calendar: [
          {
            title: "string",
            description: "string",
            date: "YYYY-MM-DD",
          },
        ],
      },
      null,
      2
    ),
    "Limits: max 10 cards per kanban column, max 15 tickets, max 10 calendar events.",
    "All keys in the JSON are required. Use empty arrays for sections with no content.",
    "When the user does NOT ask to build a project, answer normally and do not include JSON.",
  ].join("\n");
}

/**
 * Folds the build instructions into the last user message so every
 * provider (OpenAI-compatible, Claude, Google, Ollama, Cohere...) sees
 * them without relying on a system role that some providers reject.
 */
export function buildProjectSpecMessages(
  messages: Array<{ role: "user" | "assistant"; content: string }>
): Array<{ role: "user" | "assistant"; content: string }> {
  const system = buildProjectSystemPrompt();

  if (messages.length === 0) return [{ role: "user", content: system }];

  const last = messages[messages.length - 1];
  return [
    ...messages.slice(0, -1),
    { role: last.role, content: `${system}\n\n${last.content}` },
  ];
}

export function isValidStatus(value: unknown): value is Status {
  return (
    typeof value === "string" && STATUS_VALUES.includes(value as Status)
  );
}

function extractJsonObject(text: string): string | null {
  const trimmed = text.trim();
  if (!trimmed) return null;

  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = (fenced ? fenced[1] : trimmed).trim();

  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;

  return candidate.slice(start, end + 1);
}

function sanitizeKanbanColumn(value: unknown) {
  if (!Array.isArray(value)) return [];

  return value
    .map((card) => {
      if (!card || typeof card !== "object") return null;
      const raw = card as { title?: unknown };
      if (typeof raw.title !== "string") return null;
      const title = raw.title.trim().slice(0, LIMITS.kanbanTitle);
      return title.length > 0 ? { title } : null;
    })
    .filter((card): card is { title: string } => card !== null)
    .slice(0, LIMITS.kanbanColumn);
}

function sanitizeTickets(value: unknown): AiTicketSpec[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((raw): AiTicketSpec | null => {
      if (!raw || typeof raw !== "object") return null;
      const ticket = raw as { title?: unknown; message?: unknown; importance?: unknown };
      const title = typeof ticket.title === "string" ? ticket.title.trim().slice(0, LIMITS.ticketTitle) : "";
      const message = typeof ticket.message === "string" ? ticket.message.trim().slice(0, LIMITS.ticketMessage) : "";
      const importance = IMPORTANCE_VALUES.includes(ticket.importance as string)
        ? (ticket.importance as AiTicketSpec["importance"])
        : "Medium";
      if (!title) return null;
      return { title, message: message || title, importance };
    })
    .filter((ticket): ticket is AiTicketSpec => ticket !== null)
    .slice(0, LIMITS.tickets);
}

function sanitizeCalendar(value: unknown): AiCalendarSpec[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((raw): AiCalendarSpec | null => {
      if (!raw || typeof raw !== "object") return null;
      const event = raw as { title?: unknown; description?: unknown; date?: unknown };
      const title = typeof event.title === "string" ? event.title.trim().slice(0, LIMITS.calendarTitle) : "";
      const description = typeof event.description === "string"
        ? event.description.trim().slice(0, LIMITS.calendarDescription)
        : "";
      const date = typeof event.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(event.date)
        ? event.date
        : "";
      if (!title || !date) return null;
      return { title, description, date };
    })
    .filter((event): event is AiCalendarSpec => event !== null)
    .slice(0, LIMITS.calendar);
}

/**
 * Validates and clamps a raw parsed object into a safe AiProjectSpec.
 * Returns null when required fields are missing.
 */
export function sanitizeProjectSpec(raw: unknown): AiProjectSpec | null {
  if (!raw || typeof raw !== "object") return null;

  const spec = raw as Partial<AiProjectSpec>;
  const project = spec.project;

  if (!project || typeof project !== "object") return null;
  if (typeof project.name !== "string" || typeof project.description !== "string") return null;

  const name = project.name.trim().slice(0, LIMITS.name);
  const description = project.description.trim().slice(0, LIMITS.description);
  if (!name || !description) return null;

  const status = isValidStatus(project.status) ? project.status : "Backlog";

  const tags = Array.isArray(project.tags)
    ? project.tags
        .map((tag) => (typeof tag === "string" ? tag.trim().slice(0, LIMITS.tagLength) : ""))
        .filter(Boolean)
        .slice(0, LIMITS.tags)
    : [];

  const kanbanRaw = (spec.kanban ?? {}) as Partial<AiProjectSpec["kanban"]>;

  return {
    project: { name, description, status, tags },
    kanban: {
      todo: sanitizeKanbanColumn(kanbanRaw.todo),
      inprogress: sanitizeKanbanColumn(kanbanRaw.inprogress),
      done: sanitizeKanbanColumn(kanbanRaw.done),
      verified: sanitizeKanbanColumn(kanbanRaw.verified),
    },
    tickets: sanitizeTickets(spec.tickets),
    calendar: sanitizeCalendar(spec.calendar),
  };
}

/**
 * Extracts a valid project spec from an AI text response.
 * Handles markdown code fences and prose around the JSON.
 */
export function extractProjectSpec(text: string): AiProjectSpec | null {
  const json = extractJsonObject(text);
  if (!json) return null;

  try {
    return sanitizeProjectSpec(JSON.parse(json));
  } catch {
    return null;
  }
}
