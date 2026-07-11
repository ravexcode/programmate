import type { Dispatch, FormEvent, SetStateAction } from "react";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

import {
  signInController,
  signUpController,
  verifyController,
} from "@/controllers/auth.controller";
import { useSaveToken } from "@/hooks/useCookies";

type SignInCredentials = {
  email: string;
  password: string;
};

type SignUpCredentials = {
  email: string;
  name: string;
  password: string;
};

export async function signInService(
  e: FormEvent<HTMLFormElement>,
  credentials: SignInCredentials,
  setLoading: Dispatch<SetStateAction<boolean>>,
  router: AppRouterInstance
) {
  e.preventDefault();

  const response = await signInController(credentials);

  if (response.status === 200 && response.token) {
    useSaveToken(response.token);
    router.push("/dashboard");
    return true;
  }

  setLoading(false);
  return false;
}

export async function signUpService(
  e: FormEvent<HTMLFormElement>,
  credentials: SignUpCredentials,
  setLoading: Dispatch<SetStateAction<boolean>>,
  confirm: string,
  router: AppRouterInstance
) {
  e.preventDefault();

  if (credentials.password !== confirm) {
    setLoading(false);
    return false;
  }

  const response = await signUpController(credentials);

  if (response.status === 201 && response.token) {
    useSaveToken(response.token);
    router.push("/dashboard");
    return true;
  }

  setLoading(false);
  return false;
}

export function verifySessionService() {
  return verifyController();
}
