import {
  createTodoService,
  updateTodoService,
  deleteTodoService,
} from "@/services/todo.service";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export async function createTodo(
  router: AppRouterInstance,
  snackbar: React.RefObject<null>,
  data: {
    list_title: string;
    list_description: string;
    tags: string[];
  }
) {
  return createTodoService({
    router,
    snackbar,
    ...data,
  });
}

export async function updateTodo(
  router: AppRouterInstance,
  snackbar: React.RefObject<null>,
  data: {
    list_index: number;
    title: string;
    description: string;
    tags: string[];
  }
) {
  return updateTodoService({
    router,
    snackbar,
    ...data,
  });
}

export async function deleteTodo(
  router: AppRouterInstance,
  snackbar: React.RefObject<null>,
  list_index: number
) {
  return deleteTodoService({
    router,
    snackbar,
    list_index,
  });
}
