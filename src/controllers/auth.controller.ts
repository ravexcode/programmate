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

const API_KEY = process.env.NEXT_PUBLIC_API_KEY!;

export async function signInController(credentials: SignInCredentials): Promise<AuthResponse> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "nexzero-api-key": API_KEY,
    },
    body: JSON.stringify(credentials),
  });

  const data = await res.json().catch(() => ({ message: "Server error", status: res.status }));

  return {
    status: res.status,
    message: data.message,
    token: data.token,
  };
}

export async function signUpController(credentials: SignUpCredentials): Promise<AuthResponse> {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "nexzero-api-key": API_KEY,
    },
    body: JSON.stringify(credentials),
  });

  const data = await res.json().catch(() => ({ message: "Server error", status: res.status }));

  return {
    status: res.status,
    message: data.message,
    token: data.token,
  };
}

export function verifyController() {
  const token = getSessionStr();

  return Boolean(token);
}