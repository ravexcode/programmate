//User data type
export interface UserData {
  id: string,
  email: string,
  name: string,
  plan: string,
  teams?: Array<Object | null>,
  ai_chat?: Array<{
    sent_by: string,
    message: string
  }>,
  to_do_list?: Array<{
    title: string,
    description: string,
    tasks?: Array<{
      title: string,
      isCompleted?: boolean,
      expiration_date?: Date
    }>
  }>,
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