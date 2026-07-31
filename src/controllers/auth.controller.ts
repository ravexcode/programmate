import { signInRequest, signUpRequest } from "@/client/auth";
import { getSessionStr } from "@/services/session.service";

type SignInCredentials = {
  email: string;
  password: string;
};

type SignUpCredentials = {
  email: string;
  name: string;
  password: string;
};

type AuthResponse = {
  status: number;
  message?: string;
  token?: string;
};

export async function signInController(credentials: SignInCredentials): Promise<AuthResponse> {
  const res = await signInRequest(credentials);

  return {
    status: res.status,
    message: res.data.message,
    token: res.data.token,
  };
}

export async function signUpController(credentials: SignUpCredentials): Promise<AuthResponse> {
  const res = await signUpRequest(credentials);

  return {
    status: res.status,
    message: res.data.message,
    token: res.data.token,
  };
}

export function verifyController() {
  const token = getSessionStr();

  return Boolean(token);
}
