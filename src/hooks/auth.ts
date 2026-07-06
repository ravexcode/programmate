import { useRouter } from "next/navigation";

import { useEffect } from "react";

import { useGetToken } from "./useCookies";

export function useVerifyLogged() {
  return useEffect(() => {
    const token = useGetToken();
    const router = useRouter();

    if(token) return router.push("/dashboard");
  }, []);
}