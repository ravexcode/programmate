import { deleteCookie } from "cookies-next/client";

async function returnToLogin() {
  await deleteCookie("token");
  window.localStorage.clear();

  window.location.href = "/login";
}

export function getCached() {
  const cached_user = window.localStorage.getItem("user");

  if(!cached_user) return returnToLogin();

  const user = JSON.parse(cached_user!);

  return user;
}