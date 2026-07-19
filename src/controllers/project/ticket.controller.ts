import type { Ticket } from "@/types/team.types";

type CreateData = {
  token: string;
  ticket: Ticket;
  id: number;
}

type UpdateData = {
  token: string;
  ticket: Ticket;
  id: number;
  index: number;
}

type RequestData = {
  token: string;
  teamId: number;
  index?: number;
}

const API_KEY = process.env.NEXT_PUBLIC_API_KEY!;

async function handleResponse(req: Response) {
  const response = await req.json()
    .catch((e) => {
      if (e instanceof Error) {
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
    status: req.status,
    data: response.data || response
  }
}

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

  return handleResponse(req);
}

export async function updateTicketController(data: UpdateData) {
  const req = await fetch(
    `/api/teams/${data.id}/tickets`,
    {
      "method": "PUT",
      "headers": {
        "Content-Type": "application/json",
        "nexzero-api-key": API_KEY,
        "Authorization": data.token
      },
      body: JSON.stringify({
        ...data.ticket,
        index: data.index,
        teamId: data.id
      })
    }
  );

  return handleResponse(req);
}

export async function getTicketController(data: RequestData) {
  const req = await fetch(
    `/api/teams/${data.teamId}/tickets/${data.index}`,
    {
      "method": "GET",
      "headers": {
        "nexzero-api-key": API_KEY,
        "Authorization": data.token
      }
    }
  );

  return handleResponse(req);
}

export async function deleteTicketController(data: RequestData) {
  const req = await fetch(
    `/api/teams/${data.teamId}/tickets/${data.index}`,
    {
      "method": "DELETE",
      "headers": {
        "nexzero-api-key": API_KEY,
        "Authorization": data.token
      }
    }
  );

  return handleResponse(req);
}
