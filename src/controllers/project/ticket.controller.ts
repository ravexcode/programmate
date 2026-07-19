import type { Ticket } from "@/types/team.types";

type CreateData = {
  token: string;
  ticket: Ticket;
  id: number;
}

const API_KEY = process.env.NEXT_PUBLIC_API_KEY!;

export async function createTicketController(data: CreateData) {
  const req = await fetch(
    `/api/teams/${data.id}/tickets`,
    {
      "method": "POST",
      "headers": {
        "Content-Type": "application/json",
        "nexzero-api-key": API_KEY,
        "Authorization": data.token
      },
      body: JSON.stringify({
        ...data.ticket,
        teamId: data.id
      })
    }
  );

  console.warn({
    ...data.ticket,
    teamId: data.id
  })

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
    status: req.status
  }
}