import {
  type Node,
  type Edge
} from "@xyflow/react"

export interface Ticket {
  creator: string | null; //Username
  to: string; //Email
  message: string;
  importance: "High" | "Medium" | "Low"; //Valid values
  created_at?: string;
}

export interface IntegrantData {
  id: string,
  email: string,
  username: string,
  type?: string,
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

export interface JSONNode {
  id: string;
  label: string;
  type: "object" | "array" | "string" | "number" | "boolean" | "null";
  value?: string | number | boolean | null;
  children?: Array<string>;
  parentId?: string;
  position: {
    x: number;
    y: number;
  };
  offset?: {
    x: number;
    y: number;
  };
}

export interface JSON_views {
  id: string;
  name: string;
  rootNodeId: string;
  nodes: JSONNode [];
}

export interface JSON_connections {
  parent: string;
  child: string;
}

export default interface Team {
  team_id: number;
  name: string;
  status: "Backlog" | "Planning" | "In Progress" | "On Hold" | "Done"; //Valid values
  description: string;
  integrants: Array<IntegrantData>;
  integrants_id?: Array<string>;
  chat?: Array<any>; //Undefined
  kanban_board?: Array<any>; //Undefined
  tags?: Array<string>;
  tickets?: Array<Ticket>
  calendar?: string;
  created_at: string;
  ERD?: Node[];
  ERD_connections?: Edge[];
  json_views: any;
  json_connections: any;
}