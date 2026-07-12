import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

import {
  signInService,
  signUpService,
  verifySessionService,
} from "@/services/auth.service";

type SignInCredentials = {
  email: string;
  password: string;
};

type SignUpCredentials = {
  email: string;
  name: string;
  password: string;
};

export function signInModule(
  e: React.SubmitEvent<HTMLFormElement>,
  credentials: SignInCredentials,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  router: AppRouterInstance
) {
  return signInService(
    e,
    credentials,
    setLoading, 
    router
  );
}

export function signUpModule(
  e: React.SubmitEvent<HTMLFormElement>,
  credentials: SignUpCredentials,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  confirm: string,
  router: AppRouterInstance
) {
  return signUpService(
    e,
    credentials,
    setLoading, 
    confirm,
    router
  );
}

export function verifyModule() {
  return verifySessionService();
}
