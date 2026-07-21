import { getSessionStr } from "@/services/session.service";
import { createTodo, updateTodo, deleteTodo } from "@/controllers/todo.controller";
import { showSnackbar } from "@/components/ui/snackbar";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

type CreateData = {
  router: AppRouterInstance;
  snackbar: React.RefObject<null>;
  list_title: string;
  list_description: string;
  tags: string[];
};

type UpdateData = {
  router: AppRouterInstance;
  snackbar: React.RefObject<null>;
  list_index: number;
  title: string;
  description: string;
  tags: string[];
};

type DeleteData = {
  router: AppRouterInstance;
  snackbar: React.RefObject<null>;
  list_index: number;
};

export async function createTodoService(data: CreateData) {
  const token = getSessionStr();

  if (!token) {
    data.router.push("/auth/signin");
    return { success: false };
  }

  const req = await createTodo({
    token,
    list_title: data.list_title,
    list_description: data.list_description,
    tags: data.tags,
  });

  if (req.status === 401) {
    data.router.push("/auth/signin");
    return { success: false };
  }

  if (req.status >= 205 || req.error) {
    showSnackbar(req.message, "critic", data.snackbar);
    return { success: false };
  }

  return {
    success: true,
    list: {
      title: data.list_title,
      description: data.list_description,
      tags: data.tags,
    },
  };
}

export async function updateTodoService(data: UpdateData) {
  const token = getSessionStr();

  if (!token) {
    data.router.push("/auth/signin");
    return { success: false };
  }

  const req = await updateTodo({
    token,
    list_index: data.list_index,
    title: data.title,
    description: data.description,
    tags: data.tags,
  });

  if (req.status === 401) {
    data.router.push("/auth/signin");
    return { success: false };
  }

  if (req.status >= 205 || req.error) {
    showSnackbar(req.message, "critic", data.snackbar);
    return { success: false };
  }

  return {
    success: true,
    list: {
      title: data.title,
      description: data.description,
      tags: data.tags,
    },
  };
}

export async function deleteTodoService(data: DeleteData) {
  const token = getSessionStr();

  if (!token) {
    data.router.push("/auth/signin");
    return { success: false };
  }

  const req = await deleteTodo({
    token,
    list_index: data.list_index,
  });

  if (req.status === 401) {
    data.router.push("/auth/signin");
    return { success: false };
  }

  if (req.status >= 205 || req.error) {
    showSnackbar(req.message, "critic", data.snackbar);
    return { success: false };
  }

  return { success: true };
}
