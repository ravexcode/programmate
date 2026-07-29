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

const API_KEY = process.env.NEXT_PUBLIC_API_KEY!;

export async function fetchProfile(data: GetData) {
  const req = await fetch(
    `/api/users/me`,
    {
      "method": "GET",
      "headers": {
        "Content-Type": "application/json",
        "nexzero-api-key": API_KEY,
        "Authorization": data.token
      },
    }
  );

  const response = await req.json()
  .catch((e) => {
    if(e instanceof Error) {

      return {
        message: e.message,
        status: req.status
      }
    }

    return {
      message: "Server error",
      status: 500
    }
  });

  return {
    message: response.message,
    data: {
      user: response.user,
      profile: response.profile,
      payments: response.payments,
      projects: response.teams
    },
    status: req.status
  }
}

export async function UpdateUserController(data: UpdateData) {
  const req = await fetch(
    `/api/users/update`,
    {
      "method": "POST",
      "headers": {
        "Content-Type": "application/json",
        "nexzero-api-key": API_KEY,
        "Authorization": data.token
      },
      body: JSON.stringify(data.updatable)
    }
  );

  const response = await req.json()
  .catch((e) => {
    if(e instanceof Error) {

      return {
        message: e.message,
        status: req.status
      }
    }

    return {
      message: "Server error",
      status: 500
    }
  });

  return {
    message: response.message,
    status: req.status
  }
}

export async function updateAiProvidersController(data: UpdateAiProvidersData) {
  const req = await fetch(
    `/api/users/update`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "nexzero-api-key": API_KEY,
        "Authorization": data.token
      },
      body: JSON.stringify({ ai: data.ai_providers })
    }
  );

  const response = await req.json()
  .catch((e) => {
    if(e instanceof Error) {

      return {
        message: e.message,
        status: req.status
      }
    }

    return {
      message: "Server error",
      status: 500
    }
  });

  return {
    message: response.message,
    status: req.status
  }
}