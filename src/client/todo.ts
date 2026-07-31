import { apiFetch } from "@/utils/http";

export async function createTodoRequest(
  token: string,
  data: {
    list_title: string;
    list_description: string;
    tags: string[];
  }
) {
  return apiFetch("/api/todos", {
    method: "POST",
    token,
    body: data,
  });
}

export async function updateTodoRequest(
  token: string,
  data: {
    list_index: number;
    content: {
      title: string;
      description: string;
      tags: string[];
    };
  }
) {
  return apiFetch("/api/todos", {
    method: "PUT",
    token,
    body: data,
  });
}

export async function saveTasksRequest(
  token: string,
  list_index: number,
  tasks: unknown[]
) {
  return apiFetch("/api/todos", {
    method: "PUT",
    token,
    body: {
      tasks,
      list_index,
    },
  });
}

export async function deleteTodoRequest(token: string, list_index: number) {
  return apiFetch("/api/todos", {
    method: "DELETE",
    token,
    body: {
      list_index,
    },
  });
}
