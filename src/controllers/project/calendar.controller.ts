//Types
import type { CalendarDate } from "@/types/team.types";

type UploadData = {
  id: number;
  content: CalendarDate;
  token: string;
}

type UpdateData = {
  id: number;
  index: number;
  content: CalendarDate;
  token: string;
}

type DeleteData = {
  id: number;
  index: number;
  token: string;
}

const API_KEY = process.env.NEXT_PUBLIC_API_KEY!;

export async function createEventController(data: UploadData) {
  const req = await fetch(
    `/api/teams/${data.id}/calendar`,
    {
      "method": "POST",
      "headers": {
        "Content-Type": "application/json",
        "nexzero-api-key": API_KEY,
        "Authorization": data.token
      },
      body: JSON.stringify({
        event: data.content
      })
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

export async function updateEventController(data: UpdateData) {
  const req = await fetch(
    `/api/teams/${data.id}/calendar`,
    {
      "method": "PUT",
      "headers": {
        "Content-Type": "application/json",
        "nexzero-api-key": API_KEY,
        "Authorization": data.token
      },
      body: JSON.stringify({
        event: data.content,
        eventIndex: data.index
      })
    }
  );

  const response = await req.json()
  .catch((e) => {
    if(e instanceof Error) {
      console.error("Error while updating a event:", e.cause);

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

export async function deleteEventController(data: DeleteData) {
  const req = await fetch(
    `/api/teams/${data.id}/calendar`,
    {
      "method": "DELETE",
      "headers": {
        "Content-Type": "application/json",
        "nexzero-api-key": API_KEY,
        "Authorization": data.token
      },
      "body": JSON.stringify({
        eventIndex: data.index
      })
    }
  );

  const response = await req.json()
  .catch((e) => {
    if(e instanceof Error) {
      console.error("Error while deleting a event:", e.cause);

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