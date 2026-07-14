import type { Status} from "@/types/team.types";
import type { UserData } from "@/types/user.types";

type GetData = {
  token: string;
  id: number;
};
type CreateData = {
  token: string;
  project: {
    name: string;
    description: string;
    user: UserData;
    tags: string [];
    status: Status;
  };
};
type UpdateData = {
  token: string;
  project: {
    id: number;
    name: string;
    description: string;
    status: Status;
    tags: string [];
  };
};
type DeleteData = {
  token: string;
  id: number;
}

const API_KEY = process.env.NEXT_PUBLIC_API_KEY!;

//-------- Main functions --------
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

export async function createProjectController(data: CreateData) {
  const req = await fetch(
    "/api/teams",
    {
      "method": "POST",
      "headers": {
        "Content-Type": "application/json",
        "nexzero-api-key": API_KEY,
        "Authorization": data.token
      },
      body: JSON.stringify(data.project)
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

export async function updateProjectController(data: UpdateData) {
  const req = await fetch(
    "/api/teams",
    {
      "method": "PUT",
      "headers": {
        "Content-Type": "application/json",
        "nexzero-api-key": API_KEY,
        "Authorization": data.token
      },
      body: JSON.stringify(data.project)
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
    status: req.status
  }
}

export async function deleteProjectController(data: DeleteData) {
  const req = await fetch(
    `/api/teams/${data.id}`,
    {
      "method": "DELETE",
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
    status: req.status
  }
}