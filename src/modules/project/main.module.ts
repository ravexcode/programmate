import {
  getProjectService,
  createProjectService,
  updateProjectService,
  deleteProjectService,
  getTeamService
} from "@/services/project/main.service";

import type { UserData } from "@/types/user.types";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import type { Status, Team } from "@/types/team.types";

type GetData = {
  router: AppRouterInstance;
  id: number;
  snackbar: React.RefObject<null>;
};
type CreateData = {
  router: AppRouterInstance;
  snackbar: React.RefObject<null>;
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
  router: AppRouterInstance;
  snackbar: React.RefObject<null>;
  project: {
    id: number;
    name: string;
    description: string;
    status: Status;
    tags: string [];
  };
};
type DeleteData = {
  router: AppRouterInstance;
  id: number;
  snackbar: React.RefObject<null>;
};

export async function getProject(data: GetData) {
  const res = await getProjectService(data);

  return res;
}

export async function createProject(data: CreateData) {
  const res = await createProjectService(data);

  return res;
}

export async function updateProject(data: UpdateData) {
  const res = await updateProjectService(data);

  return res;
}

export async function deleteProjectControllerProject(data: DeleteData) {
  const res = await deleteProjectService(data);

  return res;
}

export async function getTeam(data: { id: number; router: AppRouterInstance; snackbar: React.RefObject<null> }) {
  const res = await getTeamService(data);
  
  return res;
}
