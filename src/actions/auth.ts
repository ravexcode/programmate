//Hooks imports
import {
  useGetToken,
  useSaveToken
} from "@/hooks/useCookies";
import { useRouter } from "next/navigation";

//Actions for auth

//Login action
export async function signIn(
  e: React.SubmitEvent<HTMLFormElement>,
  credentials: {
    email: string,
    password: string
  },
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) {
  e.preventDefault();
  const router = useRouter();

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
    return router.push("/dashboard");
  }

  return setLoading(false);
}


//Login action
export async function signUp(
  e: React.SubmitEvent<HTMLFormElement>,
  credentials: {
    email: string,
    name: string,
    password: string
  },
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  confirm: string
) {
  e.preventDefault();
  const router = useRouter();

  if(credentials.password !== confirm) return setLoading(false);

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

  if(res.status === 201) {
    //Saves the cookie
    useSaveToken(data.token);
    return router.push("/dashboard");
  }

  return setLoading(false);
}

//Verifies session status
export function verify() {
  const token = useGetToken();

  if(!token) return false;

  return true;
}