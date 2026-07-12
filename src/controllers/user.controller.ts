type GetData = {
  token: string;
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
      console.error("Error getting user data:", e.cause);

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
    data: response.data,
    status: response.status
  }
}