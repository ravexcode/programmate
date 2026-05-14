export function useGetCookie(name: string){
  const cookies = `; ${document.cookie}`;

  const parts = cookies.split(`; ${name}=`);

  if (parts && parts.length === 2) {
      return parts.pop()!.split(';').shift();
  }

  return null;
}

export function useGetToken(){
  const cookies = `; ${document.cookie}`;

  const parts = cookies.split('; token=');

  if (parts && parts.length === 2) {
      return parts.pop()!.split(';').shift();
  }

  return null;
}

export function useSaveCookie(name: string, hours: number) {
  const date = new Date();
  date.setTime(date.getTime() + (hours));
  const expires = "; expires=" + date.toUTCString();
  document.cookie = name + "=" + (name || "") + expires + "; path=/; secure";
}

export function useSaveToken(token: string) {
  const date = new Date();
  date.setTime(date.getTime() + (3 * 24 * 60 * 60 * 1000)); //3 Days
  const expires = "; expires=" + date.toUTCString();
  document.cookie = "token=" + token + expires + "; path=/; secure";
}

export function useDeleteCookie(name: string) {
  document.cookie = name + "=; max-age=0; path=/";
}

export function useDeleteToken() {
  document.cookie = "token=; max-age=0; path=/";
}