import {
  type Node,
  type Edge
} from "@xyflow/react";

import { UserBasic } from "./user.types";

export type CalendarDateType = "deadline" | "meeting" | "request" | "online-meeting" | "target-start";
export type CalendarDateColors = "blue" | "cyan" | "teal" | "yellow" | "orange" | "red" | "violet" | "purple" | "rose" | "neutral";

export interface CalendarDate {
  title: string;
  description: string;
  creatorId: string;
  creator: UserBasic;

  type: CalendarDateType;
  date: Date;
  color: CalendarDateColors;
}

export interface Ticket {
  creator: string | null;
  creator_id: string;
  to: string;
  title: string;
  message: string;
  importance: "High" | "Medium" | "Low";
  created_at?: string;
  is_completed?: boolean;
}

export interface IntegrantData {
  id: string,
  email: string,
  username: string,
  type?: string,
  avatar_url?: string,
}

export interface ChatMessage {
  message_id?: number;
  sent_id: string;
  team_id: number | string;
  sender_id: number | string;
  sender_email: string;
  sender_name: string;
  sent_at?: Date;
  content: string;
  isEdited?: boolean;
  reactions?: Array<string>;
  status?: "sending" | "sent" | "error";
}

export interface Card {
  id: string,
  title: string;
  created_by: string;
}

export default interface Team {
  team_id: number;
  name: string;
  status: "Backlog" | "Planning" | "In Progress" | "On Hold" | "Done"; //Valid values
  description: string;
  integrants: Array<IntegrantData>;
  integrants_id: Array<string>;
  chat?: Array<any>; //Undefined
  kanban_board: {
    todo: Card [],
    inprogress: Card [],
    done: Card [],
    verified: Card [],
  };
  tags?: Array<string>;
  tickets?: Array<Ticket>
  calendar?: CalendarDate [];
  created_at: string;
  ERD?: Node[];
  ERD_connections?: Edge[];
  json_views: any;
  json_connections: any;
}