import {
  fetchProfileRequest,
  updateUserRequest,
  updateAiProvidersRequest,
} from "@/client/user";

type GetData = {
  token: string;
}

type UpdateData = {
  token: string;
  updatable: {
    name: string;
    avatar_url: string;
  }
}

type UpdateAiProvidersData = {
  token: string;
  ai_providers: Array<{
    name: string;
    api_key: string;
    models: string[];
    url?: string;
  }>;
}

export async function fetchProfile(data: GetData) {
  const req = await fetchProfileRequest(data.token);

  return {
    message: req.data.message,
    data: {
      user: req.data.user,
      profile: req.data.profile,
      payments: req.data.payments,
      projects: req.data.teams
    },
    status: req.status
  }
}

export async function UpdateUserController(data: UpdateData) {
  const req = await updateUserRequest(data.token, data.updatable);

  return {
    message: req.data.message,
    status: req.status
  }
}

export async function updateAiProvidersController(data: UpdateAiProvidersData) {
  const req = await updateAiProvidersRequest(data.token, data.ai_providers);

  return {
    message: req.data.message,
    status: req.status
  }
}
