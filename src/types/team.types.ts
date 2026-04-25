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
  sender: string; //Email
  sender_username: string;
  sender_id: string;
  sent_at: string;
  message: string;
  reactions?: Array<string>;

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
}