import { apiFetch } from "@/utils/http";

export async function getProjectRequest(token: string, id: number) {
  return apiFetch(`/api/teams/${id}`, {
    method: "GET",
    token,
  });
}

export async function createProjectRequest(token: string, project: unknown) {
  return apiFetch("/api/teams", {
    method: "POST",
    token,
    body: project,
  });
}

export async function updateProjectRequest(token: string, project: unknown) {
  return apiFetch("/api/teams", {
    method: "PUT",
    token,
    body: project,
  });
}

export async function deleteProjectRequest(token: string, id: number) {
  return apiFetch(`/api/teams/${id}`, {
    method: "DELETE",
    token,
  });
}

export async function saveKanbanRequest(
  token: string,
  teamId: number,
  kanban_data: unknown
) {
  return apiFetch(`/api/teams/${teamId}/kanban`, {
    method: "POST",
    token,
    body: { kanban_data },
  });
}
