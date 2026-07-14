import { getSessionStr } from "../session.service"

import * as controllers from "@/controllers/project/main.controller";

import checkStatus from "@/utils/check-status";

import { showSnackbar } from "@/components/ui/snackbar";

import { UserData } from "@/types/user.types";
import { Status } from "@/types/team.types";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"

type GetData = {
  router: AppRouterInstance;
  id: number;
  snackbar: React.RefObject<null>;
};
type CreateData = {
  router: AppRouterInstance;
  snackbar: React.RefObject<null>;
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

export async function getProjectService(data: GetData) {
  const token = getSessionStr();
  const router = data.router;

  if(!token) return router.push("/auth/signin");

  const res = await controllers.getProjectController({
    token,
    id: data.id
  });

  showSnackbar(
    res.message,
    checkStatus(res.status),
    data.snackbar
  )

  if(res.status >= 205) return router.push("/dashboard");

  return res.project;
}

export async function createProjectService(data: CreateData) {
  const token = getSessionStr();
  const router = data.router;

  if(!token) return router.push("/auth/signin");

  const res = await controllers.createProjectController({
    token,
    project: data.project
  });

  showSnackbar(
    res.message,
    checkStatus(res.status),
    data.snackbar
  )

  return res.project;
}

export async function updateProjectService(data: UpdateData) {
  const token = getSessionStr();
  const router = data.router;

  if(!token) return router.push("/auth/signin");

  const res = await controllers.updateProjectController({
    token,
    project: data.project
  });

  showSnackbar(
    res.message,
    checkStatus(res.status),
    data.snackbar
  )

  return;
}

export async function deleteProjectService(data: DeleteData) {
  const token = getSessionStr();
  const router = data.router;

  if(!token) return router.push("/auth/signin");

  const res = await controllers.deleteProjectController({
    token,
    id: data.id
  });

  showSnackbar(
    res.message,
    checkStatus(res.status),
    data.snackbar
  )

  return;
}