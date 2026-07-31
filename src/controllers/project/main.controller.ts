import {
  getProjectRequest,
  createProjectRequest,
  updateProjectRequest,
  deleteProjectRequest,
} from "@/client/project";

import type { Status } from "@/types/team.types";
import type { UserData } from "@/types/user.types";

type GetData = {
  token: string;
  id: number;
};
type CreateData = {
  token: string;
  user: UserData;
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

//-------- Main functions --------
export async function getProjectController(data: GetData) {
  const req = await getProjectRequest(data.token, data.id);

  return {
    message: req.data.message,
    project: req.data.team,
    status: req.status
  }
}

export async function createProjectController(data: CreateData) {
  const req = await createProjectRequest(data.token, {
    ...data.project,
    integrants: [
      {
        id: data.user.id,
        email: data.user.email,
        username: data.user.name,
        type: "admin",
        avatar_url: data.user.avatar_url,
      }
    ]
  });

  return {
    message: req.data.message,
    project: req.data.team,
    status: req.status
  }
}

export async function updateProjectController(data: UpdateData) {
  const req = await updateProjectRequest(data.token, data.project);

  return {
    message: req.data.message,
    status: req.status
  }
}

export async function deleteProjectController(data: DeleteData) {
  const req = await deleteProjectRequest(data.token, data.id);

  return {
    message: req.data.message,
    status: req.status
  }
}
