import { UserData } from "@/types/user.types";

export function getCached() : UserData | null {
  const cached_user = window.localStorage.getItem("user");

  if(!cached_user) return null

  const user = JSON.parse(cached_user!);

  return user;
}