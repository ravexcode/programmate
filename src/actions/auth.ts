//Hooks imports
import {
  useGetToken,
  useSaveToken
} from "@/hooks/useCookies";

//Actions for auth

//Login action
export async function signIn(
  credentials: {
    email: string,
    password: string
  },
) {

  const res = await fetch(
    "/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
      },
      body: JSON.stringify(credentials),
    }
  );

  //Process the data
  const data = await res.json();

  if(res.status === 200) {
    //Saves the cookie
    useSaveToken(data.token);
    return {
      message: data.message
    };
  }

  return {
    message: data.message,
    error: data,
    status: res.status
  };
}


//Login action
export async function signUp(
  credentials: {
    email: string,
    username: string,
    password: string
  },
  confirm: string
) {

  if(credentials.password !== confirm) return {
    message: "Passwords don't matches",
    error: "Bad request",
    status: 401
  };

  const res = await fetch(
    "/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
      },
      body: JSON.stringify(credentials),
    }
  );

  //Process the data
  const data = await res.json();

  if(res.status === 200) {
    //Saves the cookie
    useSaveToken(data.token);
    return {
      message: data.message
    };
  }

  return {
    message: data.message,
    error: data,
    status: res.status
  };
}

//Verifies session status
export function verify() {
  const token = useGetToken();

  if(!token) return false;

  return true;
}