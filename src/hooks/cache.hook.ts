//Types imports
import { UserData } from "@/types/user.types";

export function getCached() : UserData | null {
  const cached_user = window.localStorage.getItem("user");
  const cached_at = window.localStorage.getItem("cached_at");
  
  if(!cached_at || !cached_user) return null;

  const cached_at_date = new Date(cached_at);
  const now = new Date();
  const day = 24 * 60 * 60 * 1000;

  if(now.getTime() - cached_at_date.getTime() >= day) return null;

  const user = JSON.parse(cached_user);

  return user;
}