type GetData = {
  token: string;
  id: number;
}

const API_KEY = process.env.NEXT_PUBLIC_API_KEY!;

export async function getProjectController(data: GetData) {
  const req = await fetch(
    `/api/teams/${data.id}`,
    {
      "method": "GET",
      "headers": {
        "Content-Type": "application/json",
        "nexzero-api-key": API_KEY,
        "Authorization": data.token
      }
    }
  );

  const response = await req.json()
  .catch((e) => {
    if(e instanceof Error) {
      console.error("Server error: ", e.cause);

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
    project: response.team,
    status: req.status
  }
}