//Imports

import Team from "./team.types"

export interface Task {
  title: string,
  isCompleted?: boolean
}

export interface ToDoList {
  title: string,
  description: string,
  tasks?: Array<Task>
}

//User data type
export interface UserData {
  id: string,
  email: string,
  name: string,
  plan: string,
  teams?: Team[],
  ai_chat?: Array<{
    sent_by: string,
    message: string
  }>,
  to_do_list?: Array<ToDoList>,
  created_at?: string,
  last_sign_in?: string,
  avatar_url?: string,
}

//User basic data (for example teammates)
export interface UserBasic {
  id: string,
  email: string,
  username: string
}