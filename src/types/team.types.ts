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
  username: string
}

export interface ChatMessage {
  sender: {
    email: string,
    id: string,
    username: string
  }
  sent_at?: string;
  content: string;
  isEdited?: boolean;
  reactions?: Array<string>;
}

export interface ERDTable {
  name: string,
  description?: string,
  rows?: Array<{
    value: string;
    type: string;
    connected_at?: {
      table: string;
      value: string;
    };
    connection_type?: string;
  }>;
  position: {
    x: number,
    y: number,
    offSet_x?: number,
    offSet_y?: number,
  }
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
  ERD?: Array<ERDTable>;
  ERD_connections?: Array<{
    connector: {
      table: string;
      row: string;
    };
    connected: {
      table: string;
      row: string;
    };
    type: "oto" | "mto" | "mtm";
  }>
}