import {
  createTodoRequest,
  updateTodoRequest,
  deleteTodoRequest,
} from "@/client/todo";

type CreateTodoData = {
  token: string;
  list_title: string;
  list_description: string;
  tags: string[];
};

type UpdateTodoData = {
  token: string;
  list_index: number;
  title: string;
  description: string;
  tags: string[];
};

type DeleteTodoData = {
  token: string;
  list_index: number;
};

export async function createTodo(data: CreateTodoData) {
  const req = await createTodoRequest(data.token, {
    list_title: data.list_title,
    list_description: data.list_description,
    tags: data.tags,
  });

  return {
    message: req.data.message,
    error: req.data.error,
    status: req.status,
  };
}

export async function updateTodo(data: UpdateTodoData) {
  const req = await updateTodoRequest(data.token, {
    list_index: data.list_index,
    content: {
      title: data.title,
      description: data.description,
      tags: data.tags,
    },
  });

  return {
    message: req.data.message,
    error: req.data.error,
    status: req.status,
  };
}

export async function deleteTodo(data: DeleteTodoData) {
  const req = await deleteTodoRequest(data.token, data.list_index);

  return {
    message: req.data.message,
    error: req.data.error,
    status: req.status,
  };
}
