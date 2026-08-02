import { getUser } from "@/modules/user.module";
import { createProject } from "@/modules/project/main.module";

import type { UserData } from "@/types/user.types";
import type { Status } from "@/types/team.types";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export type BuildProject = {
  name: string;
  description: string;
  user: UserData;
  tags: string[];
  status: Status;
};

export const BUILD_STATUS_OPTIONS: Status[] = [
  "Backlog",
  "Planning",
  "In progress",
  "On Hold",
  "Done",
];

export function createEmptyProject(user: UserData): BuildProject {
  return {
    name: "",
    description: "",
    user,
    tags: [],
    status: "Backlog",
  };
}

export async function loadBuildPage(
  router: AppRouterInstance
): Promise<UserData | null> {
  const user = await getUser(router);

  return user ?? null;
}

export function addTag(
  project: BuildProject,
  tag: string
): BuildProject {
  const cleanTag = tag.trim();

  if(!cleanTag) return project;
  if(project.tags.includes(cleanTag)) return project;

  return {
    ...project,
    tags: [...project.tags, cleanTag],
  };
}

export function removeTag(
  project: BuildProject,
  index: number
): BuildProject {
  return {
    ...project,
    tags: project.tags.filter((_, i) => i !== index),
  };
}

export async function submitProject(
  router: AppRouterInstance,
  snackbar: React.RefObject<null>,
  user: UserData,
  project: BuildProject
) {
  const data = await createProject({
    router,
    snackbar,
    user,
    project,
  });

  return data;
}
