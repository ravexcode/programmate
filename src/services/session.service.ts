import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export function getSessionStr() {
  const cookies = `; ${document.cookie}`;

  const parts = cookies.split("; token=");

  if (parts && parts.length === 2) {
    const token = parts.pop()!.split(';').shift();

    return token;
  }

  return null;
}

export function hasSession() {
  if(getSessionStr()) return true;

  return false;
}

export function deleteSessionStr() {
  return document.cookie = "token=; max-age=0; path=/";
}

export function saveSession(token: string) {
  const expires = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

  const cookie = [
    `token=${encodeURIComponent(token)}`,
    `Expires=${expires.toUTCString()}`,
    "Path=/",
    "Secure",
    "SameSite=Lax"
  ].join("; ");

  document.cookie = cookie;
}

export function logOut(router: AppRouterInstance) {
  deleteSessionStr();
  window.localStorage.clear();

  return router.push("/");
}