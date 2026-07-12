type RequestData = {
  id: number;
  token: string;
  reqEmail: string;
}

const API_KEY = process.env.NEXT_PUBLIC_APY_KEY!;

export async function requestIntegrantController(data: RequestData) {
  const req = await fetch(
    `/api/teams/${data.id}/integrants/request`,
    {
      "method": "POST",
      "headers" : {
        "Content-Type": "application/json",
        "prismaflow-api-key": API_KEY,
        "Authorization": data.token
      }
    }
  );

  const response = await req.json()
  .catch((e) => {
    if(e instanceof Error) {
      console.error("Error while creating a event:", e.cause);

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
    status: response.status
  }
}